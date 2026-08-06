"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LoginForm from "./login-form";
import SignupForm from "./signup-form";

type AuthWrapperProps = {
  entryMode: "login" | "signup";
};

export default function AuthWrapper({entryMode}: AuthWrapperProps) {
  const [mode, setMode] = useState(entryMode);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6">
      {/* Background */}

      <div className="w-full max-w-md">
        <div className="my-6 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-white">
                {mode === "login"
                  ? "Welcome back"
                  : "Create your account"}
              </h1>

              <p className="mt-3 text-zinc-400">
                {mode === "login"
                  ? "Sign in to continue to your workspace."
                  : "Start collaborating with your team in minutes."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <LoginForm onSwitch={() => setMode("signup")} />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <SignupForm onSwitch={() => setMode("login")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}