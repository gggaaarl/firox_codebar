import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="font-heading text-4xl font-semibold text-stone-900 sm:text-5xl">
          Firox
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
