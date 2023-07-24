"use client";

import SpinnerSmall from "@/features/general/spinner/SpinnerSmall";
import { ArrowRightOnRectangleIcon, UserIcon } from "@heroicons/react/24/solid";
import { useSession, signOut } from "next-auth/react";

import Image from "next/image";
import { LegacyRef, useEffect, useRef, useState } from "react";

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
        {typeof session.user?.image === 'string' && session.user.image !== "" ?
          <Image
            src={session!.user!.image!}
            alt="image"
            width={32}
            height={32}
            style={{
              objectFit: "cover",
              borderRadius: "50px",
            }}
          />
          :
          <UserIcon
            height={32}
            color="white"
            className="slate-100 bg-slate-700 rounded-full object-cover"
          />
        }
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-md bg-slate-950 text-slate-100 border border-slate-100/20">
          <div className="py-1 text-sm">
            <div className="flex items-center px-4 py-2  hover:bg-slate-800 cursor-pointer">
              <ArrowRightOnRectangleIcon height={24} />
              <a onClick={() => signOut()} className="pl-2">Sign out</a>
            </div>

          </div>
        </div>
      )}

    </section >
  );
};