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
      name: user?.identities[0].identity_data.name,
      email: user?.identities[0].identity_data.email,
      avatar: user?.identities[0].identity_data.avatar_url,
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Home",
        url: "/dashboard",
        icon: Home,
        isActive: true,
      },
      {
        title: "Flashcards",
        url: "/dashboard/flashcard",
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
        url: "/dashboard/text",
        icon: Type,
      },
      {
        title: "Codes",
        url: "/dashboard/code",
        icon: Code,
      },
    ],

    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
      },
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" className="bg-black" {...props}>
      <SidebarHeader className="bg-black/60">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="bg-black/60">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="bg-black/60">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
