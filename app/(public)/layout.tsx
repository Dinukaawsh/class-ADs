import { SiteHeader } from "@/components/layout/site-header";
import { getUserFromCookies } from "@/lib/auth";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserFromCookies();

  return (
    <>
      <SiteHeader isLoggedIn={Boolean(user?.sub)} />
      <div className="pt-16">{children}</div>
    </>
  );
}
