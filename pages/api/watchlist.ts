import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const client = new MongoClient(process.env.MONGODB_URI!);
const dbName = 'bruinmovies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string; };
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const userId = decoded.userId;

  await client.connect();
  console.log('Connected to MongoDB');
  const db = client.db(dbName);
  const usersCollection = db.collection('users');

  switch (method) {
    case 'POST':
      const { movieId, action } = req.body;
      if (action === 'add') {
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $addToSet: { watchlist: movieId } }
        );
        res.status(200).json({ message: 'Movie added to watchlist' });
      } else if (action === 'remove') {
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { watchlist: movieId } }
        );
        res.status(200).json({ message: 'Movie removed from watchlist' });
      } else {
        res.status(400).json({ error: 'Invalid action' });
      }
      break;
    case 'GET':
      const { imdbId } = req.query;
      if (imdbId) {
        const users = await usersCollection.find({ watchlist: imdbId }).toArray();
        const userDetails = users.map(user => ({
          username: user.username || '',
          email: user.email || '',
          profilePicture: user.profilePicture || '',
          biography: user.biography || '',
          genre_interests: user.genre_interests || '',
          major: user.major || '',
          year: user.year || ''
        }));
        res.status(200).json({ users: userDetails });
      } else {
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        res.status(200).json({ watchlist: user?.watchlist || [] });
      }
      break;
    default:
      const users = await usersCollection.find({ watchlist: imdbId }).toArray();
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
