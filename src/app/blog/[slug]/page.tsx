
import { notFound } from 'next/navigation';
import { PublicHeader } from '@/components/public-header';
import { Footer } from '@/components/footer';
import { blogPosts } from '@/lib/blog-posts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-1 pt-14">
        <div className="container py-12 md:py-20">
          <article className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">{post.title}</h1>
                <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Published on {new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>By {post.author}</span>
                    </div>
                </div>
            </header>
            
            <div className="text-foreground/90 space-y-6">
                {post.content}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
