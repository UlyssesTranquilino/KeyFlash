// app/actions/sendEmail.ts
"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export const sendEmail = async (formData: {
  name: string;
  email: string;
  message: string;
}) => {
  const { name, email, message } = formData;

  try {
    await resend.emails.send({
      from: "KeyFlash Contact <noreply@keyflashapp.contact@gmail.com.com>",
      to: "keyflashapp.contact@gmail.com",
      subject: `Contact Form Submission from ${name}`,
      html: `
        <h3>New Message from KeyFlash Contact Form</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};
