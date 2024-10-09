import { NextResponse } from 'next/server';
import { fetchProducts } from '@/app/API'; // Adjust the path as needed

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page')) || 1;
  const pageSize = parseInt(searchParams.get('pageSize')) || 20;
  const sortBy = searchParams.get('sort') || 'price'; // Default sorting field
  const order = searchParams.get('order') || 'asc'; // Default order

  try {
    const products = await fetchProducts(category, page, pageSize, sortBy, order);
    console.log(products)
    // Return the products in JSON format
    return NextResponse.json({ products });
   
  } catch (error) {
    console.error("Error in GET /api/products:", error);
    return NextResponse.error(); // Return a 500 error
  }
}
