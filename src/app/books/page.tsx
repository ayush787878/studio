
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { books } from '@/lib/books';
import { BookHeart, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function BooksPage() {
  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in-0 duration-500">
        <div className="flex items-center gap-4">
            <BookHeart className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold">Aesthetics Library</h1>
                <p className="text-muted-foreground">Download our curated guides to master your look.</p>
            </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <Link key={book.slug} href={`/books/${book.slug}`} className="block group">
                <Card className="flex flex-col h-full overflow-hidden transition-all group-hover:shadow-xl group-hover:-translate-y-1">
                    <CardHeader className="p-0">
                        <div className="aspect-[9/16] overflow-hidden">
                            <Image
                                src={`https://placehold.co/360x640.png`}
                                alt={`${book.title} book cover`}
                                data-ai-hint={book.coverImageHint}
                                width={360}
                                height={640}
                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col p-4">
                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{book.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-2 flex-grow">{book.summary}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                         <Badge variant="secondary" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            <span>{book.downloads} Downloads</span>
                        </Badge>
                    </CardFooter>
                </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
