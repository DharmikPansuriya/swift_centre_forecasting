export function formatDate(iso: string) {
  try {
    const date = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(date);
  } catch {
    return iso;
  }
}
