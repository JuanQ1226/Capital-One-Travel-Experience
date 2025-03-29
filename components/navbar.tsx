import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/react";
import { ThemeSwitch } from "./theme-switch";
import Link from "next/link";
import Image from "next/image";
import navLogo from "@/public/Capital_One_logo.png";
export const Navbar = () => {
  return (
    <HeroUINavbar
      isBordered
      className="bg-white text-black"
      maxWidth="xl"
      position="sticky"
    >
        <NavbarBrand as={Link} href={"/"} className="gap-3 max-w-fit">
          <Image src={navLogo} alt="Logo" width={80} height={80} />
        </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Link href={"/saved-trips"} className="hover:underline font-semibold text-gray-600">
            Saved Trips
          </Link>
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
