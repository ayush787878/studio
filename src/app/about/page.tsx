
import Image from "next/image";
import { PublicHeader } from "@/components/public-header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Target, Users } from "lucide-react";

const teamMembers = [
  { name: "Alex Johnson", role: "Founder & Lead AI Developer", hint: "professional portrait" },
  { name: "Samantha Lee", role: "UI/UX Designer", hint: "professional portrait" },
  { name: "David Chen", role: "Aesthetics Research Scientist", hint: "professional portrait" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-1 pt-14">
        <div className="container py-12 md:py-20">
          <section className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">About Facelyze</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We believe that understanding your unique facial aesthetics is the first step towards confident self-expression. Facelyze is dedicated to providing objective, AI-driven insights to help you achieve your personal beauty and wellness goals.
            </p>
          </section>

          <section className="mt-16 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Our Mission</h2>
                        <p className="text-muted-foreground mt-2">
                        Our mission is to democratize aesthetic analysis by making professional-grade insights accessible to everyone. We combine the latest in artificial intelligence with established principles of facial harmony to deliver personalized, constructive, and empowering feedback.
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Target className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">What We Do</h2>
                        <p className="text-muted-foreground mt-2">
                        Facelyze provides a suite of tools to help you on your journey. From an initial aesthetic score to detailed feature analysis and personalized skincare recommendations, we provide a holistic view of your facial characteristics and a roadmap for enhancement.
                        </p>
                    </div>
                </div>
            </div>
            <div>
              <Image
                src="https://placehold.co/600x400.png"
                alt="AI technology illustration"
                data-ai-hint="abstract technology"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </section>

          <section className="mt-20">
            <div className="text-center max-w-3xl mx-auto">
                <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                    <Users className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Meet the Team</h2>
                <p className="mt-3 text-muted-foreground">
                    We are a passionate team of developers, designers, and AI researchers united by a passion for technology and aesthetics.
                </p>
            </div>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.name} className="text-center">
                  <CardContent className="pt-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-primary">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
