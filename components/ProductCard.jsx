import Link from 'next/link';
import ProductCarousel from './ProductCarousel';
import Image from 'next/image';

export default function ProductCard({ product }) {
  return (
    <div className="product-card border rounded-md p-4 shadow hover:shadow-lg">
      <image>
      <div className="cursor-pointer">
        {/* Only wrap title, price, and category in the Link, not the carousel */}
        {product.images && product.images.length > 1 ? (
          <ProductCarousel images={product.images} />
        ) : (
          <img src={product.images[0]} alt={product.title} className="w-full h-64 object-contain rounded" />
        )}
        <Link href={`/Product/${product.id}`}>
          <h3 className="mt-4 text-lg font-semibold">{product.title}</h3>
        </Link>
        <p className="text-gray-700">${product.price}</p>
        <p className="text-gray-500">Category: {product.category}</p>
      </div>
      </image>
    </div>
  );
}
