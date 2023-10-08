import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import process from 'process';
import YAML from 'yaml';

const dataDirectory = path.join(process.cwd(), 'data');

type ResponseData = {
  message: string;
};

export default function handler(_req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const fullPath = path.join(dataDirectory, 'api.yaml');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  res.status(200).json(YAML.parse(fileContents));
}
