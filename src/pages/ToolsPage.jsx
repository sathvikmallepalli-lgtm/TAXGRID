import { Link } from 'react-router-dom';
import { Scan, Shield, MapPin, FileCheck } from 'lucide-react';

export default function ToolsPage() {
    const tools = [
        {
            id: 'gst-validator',
            name: 'GST Validator',
            description: 'Verify Any GSTIN Instantly',
            icon: Shield,
            path: '/#validator',
            color: 'bg-blue-500'
        },
        {
            id: 'ocr-scanner',
            name: 'OCR Scanner',
            description: 'Extract Data from Receipts',
            icon: Scan,
            path: '/#scanner',
            color: 'bg-purple-500'
        },
        {
            id: 'gi-verification',
            name: 'GI Location Verification',
            description: 'Detect Geographical Indication Fraud',
            icon: MapPin,
            path: '/gi-verification',
            color: 'bg-orange-500'
        },
        {
            id: 'audit-shield',
            name: 'TaxGrid Audit Shield',
            description: 'Generate PDF Verification Reports',
            icon: FileCheck,
            path: '/audit-shield',
            color: 'bg-green-600'
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


