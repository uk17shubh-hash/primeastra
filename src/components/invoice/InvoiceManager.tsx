import React, { useState, useRef } from 'react';
import { InvoiceData, InvoiceTemplate } from '../../types/invoice';
import { defaultPdfSampleInvoice, emptyInvoice } from '../../data/sampleInvoice';
import { InvoiceForm } from './InvoiceForm';
import { InvoicePreview } from './InvoicePreview';
import {
  Download,
  Printer,
  Save,
  ArrowLeft,
  Eye,
  CheckCircle2,
  FileCheck2,
  QrCode,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface InvoiceManagerProps {
  onBackToDirectory: () => void;
}

export const InvoiceManager: React.FC<InvoiceManagerProps> = ({ onBackToDirectory }) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(defaultPdfSampleInvoice);
  const [template, setTemplate] = useState<InvoiceTemplate>('gst_official');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(0.95);
  const [showQrCode, setShowQrCode] = useState<boolean>(true);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleLoadSample = () => {
    setInvoiceData({ ...defaultPdfSampleInvoice });
  };

  const handleResetEmpty = () => {
    setInvoiceData({ ...emptyInvoice });
  };

  // High quality PDF download
  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    setIsGeneratingPdf(true);

    try {
      // Create canvas from printable preview element
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const safeInvoiceName = (invoiceData.invoiceNo || 'Tax_Invoice').replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`${safeInvoiceName}_Invoice.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      // Fallback: trigger native print
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Direct Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Save to LocalStorage
  const handleSaveToStorage = () => {
    try {
      const existing = localStorage.getItem('primeastra_invoices');
      const list = existing ? JSON.parse(existing) : [];
      const updated = [
        {
          id: invoiceData.invoiceNo,
          savedAt: new Date().toISOString(),
          data: invoiceData,
        },
        ...list.filter((item: { id: string }) => item.id !== invoiceData.invoiceNo),
      ];
      localStorage.setItem('primeastra_invoices', JSON.stringify(updated.slice(0, 20)));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4 w-full text-left pt-2">
      {/* Top Header Navigation & Action Bar */}
      <div className="p-3.5 sm:p-4 bg-[#121216] text-white rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs border border-[rgba(226,192,114,0.2)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDirectory}
            className="p-2 bg-[#1c1c24] hover:bg-[#252530] text-[#e2c072] rounded-xl transition cursor-pointer border border-[rgba(226,192,114,0.2)] shrink-0"
            title="Back to Paid Tools"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg">🧾</span>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                GST Tax Invoice Generator Pro
              </h2>
              <span className="px-2 py-0.5 bg-[rgba(226,192,114,0.15)] text-[#e2c072] text-[9.5px] font-black rounded-md border border-[rgba(226,192,114,0.3)]">
                PAID TOOL
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400">
              Official Indian GST format (Matching PDF sample) • Instant UPI QR • Vector PDF &amp; Print
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={handleSaveToStorage}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#181820] hover:bg-[#22222c] border border-[rgba(226,192,114,0.25)] text-slate-200 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer"
            title="Save invoice to browser"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-[#e2c072]" />
                <span>Save</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#181820] hover:bg-[#22222c] border border-[rgba(226,192,114,0.25)] text-slate-200 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer"
            title="Direct Print Invoice"
          >
            <Printer className="w-3.5 h-3.5 text-[#e2c072]" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] rounded-xl text-xs font-black shadow-md hover:brightness-110 transition active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Edit Controls / Right Live A4 Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-6 space-y-4 max-h-[750px] overflow-y-auto pr-1 form-scroll">
          <InvoiceForm
            data={invoiceData}
            onChange={setInvoiceData}
            onLoadSample={handleLoadSample}
            onResetEmpty={handleResetEmpty}
          />
        </div>

        {/* Right Column: Live Invoice Preview */}
        <div className="lg:col-span-6 bg-[#121216] p-4 rounded-3xl border border-[rgba(226,192,114,0.15)] shadow-xl space-y-3 sticky top-4">
          {/* Preview Controls Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[rgba(226,192,114,0.15)]">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#e2c072]" />
              <span className="font-extrabold text-white text-xs">Live Invoice Preview</span>
            </div>

            {/* Template Selector */}
            <div className="flex items-center gap-1 bg-[#181820] p-1 rounded-xl border border-[rgba(226,192,114,0.2)]">
              <button
                type="button"
                onClick={() => setTemplate('gst_official')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  template === 'gst_official'
                    ? 'bg-[#e2c072] text-[#070707] shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Official GST (PDF Style)
              </button>
              <button
                type="button"
                onClick={() => setTemplate('modern_gold')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  template === 'modern_gold'
                    ? 'bg-[#e2c072] text-[#070707] shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Modern Gold
              </button>
              <button
                type="button"
                onClick={() => setTemplate('clean_minimal')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  template === 'clean_minimal'
                    ? 'bg-[#e2c072] text-[#070707] shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Minimal
              </button>
            </div>

            {/* QR code toggle & Zoom */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setShowQrCode(!showQrCode)}
                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                  showQrCode
                    ? 'bg-[rgba(226,192,114,0.15)] border-[#e2c072] text-[#e2c072]'
                    : 'bg-[#181820] border-transparent text-slate-400'
                }`}
                title="Toggle UPI QR Code"
              >
                <QrCode className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
                className="p-1.5 bg-[#181820] hover:bg-[#22222c] text-slate-300 rounded-lg transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-slate-400 font-mono w-9 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(1.2, z + 0.1))}
                className="p-1.5 bg-[#181820] hover:bg-[#22222c] text-slate-300 rounded-lg transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scaled Preview Viewport */}
          <div className="w-full max-h-[660px] overflow-auto rounded-2xl bg-black/60 p-2 flex justify-center border border-[rgba(226,192,114,0.1)]">
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <InvoicePreview
                data={invoiceData}
                template={template}
                previewRef={previewRef}
                showQrCode={showQrCode}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[10.5px] text-slate-400">
            <span className="flex items-center gap-1.5 text-[#e2c072]">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Full GST Compliance (HSN, CGST, SGST, IGST, E&amp;OE)</span>
            </span>
            <span>A4 Ready (210mm x 297mm)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
