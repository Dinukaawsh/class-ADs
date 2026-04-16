import Link from "next/link";
import { SubmitForm } from "@/app/submit/submit-form";

export const metadata = {
  title: "Post Your Class",
  description: "Submit a tuition class advertisement and reach students across Sri Lanka",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Post Your Class</h1>
        <p className="mt-2 text-sm text-muted">Fill in the details below to reach thousands of students.</p>
        <p className="mt-2 text-xs text-muted">
          Are you an institute?{" "}
          <Link href="/institutes/new" className="font-semibold text-primary hover:underline">
            Create an institute profile
          </Link>{" "}
          instead.
        </p>
      </div>
      <div className="mt-8">
        <SubmitForm />
      </div>
    </div>
  );
}
