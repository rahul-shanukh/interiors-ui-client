import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod schema that matches your backend ActivateUserDto
const activationSchema = z
  .object({
    employeeId: z.string().min(1, { message: "Employee ID is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ActivationDTO = z.infer<typeof activationSchema>;

export const ActivateAccountForm = () => {
  const isPending = false;
  const error = null as Error | null;

  const form = useForm<ActivationDTO>({
    resolver: zodResolver(activationSchema),
    defaultValues: {
      employeeId: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (values: ActivationDTO) => {
    console.log("Submitting activation for:", values.employeeId);
    // activateAccount({ employeeId: values.employeeId, password: values.password });
  };

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold">Activate Your Account</h1>
        <p className="text-sm text-slate-500">
          Enter your Employee ID to set up your workspace password.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error.message ||
              "Failed to activate account. Please verify your Employee ID."}
          </div>
        )}

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Employee ID
            </label>
            <input
              type="text"
              placeholder="e.g., SE282"
              {...form.register("employeeId")}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
            {form.formState.errors.employeeId && (
              <p className="mt-2 text-sm text-red-600">
                {form.formState.errors.employeeId.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              New Password
            </label>
            <input
              type="password"
              placeholder="At least 8 characters"
              {...form.register("password")}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
            {form.formState.errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Type your password again"
              {...form.register("confirmPassword")}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
            {form.formState.errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isPending ? "Activating..." : "Activate Account"}
          </button>
        </form>
      </div>
    </div>
  );
};
