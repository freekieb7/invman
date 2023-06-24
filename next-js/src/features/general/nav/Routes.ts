import { HomeIcon, ServerIcon } from "@heroicons/react/24/solid";

interface Route {
  name: string;
  href: string;
  icon: typeof HomeIcon;
}

export const Routes: Array<Route> = [
  {
    name: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "Services",
    href: "/services",
    icon: ServerIcon,
  },
];
