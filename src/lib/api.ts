export async function parseApiJson<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    const preview = text.slice(0, 120).replace(/\s+/g, " ");
    throw new Error(
      preview.startsWith("<!DOCTYPE") || preview.startsWith("<html")
        ? "The server returned an unexpected HTML response. Please refresh and try again."
        : "The server returned an invalid response."
    );
  }
}
