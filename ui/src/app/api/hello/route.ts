export async function GET() {
  return Response.json({ name: 'John Doe' })
}

export const runtime = 'edge';
