import Link from "next/link";
import { SignUpForm } from "@/app/signup/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-gutter py-space-xl bg-gradient-to-b from-background to-surface-container">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center text-headline-md font-bold text-primary mb-space-lg">
          PivotPath
        </Link>
        <div className="rounded-xl p-space-md md:p-space-lg shadow-sm bg-surface-container-lowest border border-outline-variant/30">
          <div className="mb-space-lg">
            <h1 className="text-headline-lg text-primary mb-2">Create your account</h1>
            <p className="text-body-md text-on-surface-variant">
              We'll use this to save your roadmap and progress as you go.
            </p>
          </div>
          <SignUpForm />
          <p className="text-body-md text-on-surface-variant text-center mt-space-lg">
            Already have an account?{" "}
            <Link href="/login" className="text-secondary font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
