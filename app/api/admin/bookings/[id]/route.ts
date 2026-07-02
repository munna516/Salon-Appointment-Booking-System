import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAuth();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const params = await context.params;
    const { id } = params;
    
    if (!body.status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: body.status },
      include: { contact: true, payment: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Booking Update Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAuth();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const { id } = params;

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking Delete Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
