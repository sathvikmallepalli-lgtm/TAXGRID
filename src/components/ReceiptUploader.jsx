import { useState, useRef } from 'react';
import { Upload, Camera, X, FileImage } from 'lucide-react';
import { pdfToImages } from '../utils/pdfToImages';

export default function ReceiptUploader({ onImagesSelect, previews = [] }) {
  const [dragActive, setDragActive] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const fileInputRef = useRef(null);

  const processFiles = async (fileList) => {
    const files = Array.from(fileList);
    const imageFiles = [];
    const pdfFiles = [];

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) continue;
      if (file.type === 'application/pdf') {
        pdfFiles.push(file);
      } else if (file.type.startsWith('image/')) {
        imageFiles.push(file);
      }
    }

    if (imageFiles.length === 0 && pdfFiles.length === 0) return;

    const results = [];

    // Process image files
    await new Promise((resolve) => {
      if (imageFiles.length === 0) return resolve();
      let loaded = 0;
      imageFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          results.push({ file, preview: reader.result, name: file.name });
          loaded++;
          if (loaded === imageFiles.length) resolve();
        };
        reader.readAsDataURL(file);
      });
    });

    // Process PDF files
    if (pdfFiles.length > 0) {
      setPdfLoading(true);
      for (const pdfFile of pdfFiles) {
        try {
          const pages = await pdfToImages(pdfFile);
          for (const page of pages) {
            results.push({
              file: pdfFile,
              preview: page.dataUrl,
              name: `${pdfFile.name} (p${page.pageNum})`,
            });
          }
        } catch (err) {
          console.error('PDF processing failed:', pdfFile.name, err);
        }
      }
      setPdfLoading(false);
    }

    if (results.length > 0) {
      onImagesSelect(results);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Reset input so same files can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          multiple
          onChange={handleChange}
          className="hidden"
          id="receipt-upload"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className="w-12 h-12 text-gray-400" />
          </div>

          <div>
            <label
              htmlFor="receipt-upload"
              className="cursor-pointer text-primary hover:text-secondary font-medium"
            >
              Click to upload invoices
            </label>
            <span className="text-gray-600"> or drag and drop</span>
            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG, PDF (Max 10MB each) — Select multiple files at once
            </p>
          </div>

          <div className="pt-4">
            <label
              htmlFor="receipt-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 cursor-pointer transition-colors"
            >
              <Camera className="w-5 h-5" />
              Upload Invoices
            </label>
          </div>
        </div>
      </div>

      {/* PDF loading indicator */}
      {pdfLoading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <span className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full inline-block"></span>
          Rendering PDF pages for OCR...
        </div>
      )}

      {/* Thumbnail strip of queued images */}
      {previews.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2 font-medium">
            <FileImage className="w-4 h-4 inline mr-1" />
            {previews.length} invoice{previews.length > 1 ? 's' : ''} loaded
          </p>
          <div className="flex flex-wrap gap-3">
            {previews.map((item, index) => (
              <div key={index} className="relative group">
                <img
                  src={item.preview}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
                <button
                  onClick={() => item.onRemove(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center rounded-b-lg px-1 truncate">
                  #{index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
