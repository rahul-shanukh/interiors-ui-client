import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "./useLogin";
import { loginSchema } from "./types";
import type { LoginDTO } from "./types";

export const LoginForm = () => {
  const { mutate: login, isPending, error } = useLogin();

  const form = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = (values: LoginDTO) => {
    login(values);
  };

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold">Welcome back!</h1>
        <p className="text-sm text-slate-500">
          Sign in with your employee ID to access the workspace
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error.message || "Login failed. Please check your credentials."}
          </div>
        )}

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Employee ID
            </label>
            <input
              type="text"
              placeholder="SE282"
              {...form.register("username")}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
            {form.formState.errors.username && (
              <p className="mt-2 text-sm text-red-600">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Your password"
              {...form.register("password")}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
            {form.formState.errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};
