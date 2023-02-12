import express, { Request, Response } from 'express';
import { getDatabase } from '../database/connection';
import asyncMiddleware from '../middleware/async';

const app = express();

app.get(
  '/collections/:id/fields',
  asyncMiddleware(async (req: Request, res: Response) => {
    const database = await getDatabase();
    const id = Number(req.params.id);
    const fields = await database('superfast_fields').where('superfast_collection_id', id);

    res.json({
      fields: fields,
    });
  })
);

export default app;
