
import Link from 'next/link';
import { PublicHeader } from '@/components/public-header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { blogPosts, type BlogPost } from '@/lib/blog-posts';

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-1 pt-14">
        <div className="container py-12 md:py-20">
          <section className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">The Facelyze Blog</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Insights, tips, and articles on AI, aesthetics, and the science of self-improvement.
            </p>
          </section>

          <section className="mt-16 grid lg:grid-cols-3 gap-8">
            {blogPosts.map((post: BlogPost) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    <CardDescription>
                      Published on {new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} by {post.author}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <p className="text-muted-foreground flex-grow">{post.summary}</p>
                    <div className="flex items-center gap-2 mt-4 font-semibold text-primary">
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
