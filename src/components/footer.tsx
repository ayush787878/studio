
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Twitter, Instagram, Facebook } from 'lucide-react';

export const Footer = () => (
    <footer className="bg-accent/20 border-t">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="space-y-4 md:col-span-4">
            <Link href="/" className="flex items-center" prefetch={false}>
              <Logo />
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Unlock your aesthetic potential with AI-driven face analysis and personalized guidance.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-8">
              <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Company</h4>
                  <nav className="flex flex-col gap-2">
                      <Link href="/about" className="text-sm text-muted-foreground hover:text-primary" prefetch={false}>About Us</Link>
                      <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary" prefetch={false}>Contact</Link>
                      <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary" prefetch={false}>Blog</Link>
                  </nav>
              </div>
              <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Legal</h4>
                  <nav className="flex flex-col gap-2">
                      <Link href="#" className="text-sm text-muted-foreground hover:text-primary" prefetch={false}>Terms of Service</Link>
                      <Link href="#" className="text-sm text-muted-foreground hover:text-primary" prefetch={false}>Privacy Policy</Link>
                      <Link href="#" className="text-sm text-muted-foreground hover:text-primary" prefetch={false}>Cookie Policy</Link>
                  </nav>
              </div>
              <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Connect</h4>
                  <div className="flex items-center gap-4">
                      <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary" prefetch={false}>
                          <Twitter className="h-5 w-5" />
                      </Link>
                      <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary" prefetch={false}>
                          <Instagram className="h-5 w-5" />
                      </Link>
                      <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary" prefetch={false}>
                          <Facebook className="h-5 w-5" />
                      </Link>
                  </div>
              </div>
          </div>
        </div>
      </div>
      <div className="border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-2 py-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">&copy; 2024 Facelyze.com. All rights reserved.</p>
            <p className="text-sm text-muted-foreground">A project by AI enthusiasts.</p>
        </div>
      </div>
    </footer>
);
