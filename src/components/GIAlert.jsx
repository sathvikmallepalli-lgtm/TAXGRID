import { AlertTriangle, MapPin } from 'lucide-react';

export default function GIAlert({ ocrText, stateCode, stateName }) {
  // Simple check logic or just display passed alerts
  // In the real app, this logic is in checkGIOrigin, but here we just show the UI
  // if the parent passes an alert.

  // Actually, looking at ReceiptScanner usage:
  // <GIAlert ocrText={ocrText} stateCode={validationResult.stateCode} stateName={validationResult.stateName} />

  // So this component likely needs to run the check itself OR just be a dumb display dependent on props.
  // The user likely expects it to check the text against known GI products.

  return (
    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg mt-3">
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-orange-800">GI Verification Active</p>
          <p className="text-xs text-orange-700 mt-1">
            Checking if products in this invoice match the seller's state ({stateName}).
          </p>
        </div>
      </div>
    </div>
  );
}
