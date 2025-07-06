// app/signup/check-email/page.tsx

import { resendConfirmation } from "@/lib/auth-actions";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function CheckEmailPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  return (
    <div className="h-100vh overflow-hidden relative container  flex w-screen  mx-auto flex-col items-center justify-center">
      <div className="absolute top-20 right-10 sm:right-60 -z-10 h-126 w-60 sm:w-80 rotate-45 bg-gradient-to-br from-blue-500 via-transparent to-black/0 blur-3xl"></div>
      <div className="absolute -bottom-60 left-10 sm:right-10 md:right-200 -z-10 h-126 w-76 sm:w-90 rotate-45 bg-gradient-to-br from-blue-600/60 via-transparent to-black/0 blur-3xl"></div>
      <div className=" p-5 mb-55 rounded-md outline-1   sm:mx-0 mt-30 m-10 sm:max-w-[500px]  ">
        <div className="flex flex-col items-center justify-center gap-4 ">
          <MailCheck className="h-12 w-12 text-blue-400" />
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-center text-muted-foreground">
            We've sent a confirmation link to{" "}
            <span className="font-semibold">
              {searchParams.email || "your email"}
            </span>
            . Please click the link to complete your signup.
          </p>

          <form action={resendConfirmation}>
            <input
              type="hidden"
              name="email"
              value={searchParams.email || ""}
            />
            <Button variant="link" type="submit">
              Resend confirmation email
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
