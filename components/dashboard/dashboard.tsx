"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { createUser } from "@/app/actions/user";
import { LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut({
      redirectUrl: "/",
    });
  };

  useEffect(() => {
    async function syncUser() {
      if (!isLoaded || !user) return;

      const saved = sessionStorage.getItem("signup-form");

      if (!saved) return;

      const data = JSON.parse(saved);

      try {
        await createUser({
          clerkUserId: user.id,
          fullName: data.fullName,
          email: data.email,
        });

        sessionStorage.removeItem("signup-form");
      } catch (err) {
        console.error(err);
      }

      sessionStorage.removeItem("signup-form");
    }

    syncUser();
  }, [isLoaded, user]);

  return (
    <div>
      Dashboard
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-red-500 hover:text-red-400 hover:cursor-pointer"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}
