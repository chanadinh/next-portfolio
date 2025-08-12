export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Portfolio</h2>
        <p className="text-gray-500">Please wait while we prepare your experience...</p>
      </div>
    </div>
  );
}
