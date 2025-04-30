import nodemailer from "nodemailer";

export async function sendEmail({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    });
    return { message: "Correo enviado exitosamente" };
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("Error enviando el correo");
  }
}
