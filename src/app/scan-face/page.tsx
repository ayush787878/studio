
"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { identifyPerson, type IdentifyPersonOutput } from '@/ai/flows/person-identification';
import { UploadCloud, Sparkles, RefreshCw, UserSearch } from 'lucide-react';
import { LoadingIndicator } from '@/components/loading-indicator';

export default function ScanFacePage() {
    const { toast } = useToast();

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [scanResult, setScanResult] = useState<IdentifyPersonOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          setImageFile(file);
          setScanResult(null);
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
    };
  
    const handleAnalyzeClick = async () => {
        if (!imageFile) return;

        setIsLoading(true);
        setScanResult(null);

        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
    
        reader.onerror = () => {
          setIsLoading(false);
          toast({ variant: "destructive", title: "File Error", description: "Could not read the image file." });
        };
    
        reader.onloadend = async () => {
            try {
                const base64data = reader.result as string;
                const result = await identifyPerson({ photoDataUri: base64data });
                setScanResult(result);
        
                if (!result.isPersonFound) {
                     toast({ title: "No Match Found", description: "The AI could not identify a known person in the photo." });
                } else {
                     toast({ title: "Person Identified!", description: `Found details for ${result.name}.` });
                }

            } catch (error) {
                console.error("Analysis failed:", error);
                toast({ variant: "destructive", title: "Scan Failed", description: "Something went wrong. Please try again." });
            } finally {
                setIsLoading(false);
            }
        };
    };

    const handleReset = () => {
        setImageFile(null);
        setImagePreview(null);
        setScanResult(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  
    return (
        <AppShell>
            <div className="space-y-8 animate-in fade-in-0 duration-500">
                <div className="flex items-center gap-4">
                    <UserSearch className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold">Scan Face</h1>
                        <p className="text-muted-foreground">Upload a photo to identify a person and get details about them.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Column: Uploader */}
                    <Card className="lg:sticky lg:top-24 h-fit">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Sparkles /> AI Person Identification
                            </CardTitle>
                            <CardDescription>
                                Upload a photo and our AI will try to identify the person.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4 text-center">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/png, image/jpeg"
                                    className="hidden"
                                />
                                <div
                                    onClick={() => !isLoading && fileInputRef.current?.click()}
                                    className={`group aspect-square max-w-sm mx-auto border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center transition-colors ${!isLoading ? 'cursor-pointer hover:border-primary' : 'cursor-not-allowed'}`}
                                >
                                    {imagePreview ? (
                                    <Image src={imagePreview} alt="Selected face" width={400} height={400} className="rounded-lg object-cover aspect-square" />
                                    ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <UploadCloud className="h-12 w-12" />
                                        <p>Click to upload a photo</p>
                                        <p className="text-xs">PNG or JPG</p>
                                    </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2 pt-4">
                                <Button
                                    onClick={handleAnalyzeClick}
                                    disabled={!imageFile || isLoading}
                                    size="lg"
                                    className="w-full max-w-sm"
                                >
                                    {isLoading ? "Scanning..."
                                    : ('Find Details')}
                                </Button>
                                {imagePreview && (
                                    <Button onClick={handleReset} variant="outline" size="lg" className="w-full max-w-sm">
                                        <RefreshCw className="mr-2 h-5 w-5" />
                                        Clear Photo
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
            
                    {/* Right Column: Results */}
                    <div className="space-y-6">
                        {isLoading && (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center gap-4 text-center p-8 min-h-[400px]">
                                    <LoadingIndicator />
                                    <p className="text-lg font-semibold">Our AI is scanning your photo...</p>
                                    <p className="text-muted-foreground">This may take a moment.</p>
                                </CardContent>
                            </Card>
                        )}
                        
                        {!isLoading && !scanResult && (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center gap-4 text-center p-8 min-h-[400px]">
                                    <UserSearch className="h-16 w-16 text-muted-foreground/30"/>
                                    <p className="text-lg font-semibold text-muted-foreground">Scan results will appear here</p>
                                </CardContent>
                            </Card>
                        )}
            
                        {scanResult && (
                            <div className="space-y-6 animate-in fade-in-0 duration-500">
                                {scanResult.isPersonFound ? (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-3xl">{scanResult.name}</CardTitle>
                                            <CardDescription>AI-Generated Details</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground leading-relaxed">{scanResult.details}</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>No Person Identified</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">The AI could not recognize a known public figure in the uploaded photo. Please try another image.</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
