import { redirect } from "next/navigation";

export default function Home() {
  // Always calculate the date using Kenya timezone
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Africa/Nairobi",
  });

  // Redirect to the daily predictions page
  redirect(`/predictions/${today}`);
}
