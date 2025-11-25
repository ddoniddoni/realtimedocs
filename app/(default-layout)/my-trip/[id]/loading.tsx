export default function LoadingMyTrip() {
  return (
    <main className="flex flex-1 flex-col px-4 py-4 gap-4">
      <div className="h-6 w-40 rounded-md bg-muted animate-pulse" />
      <div className="h-4 w-64 rounded-md bg-muted animate-pulse" />
      <div className="h-32 w-full rounded-xl bg-muted animate-pulse" />
    </main>
  );
}
