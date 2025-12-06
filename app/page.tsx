import { redirect } from "next/navigation";

export default function Home() {
  // Convert to YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // Redirect to the daily predictions page
  redirect(`/predictions/${today}`);
}
