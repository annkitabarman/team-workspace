import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  const pathName = req.nextUrl.pathname;

  const protectedPaths =
    pathName.startsWith("/dashboard") ||
    pathName.startsWith("/projects") ||
    pathName.startsWith("/tasks");

  if (protectedPaths) {
    await auth.protect({
      unauthenticatedUrl: new URL("/", req.url).toString(),
    });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
