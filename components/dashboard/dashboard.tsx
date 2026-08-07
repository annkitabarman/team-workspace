"use client";

import { useUser } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

export default function Dashboard() {
  const { user } = useUser();
  const userName = user?.fullName;
  console.log(userName);
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut({
      redirectUrl: "/",
    });
  };

  return (
    <div>
      {/* <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-red-500 hover:text-red-400 hover:cursor-pointer"
      >
        <LogOut size={16} />
        Logout
      </button> */}
    </div>
  );
}
