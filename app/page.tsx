import LandingPage from "@/components/landing/landing-page";
import { auth } from "@clerk/nextjs/server";
import Dashboard from "@/components/dashboard/dashboard";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    return <Dashboard />;
  }
  return <LandingPage />;
}
