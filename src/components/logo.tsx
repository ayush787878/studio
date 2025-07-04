import { ScanFace } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <ScanFace className="h-6 w-6 text-primary" />
      <span className="font-bold text-lg text-foreground">FaceForward</span>
    </div>
  );
}
