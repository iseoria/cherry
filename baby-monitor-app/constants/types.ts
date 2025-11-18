// app/types/user.ts
export interface UserInfo {
  id?: string;          // 로그인 직후엔 없을 수 있으니 optional
  name: string;
  email: string;
  avatar: string;
}
