export default function Loading() {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="loading-ring mx-auto mb-4" />
        <p className="font-medium text-slate">Loading...</p>
      </div>
    </div>
  );
}
