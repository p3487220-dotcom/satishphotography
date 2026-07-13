import { NextRequest } from "next/server";
import db from "@/lib/db";

interface ReviewPayload {
  name: string;
  role: string;
  text: string;
  rating: number;
  location: string;
}

async function getReviews() {
  const result = await db.query(
    `SELECT id, name, role, text, rating, location FROM reviews ORDER BY created_at DESC LIMIT 20`
  );
  return result.rows as ReviewPayload[];
}

async function createReview(data: ReviewPayload) {
  const result = await db.query(
    `INSERT INTO reviews (name, role, text, rating, location) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [data.name, data.role, data.text, data.rating, data.location]
  );

  const inserted = result.rows[0] as { id?: number } | undefined;
  const reviewId = Number(inserted?.id ?? 0);

  return {
    id: reviewId,
    ...data,
  };
}

export async function GET() {
  try {
    const reviews = await getReviews();
    return new Response(JSON.stringify({ success: true, reviews }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Reviews API] GET failed", error);
    return new Response(JSON.stringify({ success: false, error: "Unable to load reviews." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ReviewPayload;
    const name = body.name?.trim();
    const text = body.text?.trim();
    const rating = Number(body.rating);

    if (!name || !text || !rating || rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ success: false, error: "Please provide your name, rating, and review text." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const review = await createReview({
      name,
      role: body.role?.trim() || "Client",
      text,
      rating,
      location: body.location?.trim() || "",
    });

    return new Response(JSON.stringify({ success: true, review }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Reviews API] POST failed", error);
    return new Response(JSON.stringify({ success: false, error: "Unable to submit review." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
