import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  try {
    const admin = await requireAuth();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const businessHours = await prisma.businessHour.findMany();

    const sorter: Record<string, number> = { 
      MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, 
      THURSDAY: 4, FRIDAY: 5, SATURDAY: 6, SUNDAY: 7 
    };
    
    businessHours.sort((a, b) => sorter[a.dayOfWeek] - sorter[b.dayOfWeek]);

    return NextResponse.json({ success: true, data: businessHours });
  } catch (error) {
    console.error("Business Hours API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await requireAuth();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    
    // Support updating multiple at once (e.g., apply Monday to all) or just one
    if (Array.isArray(body)) {
      const updates = body.map(bh => prisma.businessHour.update({
        where: { id: bh.id },
        data: {
          isOpen: bh.isOpen,
          openTime: bh.openTime,
          closeTime: bh.closeTime,
        }
      }));
      await prisma.$transaction(updates);
    } else {
      await prisma.businessHour.update({
        where: { id: body.id },
        data: {
          isOpen: body.isOpen,
          openTime: body.openTime,
          closeTime: body.closeTime,
        }
      });
    }

    // Return the updated list
    const businessHours = await prisma.businessHour.findMany();
    
    const sorter: Record<string, number> = { 
      MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, 
      THURSDAY: 4, FRIDAY: 5, SATURDAY: 6, SUNDAY: 7 
    };
    businessHours.sort((a, b) => sorter[a.dayOfWeek] - sorter[b.dayOfWeek]);

    return NextResponse.json({ success: true, data: businessHours });
  } catch (error) {
    console.error("Business Hours API Update Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
