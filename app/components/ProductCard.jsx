import Link from 'next/link';
import ProductCarousel from './ProductCarousel';
import Image from 'next/image';

export default function ProductCard({ product }) {
  return (
    <div className="product-card border rounded-md p-4 shadow hover:shadow-lg">
      <div className="cursor-pointer">
        {/* Only wrap title, price, and category in the Link, not the carousel */}
        {product.data.images && product.data.images.length > 1 ? (
          <ProductCarousel images={product.data.images} />
        ) : (
          <Image src={product.data.images[0]}
           alt={product.data.title} 
           width={300}
           height={300}
           className="w-full h-64 object-contain rounded" />
        )}
        <Link href={`/Product/${product.data.id}`}>
          <h3 className="mt-4 text-lg font-semibold">{product.data.title}</h3>
        </Link>
        <p className="text-gray-700">${product.data.price}</p>
        <p className="text-gray-500">Category: {product.data.category}</p>
      </div>
    </div>
  );
}
