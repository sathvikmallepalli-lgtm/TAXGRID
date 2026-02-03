/**
 * Invoice Template Component
 * OCR-friendly invoice layout for generating test invoices
 * Renders as HTML/CSS that can be screenshotted or printed
 */

export default function InvoiceTemplate({
  invoiceNo,
  date,
  sellerName,
  sellerGstin,
  sellerAddress,
  sellerState,
  buyerName = 'Cash Sale / Walk-in Customer',
  buyerGstin = 'N/A',
  buyerAddress = 'N/A',
  items = [], // [{name, hsn, qty, rate, amount}]
  cgst = 0,
  sgst = 0,
  igst = 0,
  totalAmount = 0
}) {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = cgst + sgst + igst;

  return (
    <div
      className="invoice-template bg-white p-8"
      style={{
        width: '800px',
        minHeight: '1100px',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '14px',
        color: '#000000',
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* Header */}
      <div className="border-b-4 border-black pb-4 mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ fontSize: '32px', fontWeight: 'bold' }}>
          TAX INVOICE
        </h1>
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-lg mb-1" style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {sellerName}
            </p>
            <p className="text-sm mb-1" style={{ fontSize: '13px' }}>{sellerAddress}</p>
            <p className="text-sm" style={{ fontSize: '13px' }}>State: {sellerState}</p>
          </div>
          <div className="text-right">
            <p className="font-bold" style={{ fontSize: '14px', fontWeight: 'bold' }}>
              Invoice No: {invoiceNo}
            </p>
            <p style={{ fontSize: '14px' }}>Date: {date}</p>
          </div>
        </div>
      </div>

      {/* GSTIN - Large and Bold */}
      <div className="bg-gray-100 border-2 border-black p-4 mb-6" style={{ backgroundColor: '#f3f4f6', border: '2px solid #000' }}>
        <p className="text-sm mb-1" style={{ fontSize: '13px', fontWeight: 'bold' }}>
          SELLER GSTIN:
        </p>
        <p className="text-2xl font-bold tracking-wider" style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.1em' }}>
          {sellerGstin}
        </p>
      </div>

      {/* Buyer Details */}
      <div className="border-2 border-black p-4 mb-6" style={{ border: '2px solid #000' }}>
        <h2 className="font-bold mb-2" style={{ fontSize: '16px', fontWeight: 'bold' }}>
          BILL TO:
        </h2>
        <p className="font-semibold" style={{ fontSize: '14px', fontWeight: '600' }}>{buyerName}</p>
        <p className="text-sm" style={{ fontSize: '13px' }}>{buyerAddress}</p>
        {buyerGstin !== 'N/A' && (
          <p className="text-sm mt-1" style={{ fontSize: '13px' }}>
            GSTIN: {buyerGstin}
          </p>
        )}
      </div>

      {/* Items Table */}
      <table className="w-full border-2 border-black mb-6" style={{ width: '100%', border: '2px solid #000', borderCollapse: 'collapse' }}>
        <thead>
          <tr className="bg-gray-200" style={{ backgroundColor: '#e5e7eb' }}>
            <th className="border border-black p-2 text-left" style={{ border: '1px solid #000', padding: '8px', textAlign: 'left', fontWeight: 'bold', fontSize: '14px' }}>
              Item Description
            </th>
            <th className="border border-black p-2 text-center" style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>
              HSN
            </th>
            <th className="border border-black p-2 text-center" style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>
              Qty
            </th>
            <th className="border border-black p-2 text-right" style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>
              Rate (₹)
            </th>
            <th className="border border-black p-2 text-right" style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>
              Amount (₹)
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="border border-black p-2" style={{ border: '1px solid #000', padding: '8px', fontSize: '14px' }}>
                {item.name}
              </td>
              <td className="border border-black p-2 text-center" style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '14px' }}>
                {item.hsn}
              </td>
              <td className="border border-black p-2 text-center" style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontSize: '14px' }}>
                {item.qty}
              </td>
              <td className="border border-black p-2 text-right" style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', fontSize: '14px' }}>
                {item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
              <td className="border border-black p-2 text-right font-semibold" style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', fontSize: '14px', fontWeight: '600' }}>
                {item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tax Breakdown */}
      <div className="flex justify-end mb-6">
        <div className="w-80 border-2 border-black" style={{ width: '320px', border: '2px solid #000' }}>
          <div className="flex justify-between p-2 border-b border-black" style={{ borderBottom: '1px solid #000', padding: '8px' }}>
            <span style={{ fontSize: '14px' }}>Subtotal:</span>
            <span className="font-semibold" style={{ fontSize: '14px', fontWeight: '600' }}>
              ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {cgst > 0 && (
            <div className="flex justify-between p-2 border-b border-black" style={{ borderBottom: '1px solid #000', padding: '8px' }}>
              <span style={{ fontSize: '14px' }}>CGST (9%):</span>
              <span className="font-semibold" style={{ fontSize: '14px', fontWeight: '600' }}>
                ₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {sgst > 0 && (
            <div className="flex justify-between p-2 border-b border-black" style={{ borderBottom: '1px solid #000', padding: '8px' }}>
              <span style={{ fontSize: '14px' }}>SGST (9%):</span>
              <span className="font-semibold" style={{ fontSize: '14px', fontWeight: '600' }}>
                ₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {igst > 0 && (
            <div className="flex justify-between p-2 border-b border-black" style={{ borderBottom: '1px solid #000', padding: '8px' }}>
              <span style={{ fontSize: '14px' }}>IGST (18%):</span>
              <span className="font-semibold" style={{ fontSize: '14px', fontWeight: '600' }}>
                ₹{igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          <div className="flex justify-between p-3 bg-gray-200 font-bold" style={{ backgroundColor: '#e5e7eb', padding: '12px', fontWeight: 'bold' }}>
            <span style={{ fontSize: '16px' }}>TOTAL AMOUNT:</span>
            <span style={{ fontSize: '16px' }}>
              ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-black pt-4 mt-8" style={{ borderTop: '2px solid #000', paddingTop: '16px', marginTop: '32px' }}>
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-bold mb-1" style={{ fontSize: '13px', fontWeight: 'bold' }}>
              Terms & Conditions:
            </p>
            <p className="text-xs" style={{ fontSize: '11px' }}>
              Payment due within 30 days. E. & O.E.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold" style={{ fontSize: '13px', fontWeight: 'bold' }}>
              Authorized Signatory
            </p>
            <div className="mt-8 border-t border-black w-48" style={{ marginTop: '32px', borderTop: '1px solid #000', width: '192px' }}>
              <p className="text-xs text-center mt-1" style={{ fontSize: '11px', textAlign: 'center', marginTop: '4px' }}>
                {sellerName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="text-center mt-6 text-xs" style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px' }}>
        <p>This is a computer-generated invoice</p>
      </div>
    </div>
  );
}
