// api/secure-endpoint.js
import { getAuth } from 'firebase-admin/auth';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const uid = decodedToken.uid;
    
    res.status(200).json({ message: 'Authorized', uid });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
