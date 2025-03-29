import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  Image
} from "@heroui/react";
import { ThemeSwitch } from "./theme-switch";
import Link from "next/link";

export const Navbar = () => {
  return (
    <HeroUINavbar className="bg-white text-black" maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full justify-between">
        <NavbarBrand as={Link} href={"/"} className="gap-3 max-w-fit">
          <Image src="/logo.jpeg" alt="Logo" width={60} height={60} />
        </NavbarBrand>

        <NavbarItem>
          <ThemeSwitch/>
        </NavbarItem>
        
      </NavbarContent>

     

      
    </HeroUINavbar>
  );
};
