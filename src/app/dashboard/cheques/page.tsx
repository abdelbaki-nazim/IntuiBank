export const dynamic = "force-dynamic";
import { headers } from "next/headers";

import ChequesDashboardClient from "./ChequesDashboardClient";

async function getCheques() {
  const incomingHeaders = await headers();
  const cookie = incomingHeaders.get("cookie") || "";

  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/cheques`, {
      cache: "no-store",
      headers: { cookie },
    });
    if (!res.ok) {
      throw new Error("Error retrieving cheques.");
    }
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return { cheques: data, fetchError: null };
  } catch (error: any) {
    return {
      cheques: [],
      fetchError: error.message || "Error retrieving cheques.",
    };
  }
}

export default async function ChequesDashboardPage() {
  const { cheques, fetchError } = await getCheques();
  return <ChequesDashboardClient cheques={cheques} fetchError={fetchError} />;
}
