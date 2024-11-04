import express, { Request, Response } from 'express';
import { fetchDummyData } from '../src/components/user-services/index';

const app = express();
const PORT = 3000;

app.get('/', async (req: Request, res: Response) => {
  try {
    const groupedData = await fetchDummyData();
    res.json(groupedData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
