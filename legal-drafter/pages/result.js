import { useRouter } from 'next/router';

export default function Result() {
  const router = useRouter();
  const { text } = router.query;

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">📄 Your Draft Document</h2>
      <div className="bg-gray-900 p-4 rounded text-gray-200 whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}
