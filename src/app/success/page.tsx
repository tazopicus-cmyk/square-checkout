import Link from 'next/link';

export default function Success() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-slate-400 mb-8">
          Thank you for your purchase. Check your email for download instructions.
        </p>
        <Link
          href="/"
          className="inline-block bg-amber-500 hover:bg-amber-400 px-6 py-3 rounded-lg font-semibold"
        >
          Back to Store
        </Link>
      </div>
    </div>
  );
}
