"use client";

import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Coins, User } from 'lucide-react';

export default function DashboardPage() {
  const { userProfile } = useAuth();

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto grid gap-8 animate-in fade-in-0 duration-500">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              <User /> Welcome to Your Dashboard
            </CardTitle>
            <CardDescription>
              This is your main hub. All your information is shown here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card className="bg-accent/50">
              <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center gap-3">
                  <Coins className="text-primary" />
                  Your Token Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">
                  {userProfile?.tokens ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  New users start with 10 tokens.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
