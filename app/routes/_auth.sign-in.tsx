import { SignIn } from "@clerk/react-router";

export default function SignInPage() {
  return (
    <main className="flex flex-col justify-center lg:flex-row items-center gap-4 w-full h-full lg:justify-center">
      <aside className="hidden lg:flex lg:basis-2/5 lg:border-r lg:justify-center lg:h-full lg:items-center">
        <div className="font-josefin text-center lg:text-start">
          <h1 className="text-5xl font-medium h-fit mt-1">AKARI</h1>
          <h2 className="font-light">Light, held gently.</h2>
        </div>
      </aside>
      <aside className="lg:flex lg:basis-3/5 lg:justify-center">
        <SignIn />
      </aside>
    </main>
  );
}
