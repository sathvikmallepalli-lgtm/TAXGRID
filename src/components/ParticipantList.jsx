import { X, Check } from 'lucide-react';

export default function ParticipantList({ participants, onUpdate, onRemove, onTogglePaid }) {
  return (
    <div className="space-y-2">
      {participants.map((participant, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex-1">
            <input
              type="text"
              value={participant.name}
              onChange={(e) => onUpdate(index, 'name', e.target.value)}
              placeholder={`Person ${index + 1}`}
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rs.</span>
            <input
              type="number"
              value={participant.amount}
              readOnly
              className="w-24 px-3 py-1.5 border border-gray-200 rounded bg-gray-100 text-sm text-right font-mono"
            />
          </div>

          <button
            onClick={() => onTogglePaid(index)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              participant.paid
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
            title={participant.paid ? "Marked as paid" : "Mark as paid"}
          >
            {participant.paid ? (
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3" />
                Paid
              </span>
            ) : (
              'Owes'
            )}
          </button>

          <button
            onClick={() => onRemove(index)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            disabled={participants.length <= 2}
            title="Remove participant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
