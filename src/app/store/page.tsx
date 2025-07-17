
"use client";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Coins, Gem, Book, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { RazorpayButton } from "@/components/razorpay-button";

const proPlanPaypalUrl = "https://www.paypal.com/ncp/payment/PL2P47JY8VZWU";
const proPlanRazorpayId = "pl_Qdsd28i4z2Bf1p";

const premiumPlanPaypalUrl = "https://www.paypal.com/ncp/payment/GXKBX8R23SWE2";
const premiumPlanRazorpayId = "pl_Qtk2JOkwbu8A2D";


const plans = [
  {
    title: "Free Plan",
    price: "Free",
    tokens: 5,
    features: ["5 Free Tokens", "Standard Analysis", "Get Started"],
    isPopular: false,
    paypalUrl: null,
    razorpayId: null,
  },
  {
    title: "Pro Pack",
    price: "$0.45",
    tokens: 200,
    features: ["200 Tokens", "Detailed Analysis", "Priority Support", "Access to new features"],
    bonusFeature: "Includes Basic Guide Book",
    isPopular: true,
    paypalUrl: proPlanPaypalUrl,
    razorpayId: proPlanRazorpayId,
  },
  {
    title: "Premium Pack",
    price: "$3.48",
    tokens: "Unlimited",
    features: ["Unlimited Tokens", "Sellable Tokens", "Limit 30 tokens per day", "Highest priority support"],
    bonusFeature: "Includes Full Face Advisory Book",
    isPopular: false,
    paypalUrl: premiumPlanPaypalUrl,
    razorpayId: premiumPlanRazorpayId,
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
                                {plan.title !== 'Free Plan' && <span className="text-muted-foreground">/ one-time</span>}
                            </div>
                            <CardDescription className="flex items-center gap-2 pt-2">
                                <Coins className="h-5 w-5 text-yellow-500" />
                                <span>{plan.tokens} Tokens</span>
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
                                {plan.bonusFeature && (
                                     <li className="flex items-start gap-3 p-2 bg-primary/10 rounded-md">
                                        <Book className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span className="font-semibold text-primary">{plan.bonusFeature}</span>
                                    </li>
                                )}
                            </ul>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 pt-6">
                            {plan.paypalUrl && plan.razorpayId ? (
                                <>
                                    <a
                                        href={plan.paypalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={cn(buttonVariants(), "w-full bg-[#0070ba] hover:bg-[#005ea6] text-white")}
                                    >
                                        Pay with PayPal <ExternalLink className="ml-2 h-4 w-4" />
                                    </a>
                                    <RazorpayButton paymentButtonId={plan.razorpayId} />
                                </>
                            ) : (
                                <Button className="w-full" asChild>
                                    <Link href="/login">Get Started</Link>
                                </Button>
                            )}
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
