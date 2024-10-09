//api/product/count.js
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const count = await fetchTotalProductCount();
      return res.status(200).json({ count });
    } catch (error) {
      console.error('Error fetching product count:', error);
      return res.status(500).json({ message: 'Error fetching product count' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
