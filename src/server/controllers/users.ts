import asyncMiddleware from '../middleware/async';
import express from 'express';
import { users } from 'superfast-core';

const app = express();

app.get('/users', asyncMiddleware(users));

export default app;
