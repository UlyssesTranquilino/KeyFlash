"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => router.push("/signin"), 2000);
  }, []);

  return <div>You have logged out... redirecting in a sec.</div>;
};
