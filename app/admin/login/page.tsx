import { LoginForm } from "./login-form";

export const metadata = {
  title: "Admin sign in",
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <h1 className="text-center text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Admin sign in
      </h1>
      <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Use the credentials from your environment.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
