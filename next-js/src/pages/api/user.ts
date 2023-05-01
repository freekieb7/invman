import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await axios.get("http://service-app:8080/ping");
  
  res.status(200).json(data.data)
}
