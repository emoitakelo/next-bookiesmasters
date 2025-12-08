import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // ensure fresh render

export default function Home() {
  // Force Kenya timezone reliably
  const now = new Date();
  const kenyaTime = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Nairobi",
  }).format(now);

  redirect(`/predictions/${kenyaTime}`);
}
