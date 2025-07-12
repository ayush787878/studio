
import { PublicHeader } from "@/components/public-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-1 pt-14">
        <div className="container py-12 md:py-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Privacy Policy</CardTitle>
              <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">1. Introduction</h2>
                <p>
                  Welcome to Facelyze ("we", "our", "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, Facelyze.com (the "Service"). Please read this policy carefully.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">2. Information We Collect</h2>
                <p>We may collect information about you in a variety of ways. The information we may collect on the Service includes:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>
                        <strong>Personal Data:</strong> When you register using Google Sign-In, we collect personal information that you provide to us, such as your name, email address, and profile picture.
                    </li>
                    <li>
                        <strong>User Content:</strong> We collect the photographs you upload to our service for analysis. These images are essential for the core functionality of our AI-powered features.
                    </li>
                     <li>
                        <strong>Generated Data:</strong> We store the results of the AI analysis, including aesthetic scores, feature breakdowns, and recommendations, and link them to your account to provide a history of your usage.
                    </li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">3. How We Use Your Information</h2>
                <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we use information collected about you via the Service to:</p>
                 <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Create and manage your account.</li>
                    <li>Provide AI-powered facial analysis and person identification.</li>
                    <li>Maintain a personal history of your analyses for your review.</li>
                    <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
                    <li>Respond to your comments and questions and provide customer service.</li>
                </ul>
              </section>
               <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">4. Disclosure of Your Information</h2>
                <p>
                  We do not share your personal information with third parties except as described in this Privacy Policy. We may share information with:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li><strong>AI Service Providers:</strong> We send your uploaded photos to our AI service provider (Google's Generative AI) for processing. These providers are contractually obligated to protect your data and are not permitted to use it for any other purpose, including for training their models.</li>
                  <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law.</li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">5. Data Security and Storage</h2>
                <p>
                  We use administrative, technical, and physical security measures to help protect your personal information. Your account information and analysis history are stored on secure servers provided by Firebase (a Google service). While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">6. Your Rights and Choices</h2>
                <p>
                  You have the right to review the information stored in your account at any time. If you wish to terminate your account, please contact us. Upon your request, we will deactivate or delete your account and information from our active databases.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">7. Policy for Children</h2>
                <p>
                  We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">8. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
              </section>
               <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">9. Contact Us</h2>
                <p>
                  If you have questions or comments about this Privacy Policy, please <a href="/contact" className="text-primary hover:underline">contact us</a>.
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
