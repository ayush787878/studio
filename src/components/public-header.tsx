
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const PublicHeader = () => {
  const pathname = usePathname();

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b">
      <Link href="/" className="flex items-center justify-center mr-6" prefetch={false}>
        <Logo />
        <span className="sr-only">Facelyze</span>
      </Link>
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "transition-colors hover:text-primary",
              pathname === link.href ? "text-primary" : "text-muted-foreground"
            )}
            prefetch={false}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium p-6">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4" prefetch={false}>
                    <Logo />
                </Link>
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn("hover:text-primary", pathname === link.href ? "text-foreground" : "text-muted-foreground")}
                        prefetch={false}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="hidden sm:flex items-center gap-2">
            <Link href="/login" prefetch={false}>
                <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/login" prefetch={false}>
                <Button>Get Started</Button>
            </Link>
        </div>
      </div>
    </header>
  );
};
