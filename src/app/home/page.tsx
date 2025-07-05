"use client";

import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { CirclePlus, Dices, Quote, Code } from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Please log in to access this page.</div>
      </div>
    );
  }

  return (
    <div className="container max-w-[900px]  mx-auto px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Welcome, {user.user_metadata?.full_name || user.email}!
          </h1>
          <p className="text-gray-200 mt-2 sm:text-lg sm:mt-3">
            Current Streak: 3🔥
          </p>
        </header>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
        <div className="cursor-pointer hover:border-blue-400/60 duration-300 ease-in-out hover:border-1 shadow-xs shadow-blue-700 /90relative overflow-hidden h-23 flex items-center justify-center text-center  p-5 w-full  rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm ">
          <div className="absolute -top-55 -right-4 -z-2 size-90 rounded-full bg-radial-[at_50%_50%] from-blue-700/40 to-black to-90%"></div>{" "}
          {/* <div className="mb-3 scale-130 w-14 ">{icon}</div> */}
          <div className="flex flex-col items-center gap-2">
            <Dices />
            <p className={`text-base  mb-1 text-blue-400`}>Random Typing</p>
          </div>
        </div>

        <div className="cursor-pointer hover:border-blue-400/60 duration-300 ease-in-out hover:border-1 shadow-xs shadow-blue-700/90  relative overflow-hidden h-23 flex items-center justify-center text-center  p-5 w-full  rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm ">
          <div className="absolute -top-15 -left-5 -z-2 size-90 rounded-full bg-radial-[at_50%_50%] from-blue-700/40 to-black to-90%"></div>{" "}
          {/* <div className="mb-3 scale-130 w-14 ">{icon}</div> */}
          <div className="flex flex-col items-center gap-2">
            <Quote />
            <p className={`text-base  mb-1 text-blue-400`}>Quote Typing</p>
          </div>
        </div>

        <div className="cursor-pointer hover:border-blue-400/60 duration-300 ease-in-out hover:border-1 shadow-xs shadow-blue-700/90  relative overflow-hidden h-23 flex items-center justify-center text-center  p-5 w-full  rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm ">
          <div className="absolute -top-15 -left-15 -z-2 size-90 rounded-full bg-radial-[at_50%_50%] from-blue-700/40 to-black to-90%"></div>{" "}
          {/* <div className="mb-3 scale-130 w-14 ">{icon}</div> */}
          <div className="flex flex-col items-center gap-2">
            <Code />
            <p className={`text-base  mb-1 text-blue-400`}>Code Typing</p>
          </div>
        </div>

        <div className="cursor-pointer hover:border-blue-400/60 duration-300 ease-in-out hover:border-1 shadow-xs shadow-blue-700/90  relative overflow-hidden h-23 flex items-center justify-center text-center  p-5 w-full  rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm ">
          <div className="absolute -z-2 size-80 rounded-full bg-radial-[at_50%_50%] from-blue-700/40 to-black to-90%"></div>{" "}
          {/* <div className="mb-3 scale-130 w-14 ">{icon}</div> */}
          <div className="flex flex-col items-center gap-2">
            <CirclePlus className="" />

            <p className={`text-base  mb-1 text-blue-400`}>Create</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h1 className="font-medium text-lg mb-3">
          Flashcards <span className="ml-1 text-sm text-gray-300">(30)</span>
        </h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Flashcard Item */}
          <div className="relative group overflow-hidden rounded-xl h-40 w-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-950 hover:border-blue-500 transition-all duration-300 cursor-pointer shadow-lg">
            {/* Content */}
            <div className="relative z-10 p-5 h-full flex flex-col">
              <div className="mb-2">
                <h2 className="font-semibold text-xl text-white group-hover:text-blue-400 transition-colors">
                  Trees
                </h2>
              </div>
              <div className="mt-auto flex justify-between items-center">
                <span className="text-sm text-gray-400">12 terms</span>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 p-3 rounded-md"></button>
              </div>
            </div>

            {/* Decorative Graphic - Animated on Hover */}
            <div className="absolute right-0 bottom-0 opacity-70 group-hover:opacity-90 transition-opacity">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                width="160"
                height="160"
                className="transition-transform duration-500 ease-in-out group-hover:rotate-0 group-hover:translate-x-2 group-hover:translate-y-2 transform translate-x-8 translate-y-5 rotate-12"
              >
                {/* Main Card */}
                <rect
                  x="40"
                  y="30"
                  width="80"
                  height="110"
                  rx="12"
                  fill="#1E3A8A"
                  fillOpacity="0.3"
                  stroke="#3B82F6"
                  strokeWidth="1.5"
                />

                {/* Secondary Card */}
                <rect
                  x="25"
                  y="50"
                  width="80"
                  height="110"
                  rx="12"
                  fill="#1E3A8A"
                  fillOpacity="0.2"
                  stroke="#3B82F6"
                  strokeWidth="1.2"
                  strokeDasharray="4 2"
                />
              </svg>
            </div>

            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
        <div className="mt-12">
          <div className="bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-700 p-12 text-center">
            <div className="mx-auto max-w-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-white">
                No flashcards yet
              </h3>
              <p className="mt-2 text-gray-400">
                Get started by creating your first flashcard set
              </p>
              <div className="mt-6">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-colors flex items-center gap-2 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Create Flashcard Set
                </button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">or browse templates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
