// components/DocumentForm.jsx

import React, { useState } from "react";

export default function DocumentForm({ onGenerate }) {
  const [formData, setFormData] = useState({
    partyA: "",
    partyB: "",
    contractDate: "",
    agreementType: "",
    jurisdiction: "India",
    additionalNotes: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("🖊️ DocumentForm.handleSubmit – formData:", formData);
    setLoading(true);
    await onGenerate(formData);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Enter Draft Details</h2>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="partyA" className="block text-sm font-medium text-gray-700">
            Party A Name
          </label>
          <input
            type="text"
            name="partyA"
            id="partyA"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={formData.partyA}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="partyB" className="block text-sm font-medium text-gray-700">
            Party B Name
          </label>
          <input
            type="text"
            name="partyB"
            id="partyB"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={formData.partyB}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="contractDate" className="block text-sm font-medium text-gray-700">
            Contract Date
          </label>
          <input
            type="date"
            name="contractDate"
            id="contractDate"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={formData.contractDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="agreementType" className="block text-sm font-medium text-gray-700">
            Agreement Type
          </label>
          <input
            type="text"
            name="agreementType"
            id="agreementType"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={formData.agreementType}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-700">
            Jurisdiction
          </label>
          <select
            name="jurisdiction"
            id="jurisdiction"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={formData.jurisdiction}
            onChange={handleChange}
          >
            <option value="India">India</option>
            <option value="Delhi">Delhi</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            {/* …other states if needed */}
          </select>
        </div>

        <div>
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">
            Additional Notes / Clauses
          </label>
          <textarea
            name="additionalNotes"
            id="additionalNotes"
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Any specific clauses or notes to include"
            value={formData.additionalNotes}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Generating…" : "Generate Draft"}
        </button>
      </div>
    </form>
  );
}
