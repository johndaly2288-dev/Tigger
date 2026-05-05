import express from 'express';
import { initDb } from './db.js';
import { ProductService } from './productService.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;
const productService = new ProductService();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/product', async (req, res) => {
  const name = req.query.name as string;
  if (!name) {
    return res.status(400).json({ error: 'Product name is required' });
  }

  try {
    const data = await productService.getProductData(name);
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const start = async () => {
  try {
    await initDb();
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
