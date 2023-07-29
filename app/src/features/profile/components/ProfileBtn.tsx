"use client";

import SpinnerSmall from "@/features/general/spinner/SpinnerSmall";
import { ArrowRightOnRectangleIcon, UserIcon } from "@heroicons/react/24/solid";
import { useSession, signOut } from "next-auth/react";

import Image from "next/image";
import { LegacyRef, useEffect, useMemo, useRef, useState } from "react";
import ProfileIcon from "./ProfileIcon";

export default function ProfileButton() {
  const { data: session } = useSession();

  const ref = useRef<HTMLElement>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [ref]);

  if (session == null) return <SpinnerSmall />;

  return (
    <section ref={ref as LegacyRef<HTMLElement>} className="relative inline-block text-left" >
      <button onClick={() => setOpen(!open)}>
        <ProfileIcon />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-md bg-slate-950 text-slate-100 border border-slate-100/20">
          <div className="p-2 border-b border-slate-100/20">
            <div className="flex space-x-4">
              <div className="shrink-0">
                <ProfileIcon />
              </div>
              <div className="max-w-full">
                <p>@{session.user.name}</p>
                <p className="text-sm text-slate-300 text-ellipsis">{session.user.group}</p>
              </div>
            </div>
          </div>
          <div className="py-1 text-sm">
            <div
              onClick={() => signOut()}
              className="flex items-center px-4 py-2 hover:bg-slate-800 cursor-pointer"
            >
              <ArrowRightOnRectangleIcon height={24} />
              <p className="pl-2">Sign out</p>
            </div>

          </div>
        </div>
      )}

    </section >
  );
};