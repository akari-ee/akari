import { SignIn } from "@clerk/react-router";

export default function SignInPage() {
  return (
    <main className="flex flex-col items-center justify-center gap-4 py-4 md:py-6 w-full h-full">
      <h1>Sign in or up route</h1>
      <SignIn />
    </main>
  );
}
