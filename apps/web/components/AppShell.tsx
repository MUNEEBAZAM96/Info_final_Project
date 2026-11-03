"use client";

import { Bot, FileJson, LayoutDashboard, Shield, ShieldAlert, Waypoints } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

const items = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "policies", label: "Policies", icon: FileJson },
  { id: "findings", label: "Findings", icon: ShieldAlert },
  { id: "attack-path", label: "Attack path", icon: Waypoints },
  { id: "guide", label: "Guide", icon: Bot },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [active, setActive] = useState("overview");

  function go(id: string) {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-16 flex-col items-center border-r border-white/10 bg-[#101626] py-4 md:flex">
        <span className="mb-6 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20 text-violet-200">
          <Shield className="size-4" aria-hidden="true" />
        </span>
        <nav className="flex flex-1 flex-col items-center gap-2">
          {items.map((item) => (
            <RailButton key={item.id} item={item} active={active === item.id} onClick={() => go(item.id)} />
          ))}
        </nav>
      </aside>
      <div className="md:pl-16">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#101626]/95 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-violet-300 md:hidden" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-tight">CloudGuard</span>
          </div>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10">
            Offline demo
          </span>
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-white/10 bg-[#101626] px-3 py-2 md:hidden">
          {items.map((item) => (
            <RailButton key={item.id} item={item} active={active === item.id} onClick={() => go(item.id)} compact />
          ))}
        </nav>
        <div className="px-4 py-6 md:px-8">{children}</div>
      </div>
    </div>
  );
}

function RailButton({
  item,
  active,
  onClick,
  compact = false,
}: {
  item: (typeof items)[number];
  active: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      title={item.label}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={`flex items-center justify-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-white/5 hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 ${
        compact ? "gap-2 px-3 py-2" : "h-10 w-10"
      } ${active ? "bg-violet-500/20 text-violet-100" : ""}`}
    >
      <Icon className="size-4" aria-hidden="true" />
      {compact ? <span className="text-xs">{item.label}</span> : null}
    </button>
  );
}
