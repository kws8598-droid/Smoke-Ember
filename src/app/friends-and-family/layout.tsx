import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Friends & Family Recipes | Smoke and Ember",
  description: "Favorite family recipes sent in by the folks who cook them — with their names on them. Send us yours and we'll feature it here.",
};

export default function FriendsAndFamilyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
