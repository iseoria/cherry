// src/components/ui/card.tsx (React Native 버전)

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewProps,
  TextProps,
} from "react-native";

export interface CardProps extends ViewProps {
  children?: React.ReactNode;
}

export function Card({ style, children, ...rest }: CardProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

export interface CardHeaderProps extends ViewProps {
  children?: React.ReactNode;
}

export function CardHeader({ style, children, ...rest }: CardHeaderProps) {
  return (
    <View style={[styles.header, style]} {...rest}>
      {children}
    </View>
  );
}

export interface CardTitleProps extends TextProps {
  children?: React.ReactNode;
}

export function CardTitle({ style, children, ...rest }: CardTitleProps) {
  return (
    <Text style={[styles.title, style]} {...rest}>
      {children}
    </Text>
  );
}

export interface CardDescriptionProps extends TextProps {
  children?: React.ReactNode;
}

export function CardDescription({
  style,
  children,
  ...rest
}: CardDescriptionProps) {
  return (
    <Text style={[styles.description, style]} {...rest}>
      {children}
    </Text>
  );
}

export interface CardContentProps extends ViewProps {
  children?: React.ReactNode;
}

export function CardContent({ style, children, ...rest }: CardContentProps) {
  return (
    <View style={[styles.content, style]} {...rest}>
      {children}
    </View>
  );
}

export interface CardFooterProps extends ViewProps {
  children?: React.ReactNode;
}

export function CardFooter({ style, children, ...rest }: CardFooterProps) {
  return (
    <View style={[styles.footer, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.06)",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    marginTop: 4,
    fontSize: 13,
    opacity: 0.7,
  },
  content: {
    marginTop: 8,
    marginBottom: 8,
  },
  footer: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
