import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAuth();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const params = await context.params;
    const { id } = params;

    const dateObj = new Date(body.date);
    dateObj.setHours(0,0,0,0);

    const updated = await prisma.blockedDate.update({
      where: { id },
      data: { date: dateObj, reason: body.reason },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Blocked Date Update Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAuth();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const { id } = params;

    await prisma.blockedDate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blocked Date Delete Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
