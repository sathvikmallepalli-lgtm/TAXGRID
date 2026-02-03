import { useState } from 'react';

export default function GSTINInput({ onValidate, initialValue = '' }) {
  const [gstin, setGstin] = useState(initialValue);

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/\s/g, '');
    // Limit to 15 characters
    if (value.length <= 15) {
      setGstin(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gstin.trim()) {
      onValidate(gstin);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col gap-2">
        <label htmlFor="gstin-input" className="text-sm font-medium text-gray-700">
          Enter GSTIN
        </label>
        <div className="flex gap-2">
          <input
            id="gstin-input"
            type="text"
            value={gstin}
            onChange={handleChange}
            placeholder="27AAPFU0939F1ZV"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono text-sm"
            maxLength={15}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
            disabled={!gstin.trim()}
          >
            Validate
          </button>
        </div>
        <p className="text-xs text-gray-500">
          {gstin.length}/15 characters
        </p>
      </div>
    </form>
  );
}
