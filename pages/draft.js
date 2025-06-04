import { useState } from 'react';
import { useRouter } from 'next/router';

export default function DraftForm() {
  const [form, setForm] = useState({ docType: '', name: '', address: '', amount: '' });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/generateDraft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    router.push(`/result?text=${encodeURIComponent(data.text)}`);
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <form className="max-w-lg mx-auto space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">📋 Fill in Document Details</h2>
        <select name="docType" onChange={handleChange} className="w-full p-3 text-black rounded">
          <option value="">Select Document Type</option>
          <option value="rent">Rent Agreement</option>
          <option value="nda">NDA</option>
          <option value="affidavit">Affidavit</option>
        </select>
        <input name="name" placeholder="Your Name" className="w-full p-3 text-black rounded" onChange={handleChange} />
        <input name="address" placeholder="Address" className="w-full p-3 text-black rounded" onChange={handleChange} />
        <input name="amount" placeholder="Amount / Term" className="w-full p-3 text-black rounded" onChange={handleChange} />
        <button type="submit" className="bg-white text-black px-4 py-2 rounded-xl">Generate Draft</button>
      </form>
    </div>
  );
}
