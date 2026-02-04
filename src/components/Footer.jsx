import { Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t border-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              Built with <Heart className="w-4 h-4 inline text-red-500" /> for transparency in GST
            </p>
            <p className="text-xs text-gray-500 mt-1">
              100% Client-Side • No Data Collected • Free & Open Source
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>Open Source</span>
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">About TaxGrid</h4>
              <p>
                Fighting Rs. 7.08L Crore GST fraud by empowering citizens with
                instant GSTIN validation and bill verification tools.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Privacy</h4>
              <p>
                All processing happens in your browser. No images or data are
                ever uploaded to any server. Your privacy is guaranteed.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Disclaimer</h4>
              <p>
                This tool provides offline GSTIN format validation. For official
                verification, please check the GST portal.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-300 text-center">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">
            Built by TrioMav Tech Private Limited - Innovations Division
          </p>
        </div>
      </div>
    </footer>
  );
}
