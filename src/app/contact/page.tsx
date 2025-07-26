"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { sendEmail } from "@/lib/resend";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    setLoading(true);

    const res = await sendEmail({ name, email, message });
    setLoading(false);

    if (res?.success) {
      toast.success("Message sent successfully!");
      form.reset();
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="px-2 max-w-[900px] mx-auto py-10 relative overflow-hidden">
      <Toaster position="top-center" />
      <h1 className="text-2xl lg:text-4xl text-center">Contact Us</h1>
      <p className="text-sm md:text-base my-4 text-center text-gray-300">
        Have questions, feedback, or need help? Reach out to us!
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 flex flex-col justify-center items-center"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              type="text"
              placeholder="John Doe"
              required
              className="input-glow"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              type="email"
              placeholder="johndoe@gmail.com"
              required
              className="input-glow"
            />
          </div>
        </div>

        <div className="grid gap-3 mt-5 w-full">
          <Label htmlFor="message">Message</Label>
          <Textarea
            name="message"
            placeholder="Enter your message"
            required
            className="input-glow min-h-40"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="font-medium cursor-pointer flex items-center justify-center gap-1 w-full text-center max-w-80 py-3 mt-10 border border-blue-900 hover:bg-blue-800/20 rounded-md transition-colors"
        >
          {loading ? "Sending..." : "Send"}{" "}
          <Send className="scale-70" strokeWidth={1.4} />
        </button>
      </form>

      {/* Contact Info Below */}
      <div className="mt-20 w-full flex flex-col gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row gap-3">
          <h1>Or email us directly at:</h1>
          <a
            href="mailto:keyflashapp.contact@gmail.com"
            className="text-blue-400 hover:underline"
          >
            keyflashapp.contact@gmail.com
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <h1>Need quick help?</h1>
          <div className="text-blue-400 flex gap-1">
            Visit
            <Link
              href="/support"
              className="hover:underline hover:text-blue-300"
            >
              Support
            </Link>
            Center
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
