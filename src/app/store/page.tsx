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
      <div className="space-y-2 mb-8 animate-in fade-in-0 duration-500">
        <h1 className="text-3xl font-bold font-headline">Curated Store</h1>
        <p className="text-muted-foreground">Products recommended by our AI to help you achieve your beauty goals.</p>
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
              <div className="text-center text-muted-foreground py-12">
                <ShoppingCart className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold font-headline">No Products Yet</h3>
                <p>There are no products in the store.</p>
                <p className="text-xs mt-2">Admins can add products to the 'products' collection in Firestore.</p>
              </div>
            </CardContent>
        </Card>
      )}
      
      {!error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in-0 duration-500">
          {products.map((product, i) => (
            <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow" style={{animationDelay: `${i * 100}ms`, animationFillMode: 'backwards'}}>
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
                <CardTitle className="text-lg font-headline">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-xl font-bold text-primary">${product.price ? product.price.toFixed(2) : '0.00'}</span>
                <Button asChild>
                  <Link href={product.link || '#'} target="_blank" rel="noopener noreferrer">
                    Buy Now <ExternalLink className="ml-2 h-4 w-4" />
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
