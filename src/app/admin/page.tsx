import { redirect } from "next/navigation";
import { createClient, isAdminEmail } from "@/lib/supabase/server";
import SignOut from "./sign-out";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    redirect("/login?next=/admin");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-white/40">Pit office</p>
      <h1 className="mt-2 font-display text-5xl italic">Admin</h1>
      <p className="mt-3 text-white/70">Signed in as {user?.email}</p>
      <div className="mt-8 rounded-lg border border-white/10 bg-black/30 p-5 text-sm text-white/70">
        Auth is live. Recipe editing can hook in here next.
      </div>
      <div className="mt-6">
        <SignOut />
      </div>
    </main>
  );
}
