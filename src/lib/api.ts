export async function parseApiJson<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    const preview = text.slice(0, 120).replace(/\s+/g, " ");
    // If the server returned HTML (e.g. an error page), return a safe fallback
    // object instead of throwing — callers can inspect for an `error` field.
    if (preview.startsWith("<!DOCTYPE") || preview.startsWith("<html")) {
      return ({ error: "The server returned an unexpected HTML response. Please refresh and try again.", _preview: preview } as unknown) as T;
    }

    // Return a generic error payload when JSON parsing fails but it's not HTML.
    return ({ error: "The server returned an invalid response.", _preview: preview } as unknown) as T;
  }
}
