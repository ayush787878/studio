import { AppShell } from '@/components/app-shell';
import { getProducts, type Product } from '@/services/productService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ExternalLink } from 'lucide-react';

async function StorePage() {
  let products: Product[] = [];
  let error: string | null = null;
  try {
    products = await getProducts();
  } catch (e) {
    console.error(e);
    error = "There was an error loading products. Please ensure your Firebase configuration is correct.";
  }

  return (
    <AppShell>
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline">Recommended Products</h1>
        <p className="text-muted-foreground">Curated products to help you achieve your beauty goals.</p>
      </div>

      {error && (
        <Card>
            <CardContent className="pt-6 text-center text-destructive">
                <p>{error}</p>
            </CardContent>
        </Card>
      )}

      {!error && products.length === 0 && (
         <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <ShoppingCart className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">No Products Yet</h3>
                <p>There are no products in the store. Please add products to your Firestore 'products' collection.</p>
                <p className="text-xs mt-2">Make sure your Firestore security rules allow reads on the 'products' collection.</p>
              </div>
            </CardContent>
        </Card>
      )}
      
      {!error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-square">
                <Image
                  src={product.imageUrl || 'https://placehold.co/400x400.png'}
                  alt={product.name || 'Product Image'}
                  data-ai-hint="product image"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-xl font-bold text-primary">${product.price ? product.price.toFixed(2) : '0.00'}</span>
                <Button asChild>
                  <Link href={product.link || '#'} target="_blank" rel="noopener noreferrer">
                    Buy Now <ExternalLink className="ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}

export default StorePage;
