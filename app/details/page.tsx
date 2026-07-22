import { redirect } from "next/navigation";

// The old combined ledger split into /income (الداخل) and /expenses (الخارج).
export default function DetailsPage() {
  redirect("/income");
}
