import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import { promisify } from "util";
import fs from "fs/promises";
import { readFile } from "fs/promises";

const execPromise = promisify(exec);

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.NEXT_PUBLIC_BACKUP_SECRET;
  if (!authHeader || authHeader !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = now.toLocaleString("fr-FR", { month: "long" });
    const day = now.getDate().toString().padStart(2, "0");
    const backupDir = path.join(process.cwd(), "backups", year, month, day);
    await fs.mkdir(backupDir, { recursive: true });

    const timestamp = now.toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(backupDir, `backup-${timestamp}.sql`);

    const DB_USER = process.env.DB_USER || "postgres";
    const DB_NAME = process.env.DB_NAME || "mydatabase";
    const DB_PASSWORD = process.env.DB_PASSWORD || "password";
    const DB_HOST = process.env.DB_HOST || "localhost";

    const command = `pg_dump -U ${DB_USER} -h ${DB_HOST} -F p -f ${backupPath} ${DB_NAME}`;

    await execPromise(command, {
      env: { ...process.env, PGPASSWORD: DB_PASSWORD },
    });

    const backupData = await readFile(backupPath);

    return new NextResponse(backupData, {
      headers: {
        "Content-Disposition": `attachment; filename="backup-${timestamp}.sql"`,
        "Content-Type": "application/sql",
      },
    });
  } catch (error) {
    console.error("Backup failed:", error);
    return NextResponse.json(
      { error: "An error has occured" },
      { status: 500 }
    );
  }
}
