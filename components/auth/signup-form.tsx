"use client";

import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { useEffect } from "react";

type Props = {
  onSwitch: () => void;
};

const signUpSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignupForm({ onSwitch }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });
  const { signUp } = useSignUp();
  const router = useRouter();

  useEffect(() => {
    const saved = sessionStorage.getItem("signup-form");

    if (!saved) return;

    const data: SignUpForm = JSON.parse(saved);

    setValue("fullName", data.fullName, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("email", data.email, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("password", data.password, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [setValue]);

  const onSubmit = async (data: SignUpForm) => {
    try {
      const { error } = await signUp.password({
        emailAddress: data.email,
        password: data.password,
      });

      console.log(error);
      if (error) {
        console.error(JSON.stringify(error, null, 2));
        return;
      }

      await signUp.verifications.sendEmailCode();

      sessionStorage.setItem("signup-form", JSON.stringify(data));

      router.push("/verify");
    } catch (err) {
      console.error("SIGNUP ERROR");
      console.dir(err, { depth: null });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Full Name
          </label>

          <input
            {...register("fullName")}
            placeholder="John Doe"
            className={clsx(
              "h-12 w-full rounded-xl border bg-zinc-900 px-4 text-white outline-none transition",
              errors.fullName ? "border-red-500" : "border-zinc-700",
            )}
          />

          {errors.fullName && (
            <p className="mt-1 text-[0.6rem] text-red-400">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Email
          </label>

          <input
            {...register("email")}
            placeholder="john@gmail.com"
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
            {...register("password")}
            placeholder="••••••••"
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

        <div id="clerk-captcha" className="my-4 flex justify-center" />

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
          Create Account
          <ArrowRight size={18} />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="font-medium text-violet-400 hover:text-violet-300 hover:cursor-pointer"
        >
          Sign In
        </button>
      </p>
    </>
  );
}
