import { getDatabase } from "@/lib/server/database";

export const runtime = "nodejs";

export async function GET() {
  try {
    getDatabase().prepare("SELECT 1").get();
    return Response.json({
      service: "command-center",
      status: "ready",
      version: "1.0.0",
    });
  } catch {
    return Response.json(
      { service: "command-center", status: "unhealthy", version: "1.0.0" },
      { status: 503 },
    );
  }
}
