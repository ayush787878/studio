
import { PublicHeader } from "@/components/public-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-1 pt-14">
        <div className="container py-12 md:py-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Refund & Cancellation Policy</CardTitle>
              <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">Our Policy</h2>
                <p>
                  Due to the nature of our services, which are digital and delivered instantly, we do not offer refunds or cancellations once a purchase is made or tokens are used.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">Digital Services</h2>
                <p>
                    Facelyze provides digital services in the form of AI-powered facial analysis and personalized recommendations. When you purchase or use our service tokens, the digital analysis is provided to you immediately. As this service is consumed instantly, it cannot be returned.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">No Refunds</h2>
                <p>
                  All sales of our digital services are final and non-refundable. Please ensure you have read our Terms of Service before making a purchase. By using our service, you acknowledge and agree to this no-refund policy.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">Exceptional Circumstances</h2>
                <p>
                    We do not provide refunds or credits for any partially used services. In the rare event of a technical error where a service is not delivered after a token has been deducted, please contact our support team. We will investigate the issue and may, at our sole discretion, restore the used tokens to your account.
                </p>
              </section>
               <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">Contact Us</h2>
                <p>
                  If you have any questions about our Refund & Cancellation Policy, please <a href="/contact" className="text-primary hover:underline">contact us</a>.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
