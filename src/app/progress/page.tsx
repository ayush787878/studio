'use client';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Star, Calendar, NotebookText } from 'lucide-react';

type AnalysisRecord = {
  id: string;
  date: string;
  imageUrl: string;
  notes: string;
  aestheticScore: {
    score: number;
    reason: string;
  };
};

const mockProgressData: AnalysisRecord[] = [
  {
    id: '1',
    date: '2024-07-15',
    imageUrl: 'https://placehold.co/400x400.png',
    notes: 'First analysis after starting a new skincare routine. Feeling optimistic!',
    aestheticScore: {
      score: 7.8,
      reason: 'Good skin clarity and balanced facial proportions. Slight asymmetry in the jawline.',
    },
  },
  {
    id: '2',
    date: '2024-06-20',
    imageUrl: 'https://placehold.co/400x400.png',
    notes: 'Trying out new contouring techniques. Wanted to see if it made a difference.',
    aestheticScore: {
      score: 7.5,
      reason: 'Well-defined cheekbones, but the lighting is slightly uneven, affecting symmetry perception.',
    },
  },
  {
    id: '3',
    date: '2024-05-30',
    imageUrl: 'https://placehold.co/400x400.png',
    notes: 'Baseline photo before making any changes. Curious to see the starting point.',
    aestheticScore: {
      score: 7.2,
      reason: 'Harmonious features overall. Skin appears slightly dehydrated.',
    },
  },
];

export default function ProgressPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Your Progress Timeline</h1>
          <p className="text-muted-foreground">Review your past analyses and track your aesthetic journey.</p>
        </div>
        <div className="relative pl-8">
          <div className="absolute left-4 top-4 bottom-4 w-px bg-border -translate-x-1/2"></div>
          {mockProgressData.map((record, index) => (
            <div key={record.id} className="relative mb-8">
              <div className="absolute left-4 top-5 w-3 h-3 rounded-full bg-primary -translate-x-1/2 -translate-y-1/2"></div>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        Analysis from {new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </CardTitle>
                      <CardDescription>Entry #{mockProgressData.length - index}</CardDescription>
                    </div>
                     <Badge variant="secondary" className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-primary" />
                        Score: {record.aestheticScore.score.toFixed(1)}
                      </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <Image
                      src={record.imageUrl}
                      alt={`Analysis from ${record.date}`}
                      data-ai-hint="woman portrait"
                      width={400}
                      height={400}
                      className="rounded-lg object-cover aspect-square"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                     <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><Star className="w-4 h-4"/>AI Score Rationale</h3>
                        <p className="text-sm text-muted-foreground">{record.aestheticScore.reason}</p>
                     </div>
                     <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2"><NotebookText className="w-4 h-4"/>Your Notes</h3>
                        <p className="text-sm text-muted-foreground italic">{`"${record.notes}"`}</p>
                     </div>
                  </div>
                </CardContent>
                 <CardFooter>
                    <p className="text-xs text-muted-foreground">ID: {record.id}</p>
                 </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
