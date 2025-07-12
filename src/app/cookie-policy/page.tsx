
import { PublicHeader } from "@/components/public-header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-1 pt-14">
        <div className="container py-12 md:py-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Cookie Policy</CardTitle>
              <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">1. What are Cookies?</h2>
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">2. How We Use Cookies</h2>
                <p>We use cookies for a few key purposes:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>
                        <strong>Essential Cookies:</strong> These cookies are necessary for the website to function and cannot be switched off in our systems. We use cookies from Firebase Authentication to manage your login session and keep you signed in securely.
                    </li>
                    <li>
                        <strong>Performance and Analytics Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. We may use services like Google Analytics to understand how visitors interact with our website.
                    </li>
                     <li>
                        <strong>Advertising Cookies:</strong> We use Google AdSense to display ads on our website. These services use cookies to show you ads that are more relevant to your interests. These cookies may track your browsing habits across other websites.
                    </li>
                </ul>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">3. Your Choices Regarding Cookies</h2>
                <p>
                  Most web browsers allow some control of most cookies through the browser settings. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.allaboutcookies.org</a>.
                </p>
              </section>
               <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">4. Changes to This Cookie Policy</h2>
                <p>
                  We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.
                </p>
              </section>
               <section>
                <h2 className="text-xl font-semibold text-foreground mb-2">5. Contact Us</h2>
                <p>
                  If you have any questions about our use of cookies, please <a href="/contact" className="text-primary hover:underline">contact us</a>.
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
