"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useSignUp, useSignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerifyOtpPage() {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();

  const searchParams = useSearchParams();
  const flow = searchParams.get("flow");

  const otp = digits.join("");
  const isValid = otp.length === OTP_LENGTH;

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown === 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const setDigit = (index: number, value: string) => {
    const next = [...digits];
    next[index] = value;
    setDigits(next);
  };

  const handleChange = (index: number, raw: string) => {
    const value = raw.replace(/\D/g, "");

    if (!value) {
      setDigit(index, "");
      return;
    }

    // Support pasting a full code into any box
    if (value.length > 1) {
      const chars = value.slice(0, OTP_LENGTH - index).split("");
      const next = [...digits];
      chars.forEach((c, i) => (next[index + i] = c));
      setDigits(next);
      const last = Math.min(index + chars.length, OTP_LENGTH - 1);
      inputsRef.current[last]?.focus();
      return;
    }

    setDigit(index, value);
    if (index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      // -------------------------
      // Signup verification
      // -------------------------
      if (flow === "signup") {
        const { error } = await signUp.verifications.verifyEmailCode({
          code: otp,
        });

        if (error) {
          console.error(error);
          return;
        }

        await signUp.finalize({
          navigate: ({ decorateUrl }) => {
            sessionStorage.removeItem("signup-form");

            const url = decorateUrl("/dashboard");

            if (url.startsWith("https")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });

        return;
      }

      // -------------------------
      // Login verification
      // -------------------------
      if (flow === "login") {
        const { error } = await signIn.mfa.verifyEmailCode({
          code: otp,
        });

        if (error) {
          console.error(error);
          return;
        }

        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl("/dashboard");

            if (url.startsWith("https")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      setCooldown(RESEND_SECONDS);

      if (flow === "signup") {
        const { error } = await signUp.verifications.sendEmailCode();

        if (error) {
          console.error(error);
        }
      }

      if (flow === "login") {
        await signIn.mfa.sendEmailCode();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]" />

        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-zinc-800 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Icon badge */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10">
            <Mail size={24} className="text-violet-400" />
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Check your email
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              We sent a 6-digit code to your email address. Enter it below to
              verify your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="flex justify-between gap-2">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={OTP_LENGTH}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={clsx(
                    "h-14 w-12 rounded-xl border bg-zinc-900 text-center text-xl font-semibold text-white outline-none transition focus:ring-2 focus:ring-violet-500/30",
                    digit
                      ? "border-violet-500/60"
                      : "border-zinc-700 focus:border-violet-500",
                  )}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className={clsx(
                "flex h-12 w-full items-center justify-center gap-2 rounded-xl font-semibold text-white transition",
                isValid
                  ? "bg-gradient-to-r from-violet-600 to-purple-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-600/30 hover:cursor-pointer"
                  : "cursor-not-allowed bg-zinc-700 text-zinc-400 opacity-60",
              )}
            >
              <ShieldCheck size={18} />
              Verify email
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-sm text-zinc-500">
            Didn&apos;t get a code?
            <button
              onClick={handleResend}
              disabled={cooldown > 0}
              className={clsx(
                "font-medium transition",
                cooldown > 0
                  ? "cursor-not-allowed text-zinc-600"
                  : "text-violet-400 hover:text-violet-300 hover:cursor-pointer",
              )}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Wrong email?{" "}
          <button
            onClick={() => router.push("/auth?mode=signup")}
            className="text-zinc-400 underline underline-offset-2 hover:text-zinc-300 hover:cursor-pointer"
          >
            Go back
          </button>
        </p>
      </div>
    </main>
  );
}
