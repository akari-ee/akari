import { SignUp } from "@clerk/react-router";

export default function SignUpPage() {
  return (
    <main className="flex flex-col items-center justify-center gap-4 py-4 md:py-6 w-full h-full">
      <h1>Sign up route</h1>
      <SignUp />
    </main>
  );
}
