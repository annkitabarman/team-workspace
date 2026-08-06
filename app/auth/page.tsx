import AuthWrapper from "@/components/auth/auth-wrapper";
type PageProps = {
  searchParams: Promise<{
    mode?: string;
  }>;
};

export default async function Auth({searchParams}: PageProps) {
    const params = await searchParams;

    const entryMode = params.mode === "signup" ? "signup" : "login";
    return (
        <AuthWrapper entryMode={entryMode}/>
    )
}