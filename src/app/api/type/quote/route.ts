// app/api/quote/route.ts
export async function GET() {
  const res = await fetch("https://api.quotable.io/random");
  const data = await res.json();

  return Response.json({
    content: data.content,
    author: data.author,
  });
}
