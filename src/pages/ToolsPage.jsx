import { Link } from 'react-router-dom';
import { Scan, Shield, MapPin, FileCheck } from 'lucide-react';

export default function ToolsPage() {
    const tools = [
        {
            id: 'gst-validator',
            name: 'GSTIN Validator',
            description: 'Verify GSTIN Format & Business Details',
            icon: Shield,
            path: '/validator',
            color: 'bg-blue-500'
        },
        {
            id: 'audit-shield',
            name: 'Audit Shield (OCR + Analytics)',
            description: 'Scan Receipts, Detect Fraud & Generate Reports',
            icon: FileCheck,
            path: '/audit-shield',
            color: 'bg-emerald-600'
        },
        {
            id: 'gi-verification',
            name: 'GI Product Verification',
            description: 'Verify Geographical Indication Authenticity',
            icon: MapPin,
            path: '/gi-verification',
            color: 'bg-orange-500'
        },
        {
            id: 'search',
            name: 'Business Search',
            description: 'Search GSTIN Database by Keywords',
            icon: Scan,
            path: '/search',
            color: 'bg-purple-500'
        },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">TaxGrid Tools</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <Link
                            key={tool.id}
                            to={tool.path}
                            className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                        >
                            <div className={`p-3 rounded-lg text-white ${tool.color}`}>
                                <Icon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
                                <p className="text-gray-600 mb-4">{tool.description}</p>
                                <span className="text-primary font-medium hover:underline">Launch Tool →</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}


