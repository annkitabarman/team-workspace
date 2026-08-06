"use client";

import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";

type Props = {
  onSwitch: () => void;
};

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm({ onSwitch }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });
  const router = useRouter();
  const { signIn } = useSignIn();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      await signIn.finalize({
        navigate: async ({ decorateUrl }) => {
          const url = decorateUrl("/dashboard");

          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Email
          </label>

          <input
            type="email"
            placeholder="johndoe@gmail.com"
            {...register("email")}
            className={clsx(
              "h-12 w-full rounded-xl border bg-zinc-900 px-4 text-white outline-none transition",
              errors.email ? "border-red-500" : "border-zinc-700",
            )}
          />

          {errors.email && (
            <p className="mt-1 text-[0.6rem] text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Password
          </label>

          <input
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={clsx(
              "h-12 w-full rounded-xl border bg-zinc-900 px-4 text-white outline-none transition",
              errors.password ? "border-red-500" : "border-zinc-700",
            )}
          />

          {errors.password && (
            <p className="mt-1 text-[0.6rem] text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={clsx(
            "mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl font-semibold text-white transition",
            isValid
              ? "bg-gradient-to-r from-violet-600 to-purple-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-600/30 hover:cursor-pointer"
              : "bg-zinc-700 text-zinc-400 cursor-not-allowed opacity-60",
          )}
        >
          Sign In
          <ArrowRight size={18} />
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-500">
        Do not have an account?{" "}
        <button
          onClick={onSwitch}
          className="font-medium text-violet-400 hover:text-violet-300 hover:cursor-pointer"
        >
          Create one
        </button>
      </p>
    </>
  );
}
