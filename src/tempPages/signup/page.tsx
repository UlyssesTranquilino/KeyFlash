import Image from "next/image";
import Link from "next/link";
import Signin from "../signin/page";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "../../../public/KeyFlashLogo.png";
import Keyboard from "../../../public/Login/Keyboard.png";
import Lightning from "../../../public/Login/Lightning.png";
import SigninWithGoogleButton from "@/components/ui/auth/SigninWithGoogleButton";
import { signup } from "@/lib/auth-actions";
import SignupWithGoogleButton from "@/components/ui/auth/SignUpWithGoogle";

export default function Signup() {
  return (
    <div className="mb-30 mx-auto max-w-[1150px]  flex items-center justify-center overflow-hidden relative -mt-5 md:-mt-10">
      <div className="absolute top-20 right-10 sm:right-10 md:right-50 -z-10 h-126 w-60 sm:w-80 rotate-45 bg-gradient-to-br from-blue-500 via-transparent to-black/0 blur-3xl"></div>
      <div className="absolute -bottom-60 left-10 sm:right-10 -z-10 h-126 w-76 sm:w-90 rotate-45 bg-gradient-to-br from-blue-600/60 via-transparent to-black/0 blur-3xl"></div>

      <div className="w-full mx-auto flex items-center justify-center lg:justify-around">
        <form className=" w-full max-w-100 lg:max-w-110 m-3 flex flex-col gap-6 mt-12 md:mt-16 p-5 rounded-md outline-2 ">
          <div className="flex flex-col items-center gap-2 text-center">
            <Image src={Logo} alt="KeyFlash Logo" className="w-9 " />

            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter your details to signup
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="name"
                name="name"
                placeholder="John Doe"
                required
                className="input-glow"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="johndoe@example.com"
                required
                className="input-glow"
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                required
                className="input-glow"
              />
            </div>
            <Button formAction={signup} type="submit" className="w-full">
              Create an Account
            </Button>
            {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>
            <SignupWithGoogleButton /> */}
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="cursor-pointer underline underline-offset-4">
              Signin
            </Link>
          </div>
        </form>

        <div className="relative pl-10 order-first hidden w-100  h-110 lg:flex flex-col justify-end items-center">
          <h1 className="font-bold text-5xl text-left leading-15 ">
            Welcome to KeyFlash!
          </h1>
          <p className="pl-5 mt-10 w-100 text-left">
            Revolutionize the way you study with typing-powered active recall.
          </p>

          <Image
            src={Lightning}
            alt="Neon Lightning"
            className="w-70 absolute right-0 top-0 md:right-0 md:top-8 -rotate-35 -z-1 opacity-25"
          />
        </div>
      </div>
    </div>
  );
}
