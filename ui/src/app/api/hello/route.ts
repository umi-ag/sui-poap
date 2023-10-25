
// import type { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' });
}

// export default function handler(req: NextRequest, res: NextResponse) {
//   if (req.method === 'GET') {
//     res.re
//     res.status(200).json({ message: 'GET request received' });
//   } else if (req.method === 'POST') {
//     res.status(200).json({ message: 'POST request received' });
//   } else {
//     res.status(405).json({ message: 'Method Not Allowed' });
//   }
// }
