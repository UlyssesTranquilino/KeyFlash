"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Code,
  Sparkles,
  Zap,
  Crown,
  Text,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { getAllFlashcards } from "../../utils/flashcard/flashcard";
import { getAllTexts } from "../../utils/text/textUtils";
import { getAllCodes } from "../../utils/code/codeUtils";
import { useAuth } from "@/app/context/AuthContext";
import UpgradeToProDialog from "./ui/UpgradeToProDialog";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: any;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [openCreate, setOpenCreate] = useState(false);
  const { user, session } = useAuth();
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [texts, setTexts] = useState<any[]>([]);
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openProDialog, setOpenProDialog] = useState(false);

  // Initial quote and text fetch
  useEffect(() => {
    const fetchFlashcards = async () => {
      const data = await getAllFlashcards(user?.id);

      if (Array.isArray(data)) {
        setFlashcards(data);
      } else {
        setFlashcards([]);
      }
    };

    const fetchTexts = async () => {
      const data = await getAllTexts();

      if (Array.isArray(data)) {
        setTexts(data);
      } else {
        setTexts([]);
      }
    };

    const fetchCodes = async () => {
      const { data } = await getAllCodes();

      if (Array.isArray(data)) {
        setCodes(data);
      } else {
        setCodes([]);
      }
      setLoading(false);
    };

    setLoading(true);
    fetchFlashcards();
    fetchTexts();
    fetchCodes();
  }, []);

  const handleCreate = (type: string) => {
    if (type === "flashcard") {
      if (flashcards.length >= 5 && !user.isPro) {
        setOpenProDialog(true);
        return;
      }
      setOpenCreate(false);
      router.push("/dashboard/flashcards/create");
    } else if (type === "text") {
      if (texts.length >= 5 && !user.isPro) {
        setOpenProDialog(true);
        return;
      }
      setOpenCreate(false);
      router.push("/dashboard/texts/create");
    } else if (type === "code") {
      if (codes.length >= 5 && !user.isPro) {
        setOpenProDialog(true);
        return;
      }
      setOpenCreate(false);
      router.push("/dashboard/codes/create");
    }
  };

  return (
    <SidebarGroup>
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="sm:max-w-[500px] lg:max-w-[600px] sm:h-70 w-full mx-auto  ">
          <DialogHeader>
            <DialogTitle className="text-lg lg:text-xl sm:translate-y-3  text-center">
              What do you want to create?
            </DialogTitle>
            <DialogDescription>
              {/* All unsaved changes will be lost. Are you sure you want to clear
              this flashcard? */}
            </DialogDescription>

            <div className="flex flex-col sm:flex-row flex-wrap justify-around w-full items-center gap-3  h-full">
              <div
                onClick={() => handleCreate("flashcard")}
                className="w-full sm:w-2/7 cursor-pointer bg-black hover:border-blue-400/60 duration-300 ease-in-out hover:border-1 shadow-xs shadow-blue-700/90 relative overflow-hidden flex items-center justify-center text-center p-5 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm transition-all group"
              >
                <div className="absolute -top-15 -left-15 -z-2 size-90 rounded-full bg-radial-[at_50%_50%] from-blue-700/40 to-black to-90%"></div>{" "}
                <div className="flex flex-col items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 10 150 100"
                    width="28"
                    height="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300"
                  >
                    <rect
                      x="30"
                      y="40"
                      width="64"
                      height="99"
                      rx="10"
                      transform="rotate(16 120 220)"
                      stroke="currentColor"
                    />

                    <rect
                      x="45"
                      y="25"
                      width="79"
                      height="99"
                      rx="10"
                      stroke="currentColor"
                      fill="#08132D"
                    />
                  </svg>
                  <p className="text-base mb-1 text-blue-400 group-hover:text-blue-300 group-hover:font-medium transition-all duration-300">
                    Flashcard
                  </p>
                </div>
              </div>
              <div
                onClick={() => handleCreate("text")}
                className="w-full sm:w-2/7 cursor-pointer bg-black hover:border-blue-400/60 duration-300 ease-in-out hover:border-1 shadow-xs shadow-blue-700/90 relative overflow-hidden  flex items-center justify-center text-center p-5 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm transition-all group"
              >
                <div className="absolute -top-15 -left-15 -z-2 size-90 rounded-full bg-radial-[at_50%_50%] from-blue-700/40 to-black to-90%"></div>{" "}
                <div className="flex flex-col items-center gap-2">
                  <Text className="text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300" />
                  <p className="text-base mb-1 text-blue-400 group-hover:text-blue-300 group-hover:font-medium transition-all duration-300">
                    Text
                  </p>
                </div>
              </div>
              <div
                onClick={() => handleCreate("code")}
                className="w-full sm:w-2/7 cursor-pointer bg-black hover:border-blue-400/60 duration-300 ease-in-out hover:border-1 shadow-xs shadow-blue-700/90 relative overflow-hidden  flex items-center justify-center text-center p-5 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm transition-all group"
              >
                {" "}
                <div className="absolute -top-15 -left-15 -z-2 size-90 rounded-full bg-radial-[at_50%_50%] from-blue-700/40 to-black to-90%"></div>{" "}
                <div className="flex flex-col items-center gap-2">
                  <Code className="text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300" />
                  <p className="text-base mb-1 text-blue-400 group-hover:text-blue-300 group-hover:font-medium transition-all duration-300">
                    Code
                  </p>
                </div>
              </div>
            </div>
          </DialogHeader>
          {/* <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setOpenCreate(false)}
              className="text-gray-200 hover:text-white"
            >
              Cancel
            </Button>
          </div> */}
        </DialogContent>
      </Dialog>

      <UpgradeToProDialog
        openProDialog={openProDialog}
        setOpenProDialog={setOpenProDialog}
      />

      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url;

          // if (item.items && item.items.length > 0) {
          //   return (
          //     <Collapsible
          //       key={item.title}
          //       asChild
          //       defaultOpen={item.isActive}
          //       className="group/collapsible"
          //     >
          //       <SidebarMenuItem>
          //         <CollapsibleTrigger asChild>
          //           <SidebarMenuButton
          //             tooltip={item.title}
          //             className={`h-10 cursor-pointer  bg-blue-700/30 text-white${
          //               isActive
          //                 ? "bg-gray-900 text-white hover:bg-blue-950/30"
          //                 : "text-gray-400"
          //             }`}
          //           >
          //             {item.icon && <item.icon className="scale-120" />}
          //             <span className="ml-2">{item.title}</span>
          //             <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          //           </SidebarMenuButton>
          //         </CollapsibleTrigger>
          //         <CollapsibleContent>
          //           <SidebarMenuSub>
          //             {item.items?.map((subItem) => (
          //               <SidebarMenuSubItem key={subItem.title}>
          //                 <SidebarMenuSubButton asChild>
          //                   <a href={subItem.url}>
          //                     <span>{subItem.title}</span>
          //                   </a>
          //                 </SidebarMenuSubButton>
          //               </SidebarMenuSubItem>
          //             ))}
          //           </SidebarMenuSub>
          //         </CollapsibleContent>
          //       </SidebarMenuItem>
          //     </Collapsible>
          //   );
          // }

          if (item.items && item.items.length > 0) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => setOpenCreate(true)}
                      className={`h-10 cursor-pointer bg-blue-700/50 text-white !hover:bg-blue-800/90 `}
                    >
                      {item.icon &&
                        (React.isValidElement(item.icon) ? (
                          item.icon
                        ) : (
                          <item.icon className="scale-120" />
                        ))}

                      <span className="ml-2">{item.title}</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <Link href={item.url} passHref>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`h-10 cursor-pointer ${
                        isActive
                          ? "bg-gray-900 text-white hover:bg-blue-950/30"
                          : "text-gray-400"
                      }`}
                    >
                      {item.icon &&
                        (React.isValidElement(item.icon) ? (
                          item.icon
                        ) : (
                          <item.icon className="scale-120" />
                        ))}

                      <span className="ml-2">{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
