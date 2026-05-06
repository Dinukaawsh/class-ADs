import { safeCallbackUrl } from "@/lib/safe-callback-url";
import { LoginForm } from "./login-form";

export default async function UserLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const sp = await searchParams;
  const callbackUrl = safeCallbackUrl(sp.callbackUrl);

  return <LoginForm callbackUrl={callbackUrl} />;
}
