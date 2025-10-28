export type Role = "admin" | "restaurateur" | "user";

export type User = {
  id: number;
  name: string;
  password: string;
  email: string;
  role: Role;
};
