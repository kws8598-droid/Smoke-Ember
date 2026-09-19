import { redirect } from "next/navigation";
import { createClient, isAdminEmail } from "@/lib/supabase/server";
import SignOut from "./sign-out";
import AdminEditor from "./editor";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    redirect("/login?next=/admin");
  }

  const [{ data: overrides }, { data: tableRecipes }] = await Promise.all([
    supabase.from("recipe_overrides").select("slug,recipe,updated_at").order("slug"),
    supabase.from("recipes").select("slug,data").order("slug"),
  ]);

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/40">Pit office</p>
          <h1 className="mt-2 font-display text-5xl italic">Admin</h1>
          <p className="mt-3 text-white/70">Signed in as {user?.email}</p>
        </div>
        <SignOut />
      </div>
      <AdminEditor overrides={overrides ?? []} tableRecipes={tableRecipes ?? []} />
    </main>
  );
}
