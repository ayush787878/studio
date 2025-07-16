
"use client";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Coins, Gem } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const plans = [
  {
    title: "Basic Pack",
    price: "$4.99",
    tokens: 15,
    features: ["15 Tokens", "Standard Analysis", "Email Support"],
    isPopular: false,
  },
  {
    title: "Pro Pack",
    price: "$9.99",
    tokens: 50,
    features: ["50 Tokens", "Detailed Analysis", "Priority Support", "Access to new features"],
    isPopular: true,
  },
  {
    title: "Premium Pack",
    price: "$19.99",
    tokens: 120,
    features: ["120 Tokens", "All Pro features", "Highest priority support"],
    isPopular: false,
  },
];

export default function StorePage() {
    const { userProfile } = useAuth();
    
    return (
      <AppShell>
        <div className="space-y-8 animate-in fade-in-0 duration-500">
            <div className="text-center">
                <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                    <Gem className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold font-headline">Get More Tokens</h1>
                <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                    Choose a package that suits your needs. More tokens unlock more insights into your aesthetic journey.
                </p>
                 <div className="mt-4">
                    <p className="text-lg font-semibold">Your Current Balance: <span className="text-primary">{userProfile?.tokens ?? 0}</span> Tokens</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {plans.map((plan) => (
                    <Card key={plan.title} className={cn("flex flex-col", plan.isPopular && "border-primary shadow-lg")}>
                        {plan.isPopular && (
                            <div className="bg-primary text-primary-foreground text-xs font-bold text-center py-1 rounded-t-lg">
                                Most Popular
                            </div>
                        )}
                        <CardHeader className="items-center text-center">
                            <CardTitle className="text-2xl">{plan.title}</CardTitle>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-muted-foreground">/ one-time</span>
                            </div>
                            <CardDescription className="flex items-center gap-2 pt-2">
                                <Coins className="h-5 w-5 text-yellow-500" />
                                <span>+ {plan.tokens} Tokens</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-3 text-sm">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <Check className="h-5 w-5 text-green-500" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" disabled>
                                Purchase (Coming Soon)
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Card className="text-center bg-accent/50 max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Why Purchase Tokens?</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    <p>
                        Each token allows you to perform in-depth AI analyses, track your progress over time, and receive personalized recommendations. Your support helps us improve our AI and bring you even more powerful features. All purchases are final and non-refundable.
                    </p>
                </CardContent>
            </Card>
        </div>
      </AppShell>
    );
}
