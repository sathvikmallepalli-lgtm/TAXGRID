import BillSplitter from '../components/BillSplitter';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BillSplitterPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link to="/tools" className="flex items-center text-gray-600 hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Tools
                </Link>
            </div>
            <BillSplitter />
        </div>
    );
}
