import { redirect } from "next/navigation";
import { createClient, isAdminEmail } from "@/lib/supabase/server";
import SignOut from "./sign-out";
import AdminEditor from "./editor";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    redirect("/login?next=/admin");
  }

  const [{ data: recipes }, { data: tips }] = await Promise.all([
    supabase.from("recipes").select("slug,data").order("slug"),
    supabase.from("wisdom").select("slug,data").order("slug"),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/40">Pit office</p>
          <h1 className="mt-2 font-display text-5xl italic">Admin</h1>
          <p className="mt-3 text-white/70">Signed in as {user?.email}</p>
        </div>
        <SignOut />
      </div>
      <AdminEditor recipes={recipes ?? []} tips={tips ?? []} />
    </main>
  );
}
