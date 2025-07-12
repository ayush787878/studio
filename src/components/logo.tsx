import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="https://i.ibb.co/Kj0sv78/Untitled-design-4.png"
        alt="Facelyze Logo"
        width={24}
        height={24}
        className="h-6 w-6 rounded-full"
      />
      <span className="font-semibold text-lg text-foreground">
        Facelyze
      </span>
    </div>
  );
}
