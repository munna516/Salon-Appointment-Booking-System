import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (options: EmailOptions) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || '"Salon Admin" <noreply@salon.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

export const sendBookingConfirmationEmail = async (
  customerEmail: string,
  customerName: string,
  serviceName: string,
  date: string,
  time: string,
  price: number
) => {
  const adminEmail = process.env.SMTP_USER || "admin@salon.com"; // Fallback to SMTP_USER for owner email

  const customerHtml = `
    <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #18181b;">Booking Confirmed!</h2>
      <p>Hi ${customerName},</p>
      <p>Your appointment has been successfully scheduled and paid for. We can't wait to see you!</p>
      <div style="background: #f4f4f5; padding: 20px; border-radius: 12px; margin-top: 20px;">
        <p style="margin: 0 0 10px 0;"><strong>Service:</strong> ${serviceName}</p>
        <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${date}</p>
        <p style="margin: 0 0 10px 0;"><strong>Time:</strong> ${time}</p>
        <p style="margin: 0 0 0 0;"><strong>Amount Paid:</strong> $${price}</p>
      </div>
      <p style="margin-top: 20px;">Thank you for choosing our salon.</p>
    </div>
  `;

  const ownerHtml = `
    <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #18181b;">New Booking Alert</h2>
      <p>A new appointment has been confirmed and paid for.</p>
      <div style="background: #f4f4f5; padding: 20px; border-radius: 12px; margin-top: 20px;">
        <p style="margin: 0 0 10px 0;"><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p style="margin: 0 0 10px 0;"><strong>Service:</strong> ${serviceName}</p>
        <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${date}</p>
        <p style="margin: 0 0 10px 0;"><strong>Time:</strong> ${time}</p>
        <p style="margin: 0 0 0 0;"><strong>Amount Paid:</strong> $${price}</p>
      </div>
    </div>
  `;

  // Send to Customer
  await sendEmail({
    to: customerEmail,
    subject: "Your Appointment is Confirmed - Salon",
    html: customerHtml,
  });

  // Send to Owner
  await sendEmail({
    to: adminEmail,
    subject: "New Booking Received",
    html: ownerHtml,
  });
};
