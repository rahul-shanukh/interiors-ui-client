import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Employee ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginDTO = z.infer<typeof loginSchema>;

export interface AuthUser {
  userId: string;
  employeeId: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
}
