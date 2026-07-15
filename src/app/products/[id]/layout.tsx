import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const res = await fetch(`https://ourth-bcakend-prod-main-mzfsy0.laravel.cloud/api/v1/products/${id}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) throw new Error("Failed to fetch product");
    
    const { data: product } = await res.json();
    
    return {
      title: product.name,
      description: product.description || "Sustainable leaf tableware from Healing OURTH.",
      openGraph: {
        title: product.name,
        description: product.description || "Sustainable leaf tableware from Healing OURTH.",
        images: product.primary_image_url ? [product.primary_image_url] : [],
      }
    };
  } catch (error) {
    return {
      title: "Product Details",
      description: "View product details on Healing OURTH.",
    };
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
