// components/DocumentForm.jsx

import React, { useState, useEffect } from "react";

// 1) List all the kinds of agreements you want to support here:
const agreementTypeOptions = [
  "Sale Deed",
  "Lease Agreement",
  "Partnership Agreement",
  "Employment Agreement",
  "Non-Disclosure Agreement (NDA)",
  "Joint Venture Agreement",
  "Service Agreement",
  // …add more as needed
];

// 2) For each agreement type, map to an array of relevant Indian statutes, Acts, Sections, etc.
//    You can expand these later or fetch them dynamically if you want.
const codeOptionsMap = {
  "Sale Deed": [
    "Transfer of Property Act, 1882 (Sections 54, 55)",
    "Indian Contract Act, 1872 (Sections 10, 38)",
    "Registration Act, 1908 (Sections 17, 18)",
    "Stamp Act, 1899 (Relevant Stamp Duty provisions)",
  ],
  "Lease Agreement": [
    "Transfer of Property Act, 1882 (Sections 105–117)",
    "Indian Contract Act, 1872 (Sections 106–116)",
    "Rent Control Act (State‐specific; e.g., Delhi Rent Control Act)",
  ],
  "Partnership Agreement": [
    "Indian Partnership Act, 1932 (Sections 4–11, 13–18)",
    "Limited Liability Partnership Act, 2008 (if LLP)",
  ],
  "Employment Agreement": [
    "Industrial Disputes Act, 1947 (Sections 2B, 12)",
    "Factories Act, 1948 (Sections 2(k), 135)",
    "Shops and Establishments Act (State‐specific provisions)",
  ],
  "Non-Disclosure Agreement (NDA)": [
    "Indian Contract Act, 1872 (Sections 27, 28)",
    "Information Technology Act, 2000 (Relevant confidentiality provisions)",
    "Trade Marks Act, 1999 (Section 30)",
  ],
  "Joint Venture Agreement": [
    "Indian Partnership Act, 1932 (if structured as partnership)",
    "Companies Act, 2013 (Section 2(28), Section 2(68))",
    "Foreign Exchange Management Act, 1999 (if FDI involved)",
  ],
  "Service Agreement": [
    "Indian Contract Act, 1872 (Sections 2(h), 73)",
    "Consumer Protection Act, 2019 (if services to consumers)",
  ],
  // Add more mapping as needed for other agreement types…
};

export default function DocumentForm({ onGenerate }) {
  const [formData, setFormData] = useState({
    partyA: "",
    partyB: "",
    contractDate: "",
    agreementType: "",
    selectedCodes: [], // will hold the chosen legal codes array
    jurisdiction: "India",
    additionalNotes: "",
  });
  const [loading, setLoading] = useState(false);

  // Whenever agreementType changes, reset selectedCodes:
  useEffect(() => {
    setFormData((prev) => ({ ...prev, selectedCodes: [] }));
  }, [formData.agreementType]);

  function handleChange(e) {
    const { name, value, multiple, options } = e.target;

    if (multiple) {
      // Build an array of selected values for multi-select:
      const selected = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);

      setFormData((prev) => ({
        ...prev,
        [name]: selected,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("🖊️ DocumentForm.handleSubmit – formData:", formData);
    setLoading(true);
    await onGenerate(formData);
    setLoading(false);
  }

  // Get the code options array for the currently selected agreementType:
  const currentCodeOptions =
    codeOptionsMap[formData.agreementType] || [];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4">
        Enter Draft Details
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {/* Party A */}
        <div>
          <label
            htmlFor="partyA"
            className="block text-sm font-medium text-gray-700"
          >
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

        {/* Party B */}
        <div>
          <label
            htmlFor="partyB"
            className="block text-sm font-medium text-gray-700"
          >
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

        {/* Contract Date */}
        <div>
          <label
            htmlFor="contractDate"
            className="block text-sm font-medium text-gray-700"
          >
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

        {/* Agreement Type Dropdown */}
        <div>
          <label
            htmlFor="agreementType"
            className="block text-sm font-medium text-gray-700"
          >
            Agreement Type
          </label>
          <select
            name="agreementType"
            id="agreementType"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={formData.agreementType}
            onChange={handleChange}
          >
            <option value="">Select an agreement type</option>
            {agreementTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Legal Codes Multi‐Select (shown only after picking an agreement type) */}
        {formData.agreementType && (
          <div>
            <label
              htmlFor="selectedCodes"
              className="block text-sm font-medium text-gray-700"
            >
              Legal Codes (select one or more statutes/sections)
            </label>
            <select
              name="selectedCodes"
              id="selectedCodes"
              multiple
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32"
              value={formData.selectedCodes}
              onChange={handleChange}
            >
              {currentCodeOptions.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold <kbd className="border px-1 rounded">Ctrl</kbd> (Windows)
              or <kbd className="border px-1 rounded">Cmd</kbd> (Mac) to
              select multiple.
            </p>
          </div>
        )}

        {/* Jurisdiction */}
        <div>
          <label
            htmlFor="jurisdiction"
            className="block text-sm font-medium text-gray-700"
          >
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
            {/* …add more states if needed … */}
          </select>
        </div>

        {/* Additional Notes */}
        <div>
          <label
            htmlFor="additionalNotes"
            className="block text-sm font-medium text-gray-700"
          >
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
          disabled={loading || !formData.agreementType}
        >
          {loading ? "Generating…" : "Generate Draft"}
        </button>
      </div>
    </form>
  );
}
