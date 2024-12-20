import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { Card } from "@nextui-org/card";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";


export const Navbar = () => {
  return (
    <Card className="bg-gradient-to-tr from-blue-100 to-blue-700 m-3">
      <NextUINavbar maxWidth="full">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              <p className="font-bold text-inherit">AEROPORTAL</p>
            </NextLink>
          </NavbarBrand>
          <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        >
          <NavbarItem className="hidden sm:flex gap-2">
            <Link isExternal aria-label="Github" href={siteConfig.links.github}>
              <GithubIcon className="text-default-500" />
            </Link>
            <ThemeSwitch />
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu className="bg-transparent h-full w-full absolute top-0 left-0">
          <Card className="w-full sm:hidden my-20">
            <div className="my-2 flex flex-col w-full">
              {siteConfig.navItems.map((item) => (
                <NavbarMenuItem key={item.href}>
                  <NextLink
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "data-[active=true]:text-primary data-[active=true]:font-medium flex flex-col justify-center text-center w-full text-md",
                    )}
                    color="foreground"
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </NavbarMenuItem>
              ))}
            </div>
          </Card>
        </NavbarMenu>

        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
          <NavbarMenuToggle />
        </NavbarContent>
      </NextUINavbar>
    </Card>
  );
};
