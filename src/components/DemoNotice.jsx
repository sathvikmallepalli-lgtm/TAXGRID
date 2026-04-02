import { Info, ExternalLink } from 'lucide-react';

export default function DemoNotice({ variant = 'info' }) {
  const variants = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      iconColor: 'text-blue-600'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-900',
      iconColor: 'text-yellow-600'
    }
  };

  const style = variants[variant];

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 mb-6`}>
      <div className="flex items-start gap-3">
        <Info className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h4 className={`font-bold ${style.text} mb-2 text-sm`}>
            🏛️ Demo Platform for Government Presentation
          </h4>
          <div className={`text-xs ${style.text} space-y-1.5 leading-relaxed`}>
            <p>
              This is a <strong>demonstration platform</strong> showcasing GST verification workflows.
              Keyword search and offline scenarios use a <strong>local demo database</strong>. For{' '}
              <strong>live GSTIN</strong> details, configure the server-side GST proxy (see{' '}
              <code className="bg-blue-100 px-1 rounded">.env.example</code>) and run{' '}
              <code className="bg-blue-100 px-1 rounded">npm run dev:full</code>.
            </p>
            <p>
              <strong>Official portal:</strong> For authoritative GSTIN verification, cross-check at{' '}
              <a
                href="https://www.gst.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold hover:opacity-80 inline-flex items-center gap-1"
              >
                www.gst.gov.in
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
