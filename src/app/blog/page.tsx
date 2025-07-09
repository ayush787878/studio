
import { PublicHeader } from '@/components/public-header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <PublicHeader />
        <main className="flex-1 pt-14">
            <div className="container py-12 md:py-20">
                <Card>
                    <CardHeader>
                    <CardTitle>Page Not In Use</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p>This page has been removed as part of the application simplification.</p>
                    </CardContent>
                </Card>
            </div>
        </main>
        <Footer />
    </div>
  );
}
