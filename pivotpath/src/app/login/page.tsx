import Link from "next/link";
import { LoginForm } from "@/app/login/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-gutter py-space-xl bg-gradient-to-b from-background to-surface-container">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center text-headline-md font-bold text-primary mb-space-lg">
          PivotPath
        </Link>
        <div className="rounded-xl p-space-md md:p-space-lg shadow-sm bg-surface-container-lowest border border-outline-variant/30">
          <div className="mb-space-lg">
            <h1 className="text-headline-lg text-primary mb-2">Welcome back</h1>
            <p className="text-body-md text-on-surface-variant">
              Log in to pick up where you left off.
            </p>
          </div>
          <LoginForm />
          <p className="text-body-md text-on-surface-variant text-center mt-space-lg">
            Don't have an account?{" "}
            <Link href="/signup" className="text-secondary font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
