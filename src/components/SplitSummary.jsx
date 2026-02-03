import { ArrowRight } from 'lucide-react';

export default function SplitSummary({ participants, total }) {
  // Calculate settlements (who owes whom)
  const calculateSettlements = () => {
    const payers = participants.filter(p => p.paid);
    const debtors = participants.filter(p => !p.paid);

    if (payers.length === 0) {
      return [];
    }

    const settlements = [];

    // Simple case: one payer
    if (payers.length === 1) {
      const payer = payers[0];
      debtors.forEach(debtor => {
        if (debtor.amount > 0) {
          settlements.push({
            from: debtor.name || 'Someone',
            to: payer.name || 'Payer',
            amount: debtor.amount,
          });
        }
      });
    } else {
      // Multiple payers - split proportionally
      debtors.forEach(debtor => {
        if (debtor.amount > 0) {
          // Simplified: split debt among all payers equally
          const amountPerPayer = debtor.amount / payers.length;
          payers.forEach(payer => {
            settlements.push({
              from: debtor.name || 'Someone',
              to: payer.name || 'Payer',
              amount: amountPerPayer,
            });
          });
        }
      });
    }

    return settlements;
  };

  const settlements = calculateSettlements();

  if (settlements.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          Mark at least one person as "Paid" to see settlement summary.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Settlement Summary</h3>

      <div className="space-y-2">
        {settlements.map((settlement, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
          >
            <span className="text-sm font-medium text-blue-900 flex-1">
              {settlement.from}
            </span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900 flex-1 text-right">
              {settlement.to}
            </span>
            <span className="text-sm font-bold text-blue-900 ml-3 font-mono">
              Rs. {settlement.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="p-3 bg-gray-100 rounded-lg border border-gray-300">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-900">Total Amount</span>
          <span className="text-lg font-bold text-gray-900 font-mono">
            Rs. {total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
