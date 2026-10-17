export default function Loading() {
  return (
    <div
      role="status"
      className="flex min-h-[50vh] items-center justify-center"
      aria-label="Loading"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" />
    </div>
  );
}
