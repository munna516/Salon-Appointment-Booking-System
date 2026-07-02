import { PrismaClient, BookingStatus, PaymentStatus, PaymentMethod, DayOfWeek } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process...");

  // 1. Admin
  const email = "admin@test.com";
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: { email, password: hashedPassword },
  });
  console.log("✅ Admin user seeded.");

  // 2. Business Hours
  const days: DayOfWeek[] = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY,
  ];

  for (const day of days) {
    const isOpen = day !== DayOfWeek.SUNDAY;
    await prisma.businessHour.upsert({
      where: { dayOfWeek: day },
      update: {
        isOpen,
        openTime: isOpen ? "09:00" : null,
        closeTime: isOpen ? "17:00" : null,
      },
      create: {
        dayOfWeek: day,
        isOpen,
        openTime: isOpen ? "09:00" : null,
        closeTime: isOpen ? "17:00" : null,
      },
    });
  }
  console.log("✅ Business Hours seeded.");

  // 3. Blocked Dates
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setHours(0, 0, 0, 0);

  await prisma.blockedDate.upsert({
    where: { date: nextMonth },
    update: { reason: "Public Holiday" },
    create: { date: nextMonth, reason: "Public Holiday" },
  });
  console.log("✅ Blocked Dates seeded.");

  // 4. Contacts
  const contact1 = await prisma.contact.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
      notes: "VIP Customer",
    }
  });

  const contact2 = await prisma.contact.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "+0987654321",
    }
  });
  console.log("✅ Contacts seeded.");

  // Clean up old bookings and payments to avoid unique conflicts during repeated seeding
  await prisma.payment.deleteMany({});
  await prisma.booking.deleteMany({});

  // 5 & 6. Bookings and Payments
  await prisma.booking.create({
    data: {
      date: new Date(),
      startTime: "10:00",
      endTime: "11:00",
      status: BookingStatus.COMPLETED,
      totalPrice: 150.0,
      serviceName: "Men's Haircut & Beard",
      contactId: contact1.id,
      payment: {
        create: {
          amount: 150.0,
          currency: "USD",
          status: PaymentStatus.PAID,
          method: PaymentMethod.CREDIT_CARD,
          transactionId: "txn_123456",
        }
      }
    }
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  await prisma.booking.create({
    data: {
      date: tomorrow,
      startTime: "14:00",
      endTime: "16:00",
      status: BookingStatus.CONFIRMED,
      totalPrice: 200.0,
      serviceName: "Hair Coloring",
      contactId: contact2.id,
      payment: {
        create: {
          amount: 200.0,
          currency: "USD",
          status: PaymentStatus.PENDING,
          method: PaymentMethod.CASH,
        }
      }
    }
  });
  console.log("✅ Bookings and Payments seeded.");

  // 7. Settings
  await prisma.settings.upsert({
    where: { key: "salonName" },
    update: { value: "Elegant Style Salon" },
    create: { key: "salonName", value: "Elegant Style Salon", description: "The display name of the salon." }
  });
  console.log("✅ Settings seeded.");

  console.log("🎉 Database seeded successfully with realistic data!");
}

main()
  .catch((e) => {
    console.error("Error seeding the database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
