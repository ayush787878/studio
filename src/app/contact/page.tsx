
import { PublicHeader } from "@/components/public-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, HelpCircle, Newspaper } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-1 pt-14">
        <div className="container py-12 md:py-20">
            <section className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">Contact Us</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                We&apos;re here to help and answer any question you might have. We look forward to hearing from you.
                </p>
            </section>

            <section className="mt-16 grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Mail className="h-6 w-6 text-primary" />
                                <span>Email Us</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-1">For general inquiries:</p>
                            <a href="mailto:support@facelyze.com" className="font-semibold text-primary hover:underline">support@facelyze.com</a>
                             <p className="text-muted-foreground mt-4 mb-1">For media and press:</p>
                            <a href="mailto:press@facelyze.com" className="font-semibold text-primary hover:underline">press@facelyze.com</a>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <HelpCircle className="h-6 w-6 text-primary" />
                                <span>Frequently Asked Questions</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Many common questions are answered in our Advisory & Learning section.
                            </p>
                            <Button asChild variant="link" className="px-0">
                                <Link href="/advisory">Explore our Guides</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Send a Message</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <form className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first-name">First Name</Label>
                                        <Input id="first-name" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last-name">Last Name</Label>
                                        <Input id="last-name" placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="john.doe@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" placeholder="Your message..." rows={5} />
                                </div>
                                <Button type="submit" className="w-full">Send Message</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
