
"use client"

import * as React from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LayoutDashboard, LogOut, Coins, Moon, Sun, History, BookOpen, UserSearch, Lightbulb } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Footer } from './footer';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile, logout, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!loading && !userProfile) {
      router.push('/login');
    }
  }, [userProfile, loading, router]);

  const navItems = [
    { href: "/", label: "Dashboard", icon: <LayoutDashboard /> },
    { href: "/scan-face", label: "Scan Face", icon: <UserSearch /> },
    { href: "/history", label: "History", icon: <History /> },
    { href: "/learning-plan", label: "Learning Plan", icon: <Lightbulb /> },
    { href: "/advisory", label: "Advisory", icon: <BookOpen /> },
  ];

  if (loading || !userProfile || !isMounted) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Loading session...</p>
        </div>
      );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="p-2">
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={userProfile.photoURL || 'https://placehold.co/40x40.png'} alt={userProfile.displayName || 'User'} />
                        <AvatarFallback>{userProfile.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-medium">{userProfile.displayName || 'User'}</span>
                        <span className="text-xs text-muted-foreground">{userProfile.email || 'user@example.com'}</span>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
                  <Link href="https://facelyze.com" target="_blank" rel="noopener noreferrer" className="flex items-center w-full px-2 py-1.5 cursor-pointer">
                    <Coins className="mr-2 h-4 w-4 text-primary" />
                    <span>{userProfile?.tokens ?? 0} Tokens</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <div className="flex items-center justify-between w-full">
                    <Label htmlFor="dark-mode-toggle" className="flex items-center gap-2 font-normal cursor-pointer">
                        {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        <span>Dark Mode</span>
                    </Label>
                    <Switch
                        id="dark-mode-toggle"
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold capitalize">{pathname.substring(1).replace('-', ' ') || 'Dashboard'}</h1>
            <div className="ml-auto flex items-center gap-4">
                <Link href="https://facelyze.com" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <Coins className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{userProfile?.tokens ?? 0}</span>
                        <span className="hidden sm:inline text-muted-foreground">Tokens</span>
                    </Button>
                </Link>
            </div>
        </header>
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
