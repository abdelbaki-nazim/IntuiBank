import { redirect } from "next/navigation";

export default function Home() {
  // This's a demo app dashboard. I will redirect you directly to the dashboard.
  redirect("/dashboard");
  return null;
}
