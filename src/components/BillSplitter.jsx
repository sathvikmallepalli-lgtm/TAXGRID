import { useState, useEffect } from 'react';
import ParticipantList from './ParticipantList';
import SplitSummary from './SplitSummary';
import { Split, UserPlus } from 'lucide-react';

export default function BillSplitter({ initialAmount = 0 }) {
  const [total, setTotal] = useState(initialAmount);
  const [participants, setParticipants] = useState([
    { name: '', amount: 0, paid: false },
    { name: '', amount: 0, paid: false },
  ]);

  // Distribute total amount equally among participants
  const updateEqualSplit = (newTotal, currentParticipants) => {
    if (newTotal > 0 && currentParticipants.length > 0) {
      const amountPerPerson = newTotal / currentParticipants.length;
      return currentParticipants.map(p => ({ ...p, amount: amountPerPerson }));
    }
    return currentParticipants.map(p => ({ ...p, amount: 0 }));
  };

  const handleTotalChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setTotal(value);
    setParticipants(prev => updateEqualSplit(value, prev));
  };

  const handleAddParticipant = () => {
    setParticipants(prev => {
      const newParticipants = [...prev, { name: '', amount: 0, paid: false }];
      return updateEqualSplit(total, newParticipants);
    });
  };

  const handleRemoveParticipant = (index) => {
    if (participants.length > 2) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  const handleUpdateParticipant = (index, field, value) => {
    const updated = participants.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    setParticipants(updated);
  };

  const handleTogglePaid = (index) => {
    const updated = participants.map((p, i) =>
      i === index ? { ...p, paid: !p.paid } : p
    );
    setParticipants(updated);
  };

  return (
    <section className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Split className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bill Splitter</h2>
          <p className="text-sm text-gray-600">Split costs among friends</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Total Amount Input */}
        <div>
          <label htmlFor="total-amount" className="block text-sm font-medium text-gray-700 mb-2">
            Total Amount
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Rs.</span>
            <input
              id="total-amount"
              type="number"
              value={total}
              onChange={handleTotalChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono text-lg"
            />
          </div>
        </div>

        {/* Split Type Info */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Equal Split:</span> Rs. {(total / participants.length).toFixed(2)} per person
          </p>
        </div>

        {/* Participants */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Participants ({participants.length})
            </label>
            <button
              onClick={handleAddParticipant}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Person
            </button>
          </div>

          <ParticipantList
            participants={participants}
            onUpdate={handleUpdateParticipant}
            onRemove={handleRemoveParticipant}
            onTogglePaid={handleTogglePaid}
          />
        </div>

        {/* Settlement Summary */}
        {total > 0 && <SplitSummary participants={participants} total={total} />}
      </div>
    </section>
  );
}
