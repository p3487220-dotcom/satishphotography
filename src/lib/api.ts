// src/lib/api.ts
// Frontend helpers for parsing API responses safely.

export async function parseApiJson<T = unknown>(res: Response): Promise<T> {
  // If server returned HTML (e.g., Next.js error page), avoid res.json() crash.
  const contentType = res.headers.get("content-type") || "";

  // Read body as text first (works for both JSON and HTML).
  const text = await res.text();

  if (!contentType.toLowerCase().includes("application/json")) {
    // Try to surface useful message from HTML.
    // Keep it short so it doesn't flood UI.
    const trimmed = text.trim().slice(0, 500);
    throw new Error(
      `Request failed with ${res.status} ${res.statusText}. Response was not JSON. Preview: ${trimmed}`
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch (e) {
    const trimmed = text.trim().slice(0, 500);
    throw new Error(
      `Request failed with ${res.status} ${res.statusText}. Invalid JSON. Preview: ${trimmed}`
    );
  }
}

