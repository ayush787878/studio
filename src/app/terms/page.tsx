
import { PublicHeader } from "@/components/public-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-1 pt-14">
        <div className="container py-12 md:py-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Terms of Service</CardTitle>
              <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using Facelyze.com (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">2. Description of Service</h2>
                <p>
                  Facelyze provides AI-powered analysis of facial features and aesthetics from user-submitted photographs. The Service offers insights, scores, and recommendations for informational and educational purposes only. It also includes a feature to identify known public figures from photos.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">3. User Accounts, Pricing, and Service Delivery</h2>
                <p>
                  To access certain features, you must create an account. You are responsible for safeguarding your account information. The Service operates on a token system. Each AI analysis consumes a set number of tokens, which is displayed on the analysis button. Tokens are provided upon account creation and can be topped up via purchases. The analysis results (our digital service) are delivered instantly on the web application page after a successful analysis. There is no physical shipping or separate delivery process.
                </p>
              </section>
               <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">4. User Content</h2>
                <p>
                  You retain all rights to any photographs or data you submit to the Service ("User Content"). By uploading User Content, you grant Facelyze a worldwide, non-exclusive, royalty-free license to use, process, and analyze the content solely for the purpose of providing the Service to you. We are committed to your privacy; your images are used for your analysis and then stored in your private history. They are not used for training our AI models without your explicit consent.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">5. Prohibited Conduct</h2>
                <p>
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Upload any content that is illegal, harmful, or infringes on the rights of others.</li>
                  <li>Upload images of individuals without their consent.</li>
                  <li>Attempt to disrupt or compromise the integrity or security of the Service.</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">6. Disclaimer of Warranties</h2>
                <p>
                  The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The analysis and recommendations provided by our AI are for informational purposes only and do not constitute medical, dermatological, or professional aesthetic advice. Always consult with a qualified professional for any health or aesthetic concerns.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">7. Limitation of Liability</h2>
                <p>
                  In no event shall Facelyze, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the Service.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">8. Changes to Terms</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
                </p>
              </section>
               <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">9. Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please <a href="/contact" className="text-primary hover:underline">contact us</a>.
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
