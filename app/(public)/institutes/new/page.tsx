import { InstituteForm } from "@/components/forms/institute-form";

export const metadata = {
  title: "Create Institute Profile",
  description: "Publish your institute profile, courses, and contact details.",
};

export default function NewInstitutePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Create Institute Profile
        </h1>
      </div>
      <div className="mt-8">
        <InstituteForm />
      </div>
    </div>
  );
}
