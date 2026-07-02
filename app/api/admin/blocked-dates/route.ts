import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  try {
    const admin = await requireAuth();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const blockedDates = await prisma.blockedDate.findMany({
      orderBy: { date: "asc" }
    });

    return NextResponse.json({ success: true, data: blockedDates });
  } catch (error) {
    console.error("Blocked Dates API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAuth();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const dateObj = new Date(body.date);
    dateObj.setHours(0,0,0,0);

    const newBlockedDate = await prisma.blockedDate.create({
      data: {
        date: dateObj,
        reason: body.reason,
      }
    });

    return NextResponse.json({ success: true, data: newBlockedDate });
  } catch (error) {
    console.error("Blocked Dates API Create Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
