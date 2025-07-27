"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Home,
  Type,
  LifeBuoy,
  Send,
  Code,
  Dices,
  Quote,
  FolderCode,
  Plus,
} from "lucide-react";

import { NavSecondary } from "./nav-secondary";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/app/context/AuthContext";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();


  // This is sample data.
  const data = {
    user: {
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar,
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
    ],
    navMain: [
      {
        title: "Create",
        url: "/",
        icon: Plus,
        isActive: true,
        items: [
          {
            title: "Flashcard",
            url: "/dashboard/flashcard/create/",
          },
          {
            title: "Text",
            url: "/dashboard/texts/create/",
          },
          {
            title: "Code",
            url: "/dashboard/codes/create/",
          },
        ],
      },
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: true,
      },
      {
        title: "Flashcards",
        url: "/dashboard/flashcards",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 10 150 150"
            width="50"
            height="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="13"
            className="-translate-x-[2px] scale-120"
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
        ),
      },
      {
        title: "Texts",
        url: "/dashboard/texts",
        icon: Type,
      },
      {
        title: "Codes",
        url: "/dashboard/codes",
        icon: FolderCode,
      },
    ],
    navTyping: [
      {
        name: "Text",
        url: "/dashboard/typing/random",
        icon: Dices,
      },
      {
        name: "Quote",
        url: "/dashboard/typing/quote",
        icon: Quote,
      },
      {
        name: "Code",
        url: "/dashboard/typing/code",
        icon: Code,
      },
    ],

    navSecondary: [
      // {
      //   title: "Settings",
      //   url: "#",
      //   icon: Settings2,
      // },
      {
        title: "Support",
        url: "/support",
        icon: LifeBuoy,
      },
      // {
      //   title: "Feedback",
      //   url: "#",
      //   icon: Send,
      // },
    ],
  };
  return (
    <Sidebar collapsible="icon" className="bg-black" {...props}>
      <SidebarHeader className="bg-black/60">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="bg-black/60">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.navTyping} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="bg-black/60">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
