import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">🧾 Legal Drafter India</h1>
      <p className="mb-6 text-center max-w-xl text-gray-300">
        Draft Rent Agreements, NDAs, and Affidavits using real Indian legal templates with live law integration.
      </p>
      <Link href="/draft">
        <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold shadow">Start Drafting</button>
      </Link>
    </div>
  );
}
