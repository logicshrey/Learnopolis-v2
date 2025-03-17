import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      level: number;
      points: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    level: number;
    points: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    level: number;
    points: number;
  }
} 