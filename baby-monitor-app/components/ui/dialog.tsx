// src/ui/dialog.tsx (React Native 버전)

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

const useDialogContext = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error('Dialog.* 컴포넌트는 <Dialog> 안에서만 사용할 수 있습니다.');
  }
  return ctx;
};

export interface DialogProps {
  open?: boolean;          // 완전 제어형
  defaultOpen?: boolean;   // 비제어 초기값
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog: FC<DialogProps> = ({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const setOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  return (
    <DialogContext.Provider value={{ open: actualOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

export interface DialogTriggerProps {
  children: ReactNode;
}

export const DialogTrigger: FC<DialogTriggerProps> = ({ children }) => {
  const { setOpen } = useDialogContext();
  return (
    <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
};

export interface DialogContentProps {
  children: ReactNode;
  dismissOnBackdropPress?: boolean;
}

export const DialogContent: FC<DialogContentProps> = ({
  children,
  dismissOnBackdropPress = true,
}) => {
  const { open, setOpen } = useDialogContext();

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <Pressable
        style={styles.backdrop}
        onPress={dismissOnBackdropPress ? () => setOpen(false) : undefined}
      >
        <View style={styles.centered}>
          {/* 안쪽 Pressable로 이벤트 막아서 내용 눌러도 닫히지 않게 */}
          <Pressable style={styles.content}>
            {children}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export const DialogHeader: FC<{ children: ReactNode }> = ({ children }) => (
  <View style={styles.header}>{children}</View>
);

export const DialogFooter: FC<{ children: ReactNode }> = ({ children }) => (
  <View style={styles.footer}>{children}</View>
);

export const DialogTitle: FC<{ children: ReactNode }> = ({ children }) => (
  <Text style={styles.title}>{children}</Text>
);

export const DialogDescription: FC<{ children: ReactNode }> = ({
  children,
}) => <Text style={styles.description}>{children}</Text>;

export const DialogClose: FC<{ children?: ReactNode }> = ({ children }) => {
  const { setOpen } = useDialogContext();
  return (
    <TouchableOpacity
      onPress={() => setOpen(false)}
      style={styles.closeButton}
      activeOpacity={0.7}
    >
      {children ?? <Text style={styles.closeText}>닫기</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)', // 슬레이트색 반투명
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    width: '100%',
    paddingHorizontal: 24,
  },
  content: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 8 as any, // RN <0.76이면 무시됨
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: '#6b7280',
  },
  closeButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  closeText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
