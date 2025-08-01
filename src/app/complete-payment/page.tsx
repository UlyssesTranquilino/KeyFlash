"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const SuccessPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const supabase = createClientComponentClient();

  // useEffect(() => {
  //   const checkProStatus = async () => {
  //     if (!user) return;
  //     setLoading(true);

  //     const { data, error } = await supabase
  //       .from("profiles")
  //       .select("*")
  //       .eq("id", user.id)
  //       .single();

  //     console.log("DATA: ", data);
  //     if (error) {
  //       console.error("Error checking pro status: ", error);
  //       setLoading(false);
  //       return;
  //     }

  //     if (data?.is_pro) {
  //       setSuccess(true);
  //     }

  //     setLoading(false);
  //   };

  //   checkProStatus();
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen  text-white flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
  //         <p>Processing your payment...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!success) {
  //   return (
  //     <div className="min-h-screen -mt-10 text-white flex items-center justify-center px-4">
  //       <div className="bg-gray-950 border border-red-500 rounded-xl max-w-md w-full p-8 text-center shadow-lg">
  //         <div className="flex justify-center mb-4">
  //           <svg
  //             xmlns="http://www.w3.org/2000/svg"
  //             className="h-12 w-12 text-red-500"
  //             fill="none"
  //             viewBox="0 0 24 24"
  //             stroke="currentColor"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               strokeWidth={2}
  //               d="M12 9v2m0 4h.01m-6.938 4h13.856C19.07 19 20 18.07 20 16.938V7.062C20 5.93 19.07 5 17.938 5H6.062C4.93 5 4 5.93 4 7.062v9.876C4 18.07 4.93 19 6.062 19z"
  //             />
  //           </svg>
  //         </div>
  //         <h2 className="text-xl font-semibold text-red-400 mb-2">
  //           Payment Failed
  //         </h2>
  //         <p className="text-sm text-gray-300 mb-6">
  //           There was an issue processing your payment. Please try again or
  //           contact support if the issue persists.
  //         </p>
  //         <button
  //           onClick={() => router.push("/payment")}
  //           className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
  //         >
  //           Back to Payment
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen -mt-10 text-white flex items-center justify-center">
      <div className="max-w-md mx-4 p-8 rounded-xl bg-gray-900 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-300 mb-6">
          Thank you for upgrading to Pro. Your account has been successfully
          upgraded.
        </p>
        <div className="bg-gray-700 p-4 rounded-lg mb-6 text-left">
          <h2 className="font-semibold mb-2">What's next?</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>All Pro features are now unlocked</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>No ads will be shown</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>You'll get early access to new features</span>
            </li>
          </ul>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
