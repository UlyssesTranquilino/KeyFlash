import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/KeyFlashLogo.png";
import Lightning from "../../../public/Login/Lightning.png";
import SigninWithGoogleButton from "@/components/ui/auth/SigninWithGoogleButton";

export default function Signin() {
  return (
    <div className="h-screen md:h-full mb-30 mx-auto max-w-[1150px] flex items-center justify-center overflow-hidden relative -mt-5 md:-mt-10">
      <div className="absolute top-20 right-10 sm:right-10 md:right-50 -z-10 h-126 w-60 sm:w-80 rotate-45 bg-gradient-to-br from-blue-500 via-transparent to-black/0 blur-3xl"></div>
      <div className="absolute -bottom-60 left-10 sm:right-10 -z-10 h-126 w-76 sm:w-90 rotate-45 bg-gradient-to-br from-blue-600/60 via-transparent to-black/0 blur-3xl"></div>

      <div className="w-full mx-auto flex items-center justify-center lg:justify-around">
        <div className="h-70   flex flex-col items-center justify-center w-full max-w-100 lg:max-w-110 m-3 gap-8 mt-12 md:mt-16 p-5 rounded-md outline-2">
          <div className="flex flex-col items-center gap-2 text-center ">
            <Image src={Logo} alt="KeyFlash Logo" className="w-9" />
            <h1 className="text-2xl font-bold">Login to KeyFlash</h1>
            <p className="text-muted-foreground text-sm">
              Sign in with Google to continue
            </p>
          </div>

          <div className="grid gap-6 w-full">
            <SigninWithGoogleButton />
          </div>

          {/* <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline underline-offset-4">
              Signup
            </Link>
          </div> */}
        </div>

        <div className="relative pl-10 order-first hidden w-100 h-110 lg:flex flex-col justify-end items-center">
          <h1 className="font-bold text-5xl text-left leading-15">
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
