import Link from "next/link";

export const metadata = { title: "Admin Users" };

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>
      <Link href="/admin/dashboard" className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
