import { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { extractGSTIN, extractAmount, extractDate, extractVendor } from '../utils/extractGSTIN';
import { validateGSTIN } from '../utils/validateGSTIN';
import LoadingSpinner from './LoadingSpinner';
import ValidationResult from './ValidationResult';
import { FileText, DollarSign, Calendar, Store } from 'lucide-react';

export default function OCRProcessor({ image, onDataExtracted }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrText, setOcrText] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  useEffect(() => {
    if (image) {
      processImage(image);
    }
  }, [image]);

  const processImage = async (imageData) => {
    setIsProcessing(true);
    setProgress(0);
    setOcrText('');
    setExtractedData(null);
    setValidationResult(null);

    try {
      const result = await Tesseract.recognize(imageData, 'eng', {
        logger: (info) => {
          if (info.status === 'recognizing text') {
            setProgress(Math.round(info.progress * 100));
          }
        },
      });

      const text = result.data.text;
      setOcrText(text);

      // Extract data
      const gstin = extractGSTIN(text);
      const amount = extractAmount(text);
      const date = extractDate(text);
      const vendor = extractVendor(text);

      const data = {
        gstin,
        amount,
        date,
        vendor,
        fullText: text,
      };

      setExtractedData(data);

      // Validate GSTIN if found
      if (gstin) {
        const validation = validateGSTIN(gstin);
        setValidationResult(validation);
      }

      // Pass data to parent
      if (onDataExtracted) {
        onDataExtracted(data);
      }
    } catch (error) {
      console.error('OCR Error:', error);
      alert('Failed to process image. Please try with a clearer image.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <LoadingSpinner message={`Processing image... ${progress}%`} />
      </div>
    );
  }

  if (!extractedData) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Data</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {extractedData.vendor && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Store className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Vendor</p>
                <p className="text-sm text-gray-900">{extractedData.vendor}</p>
              </div>
            </div>
          )}

          {extractedData.amount && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Total Amount</p>
                <p className="text-sm text-gray-900">Rs. {extractedData.amount.toFixed(2)}</p>
              </div>
            </div>
          )}

          {extractedData.date && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Date</p>
                <p className="text-sm text-gray-900">{extractedData.date}</p>
              </div>
            </div>
          )}

          {extractedData.gstin && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-600 font-medium">GSTIN</p>
                <p className="text-sm text-gray-900 font-mono">{extractedData.gstin}</p>
              </div>
            </div>
          )}
        </div>

        {!extractedData.gstin && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              No GSTIN detected in the image. You can enter it manually above.
            </p>
          </div>
        )}
      </div>

      {validationResult && (
        <ValidationResult result={validationResult} />
      )}

      <details className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <summary className="cursor-pointer text-sm font-medium text-gray-700">
          View Full OCR Text
        </summary>
        <pre className="mt-3 text-xs text-gray-600 whitespace-pre-wrap font-mono bg-white p-3 rounded border border-gray-200 max-h-64 overflow-y-auto">
          {ocrText}
        </pre>
      </details>
    </div>
  );
}
