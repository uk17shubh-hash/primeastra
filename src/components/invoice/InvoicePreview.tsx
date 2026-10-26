import React from 'react';
import { InvoiceData, InvoiceTemplate } from '../../types/invoice';
import { numberToWordsIndian } from '../../utils/numberToWords';

interface InvoicePreviewProps {
  data: InvoiceData;
  template: InvoiceTemplate;
  previewRef: React.RefObject<HTMLDivElement | null>;
  showQrCode?: boolean;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  data,
  template,
  previewRef,
  showQrCode = true,
}) => {
  // Calculations
  const itemsCalculations = data.items.map((item, idx) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const discount = Number(item.discountPercent) || 0;
    const rawTotal = qty * rate;
    const discountedTotal = rawTotal - (rawTotal * discount) / 100;
    const taxRate = Number(item.taxRatePercent) || 0;
    return {
      index: idx + 1,
      item,
      qty,
      rate,
      discountedTotal,
      taxRate,
      taxAmount: (discountedTotal * taxRate) / 100,
    };
  });

  const subtotal = itemsCalculations.reduce((acc, curr) => acc + curr.discountedTotal, 0);
  const totalQty = itemsCalculations.reduce((acc, curr) => acc + curr.qty, 0);

  // Group by HSN for Tax summary table
  const hsnMap: { [hsn: string]: { taxable: number; taxRate: number; taxAmount: number } } = {};
  itemsCalculations.forEach((item) => {
    const hsnKey = item.item.hsn || 'General';
    if (!hsnMap[hsnKey]) {
      hsnMap[hsnKey] = { taxable: 0, taxRate: item.taxRate, taxAmount: 0 };
    }
    hsnMap[hsnKey].taxable += item.discountedTotal;
    hsnMap[hsnKey].taxAmount += item.taxAmount;
  });

  const totalTaxAmount = Object.values(hsnMap).reduce((sum, h) => sum + h.taxAmount, 0);
  const roundOff = Number(data.roundOff) || 0;
  const grandTotal = Math.round((subtotal + totalTaxAmount + roundOff) * 100) / 100;

  const grandTotalWords = numberToWordsIndian(grandTotal, data.currencyCode);
  const taxTotalWords = numberToWordsIndian(totalTaxAmount, data.currencyCode);

  // Format currency helper
  const fmt = (num: number) => {
    return (num || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // UPI QR Code URL (Generates real instant scan-to-pay QR)
  const upiPayUrl = data.bank.upiId
    ? `upi://pay?pa=${encodeURIComponent(data.bank.upiId)}&pn=${encodeURIComponent(
        data.seller.name
      )}&am=${grandTotal}&cu=${data.currencyCode}&tn=Invoice%20${encodeURIComponent(
        data.invoiceNo
      )}`
    : '';
  const qrCodeImage = upiPayUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(
        upiPayUrl
      )}`
    : null;

  // 1. OFFICIAL GST / TAX INVOICE FORMAT (Identical structure to user's uploaded PDF)
  if (template === 'gst_official') {
    return (
      <div className="w-full overflow-x-auto flex justify-center py-2">
        <div
          ref={previewRef}
          id="invoicePrintArea"
          className="bg-white text-black text-[11px] leading-tight font-sans shadow-2xl border border-black max-w-[800px] w-full p-4 sm:p-6"
          style={{ minHeight: '1050px', boxSizing: 'border-box' }}
        >
          {/* Top Title & Copy Type */}
          <div className="relative text-center border-b border-black pb-2 mb-2">
            <h1 className="text-base sm:text-lg font-bold uppercase tracking-wider text-black">
              {data.invoiceTitle || 'Tax Invoice'}
            </h1>
            <span className="text-[10px] sm:text-[11px] font-semibold text-black absolute right-0 top-1">
              {data.copyType || '(ORIGINAL FOR RECIPIENT)'}
            </span>
          </div>

          {/* Master 2-Column Header Table */}
          <div className="border border-black grid grid-cols-12 text-[10.5px]">
            {/* Left Column: Supplier, Consignee, Buyer */}
            <div className="col-span-6 border-r border-black p-2 flex flex-col justify-between space-y-2">
              {/* Seller */}
              <div className="border-b border-black/30 pb-1.5">
                <div className="font-extrabold text-[12px] uppercase text-black">
                  {data.seller.name || 'COMPANY NAME'}
                </div>
                <div className="text-[10px] text-gray-800 leading-snug whitespace-pre-line mt-0.5">
                  {data.seller.address}
                </div>
                <div className="mt-1 font-semibold">
                  <span>GSTIN/UIN : </span>
                  <span className="font-extrabold">{data.seller.gstin || 'N/A'}</span>
                </div>
                <div className="text-[10px] text-gray-800">
                  State Name : <span className="font-semibold">{data.seller.state}</span>, Code :{' '}
                  <span className="font-semibold">{data.seller.stateCode}</span>
                </div>
                {data.seller.email && (
                  <div className="text-[10px] text-gray-800">E-Mail : {data.seller.email}</div>
                )}
              </div>

              {/* Consignee (Ship to) */}
              <div className="border-b border-black/30 pb-1.5 pt-0.5">
                <div className="text-[9.5px] font-bold text-gray-700">Consignee (Ship to) :</div>
                <div className="font-bold uppercase text-[11px]">{data.consignee.name || 'N/A'}</div>
                <div className="text-[10px] text-gray-800 leading-snug whitespace-pre-line">
                  {data.consignee.address}
                </div>
                <div className="mt-0.5 font-semibold">
                  GSTIN/UIN :{' '}
                  <span className="font-extrabold">{data.consignee.gstin || 'Unregistered'}</span>
                </div>
                <div className="text-[10px] text-gray-800">
                  State Name : <span className="font-semibold">{data.consignee.state}</span>, Code :{' '}
                  <span className="font-semibold">{data.consignee.stateCode}</span>
                </div>
              </div>

              {/* Buyer (Bill to) */}
              <div className="pt-0.5">
                <div className="text-[9.5px] font-bold text-gray-700">Buyer (Bill to) :</div>
                <div className="font-bold uppercase text-[11px]">{data.buyer.name || 'N/A'}</div>
                <div className="text-[10px] text-gray-800 leading-snug whitespace-pre-line">
                  {data.buyer.address}
                </div>
                <div className="mt-0.5 font-semibold">
                  GSTIN/UIN :{' '}
                  <span className="font-extrabold">{data.buyer.gstin || 'Unregistered'}</span>
                </div>
                <div className="text-[10px] text-gray-800">
                  State Name : <span className="font-semibold">{data.buyer.state}</span>, Code :{' '}
                  <span className="font-semibold">{data.buyer.stateCode}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Invoice & Transport Meta Grid */}
            <div className="col-span-6 grid grid-cols-2 text-[10px]">
              <div className="border-r border-b border-black/40 p-1.5">
                <div className="text-[9px] text-gray-600">Invoice No.</div>
                <div className="font-extrabold text-[11px]">{data.invoiceNo}</div>
              </div>
              <div className="border-b border-black/40 p-1.5">
                <div className="text-[9px] text-gray-600">Dated</div>
                <div className="font-extrabold">{data.invoiceDate}</div>
              </div>

              <div className="border-r border-b border-black/40 p-1.5">
                <div className="text-[9px] text-gray-600">Delivery Note</div>
                <div className="font-semibold">{data.transport.deliveryNote || '-'}</div>
              </div>
              <div className="border-b border-black/40 p-1.5">
                <div className="text-[9px] text-gray-600">Mode/Terms of Payment</div>
                <div className="font-semibold">{data.transport.modeOfPayment || 'Net Banking'}</div>
              </div>

              <div className="border-r border-b border-black/40 p-1.5">
                <div className="text-[9px] text-gray-600">Buyer's Order No.</div>
                <div className="font-semibold">{data.transport.buyerOrderNo || '-'}</div>
              </div>
              <div className="border-b border-black/40 p-1.5">
                <div className="text-[9px] text-gray-600">Dated</div>
                <div className="font-semibold">{data.transport.buyerOrderDate || '-'}</div>
              </div>

              <div className="border-r border-b border-black/40 p-1.5">
                <div className="text-[9px] text-gray-600">Dispatch Doc No.</div>
                <div className="font-semibold">{data.transport.dispatchDocNo || data.invoiceNo}</div>
              </div>
              <div className="border-b border-black/40 p-1.5">
                <div className="text-[9px] text-gray-600">Delivery Note Date</div>
                <div className="font-semibold">{data.transport.deliveryNoteDate || data.invoiceDate}</div>
              </div>

              <div className="border-r border-b border-black/40 p-1.5">
                <div className="text-[9px] text-gray-600">Dispatched through</div>
                <div className="font-semibold">{data.transport.dispatchedThrough || 'By Road'}</div>
              </div>
              <div className="border-b border-black/40 p-1.5">
                <div className="text-[9px] text-gray-600">Destination</div>
                <div className="font-semibold">{data.transport.destination || data.buyer.state}</div>
              </div>

              <div className="border-r border-b border-black/40 p-1.5">
                <div className="text-[9px] text-gray-600">Bill of Lading/LR-RR No.</div>
                <div className="font-semibold">{data.transport.billOfLadingNo || `dt. ${data.invoiceDate}`}</div>
              </div>
              <div className="border-b border-black/40 p-1.5">
                <div className="text-[9px] text-gray-600">Motor Vehicle No.</div>
                <div className="font-semibold">{data.transport.vehicleNo || '-'}</div>
              </div>

              <div className="col-span-2 p-1.5">
                <div className="text-[9px] text-gray-600">Terms of Delivery</div>
                <div className="font-semibold">{data.transport.termsOfDelivery || 'Standard Delivery'}</div>
              </div>
            </div>
          </div>

          {/* Master Goods / Items Table */}
          <div className="border-x border-b border-black mt-[-1px]">
            <table className="w-full text-left border-collapse text-[10.5px]">
              <thead>
                <tr className="border-b border-black bg-gray-50 text-[10px] font-bold">
                  <th className="border-r border-black p-1.5 text-center w-8">Sl No.</th>
                  <th className="border-r border-black p-1.5">Description of Goods</th>
                  <th className="border-r border-black p-1.5 text-center w-20">HSN/SAC</th>
                  <th className="border-r border-black p-1.5 text-right w-16">Quantity</th>
                  <th className="border-r border-black p-1.5 text-right w-16">Rate</th>
                  <th className="border-r border-black p-1.5 text-center w-12">per</th>
                  <th className="p-1.5 text-right w-24">Amount</th>
                </tr>
              </thead>
              <tbody>
                {itemsCalculations.map((c) => (
                  <tr key={c.item.id} className="align-top border-b border-gray-200">
                    <td className="border-r border-black p-1.5 text-center font-semibold">{c.index}</td>
                    <td className="border-r border-black p-1.5 font-bold uppercase">{c.item.description}</td>
                    <td className="border-r border-black p-1.5 text-center font-mono">{c.item.hsn || '-'}</td>
                    <td className="border-r border-black p-1.5 text-right font-extrabold">{c.qty}</td>
                    <td className="border-r border-black p-1.5 text-right">{fmt(c.rate)}</td>
                    <td className="border-r border-black p-1.5 text-center">{c.item.unit || 'pcs'}</td>
                    <td className="p-1.5 text-right font-extrabold">{fmt(c.discountedTotal)}</td>
                  </tr>
                ))}

                {/* Subtotal row */}
                <tr className="border-t border-black font-bold">
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black p-1 text-right text-gray-600 text-[10px]">
                    Sub Total (Taxable):
                  </td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="border-r border-black"></td>
                  <td className="p-1.5 text-right font-black">{fmt(subtotal)}</td>
                </tr>

                {/* Taxes Breakdown rows */}
                {data.taxMode === 'cgst_sgst' && (
                  <>
                    <tr className="text-[10px]">
                      <td className="border-r border-black"></td>
                      <td className="border-r border-black p-1 font-bold text-gray-800">
                        CGST OUTPUT (avg 2.5% - 9%)
                      </td>
                      <td className="border-r border-black"></td>
                      <td className="border-r border-black"></td>
                      <td className="border-r border-black"></td>
                      <td className="border-r border-black p-1 text-center text-gray-600">
                        {(totalTaxAmount / 2 / (subtotal || 1) * 100).toFixed(2)} %
                      </td>
                      <td className="p-1 text-right font-semibold">{fmt(totalTaxAmount / 2)}</td>
                    </tr>
                    <tr className="text-[10px]">
                      <td className="border-r border-black"></td>
                      <td className="border-r border-black p-1 font-bold text-gray-800">
                        SGST OUTPUT (avg 2.5% - 9%)
                      </td>
                      <td className="border-r border-black"></td>
                      <td className="border-r border-black"></td>
                      <td className="border-r border-black"></td>
                      <td className="border-r border-black p-1 text-center text-gray-600">
                        {(totalTaxAmount / 2 / (subtotal || 1) * 100).toFixed(2)} %
                      </td>
                      <td className="p-1 text-right font-semibold">{fmt(totalTaxAmount / 2)}</td>
                    </tr>
                  </>
                )}

                {data.taxMode === 'igst' && (
                  <tr className="text-[10px]">
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black p-1 font-bold text-gray-800">IGST OUTPUT</td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black p-1 text-center text-gray-600">
                      {(totalTaxAmount / (subtotal || 1) * 100).toFixed(2)} %
                    </td>
                    <td className="p-1 text-right font-semibold">{fmt(totalTaxAmount)}</td>
                  </tr>
                )}

                {/* Round Off row */}
                {roundOff !== 0 && (
                  <tr className="text-[10px]">
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black p-1 text-gray-700">Round Off</td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="border-r border-black"></td>
                    <td className="p-1 text-right">{fmt(roundOff)}</td>
                  </tr>
                )}

                {/* Master Total Row */}
                <tr className="border-t-2 border-black font-extrabold bg-gray-100 text-[11px]">
                  <td className="border-r border-black p-1.5 text-center">Total</td>
                  <td className="border-r border-black p-1.5"></td>
                  <td className="border-r border-black p-1.5"></td>
                  <td className="border-r border-black p-1.5 text-right">
                    {totalQty} {itemsCalculations[0]?.item.unit || 'pcs.'}
                  </td>
                  <td className="border-r border-black p-1.5"></td>
                  <td className="border-r border-black p-1.5"></td>
                  <td className="p-1.5 text-right text-[12px] font-black">
                    {data.currencySymbol} {fmt(grandTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount Chargeable in words */}
          <div className="border-x border-b border-black p-2 flex justify-between items-center text-[10.5px]">
            <div>
              <span className="text-[9.5px] text-gray-600 block">Amount Chargeable (in words)</span>
              <span className="font-extrabold text-[11px] text-black">{grandTotalWords}</span>
            </div>
            <span className="font-bold text-gray-600 text-[10px]">E &amp; O.E</span>
          </div>

          {/* HSN/SAC Tax Breakdown Table (From user's PDF) */}
          <div className="border-x border-b border-black mt-[-1px]">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-black bg-gray-50 font-bold text-center">
                  <th rowSpan={2} className="border-r border-black p-1 w-24">
                    HSN/SAC
                  </th>
                  <th rowSpan={2} className="border-r border-black p-1 w-28">
                    Taxable Value
                  </th>
                  {data.taxMode === 'cgst_sgst' ? (
                    <>
                      <th colSpan={2} className="border-r border-black p-1">
                        Central Tax
                      </th>
                      <th colSpan={2} className="border-r border-black p-1">
                        State Tax
                      </th>
                    </>
                  ) : (
                    <th colSpan={2} className="border-r border-black p-1">
                      Integrated Tax
                    </th>
                  )}
                  <th rowSpan={2} className="p-1 w-28">
                    Total Tax Amount
                  </th>
                </tr>
                <tr className="border-b border-black bg-gray-50 text-[9px] text-center">
                  {data.taxMode === 'cgst_sgst' ? (
                    <>
                      <th className="border-r border-black p-0.5">Rate</th>
                      <th className="border-r border-black p-0.5">Amount</th>
                      <th className="border-r border-black p-0.5">Rate</th>
                      <th className="border-r border-black p-0.5">Amount</th>
                    </>
                  ) : (
                    <>
                      <th className="border-r border-black p-0.5">Rate</th>
                      <th className="border-r border-black p-0.5">Amount</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {Object.entries(hsnMap).map(([hsn, stat]) => {
                  const halfTaxRate = (stat.taxRate / 2).toFixed(2);
                  const halfTaxAmount = stat.taxAmount / 2;
                  return (
                    <tr key={hsn} className="border-b border-gray-200 text-center font-medium">
                      <td className="border-r border-black p-1 font-mono">{hsn}</td>
                      <td className="border-r border-black p-1 text-right font-semibold">
                        {fmt(stat.taxable)}
                      </td>
                      {data.taxMode === 'cgst_sgst' ? (
                        <>
                          <td className="border-r border-black p-1">{halfTaxRate} %</td>
                          <td className="border-r border-black p-1 text-right font-semibold">
                            {fmt(halfTaxAmount)}
                          </td>
                          <td className="border-r border-black p-1">{halfTaxRate} %</td>
                          <td className="border-r border-black p-1 text-right font-semibold">
                            {fmt(halfTaxAmount)}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border-r border-black p-1">{stat.taxRate.toFixed(2)} %</td>
                          <td className="border-r border-black p-1 text-right font-semibold">
                            {fmt(stat.taxAmount)}
                          </td>
                        </>
                      )}
                      <td className="p-1 text-right font-extrabold">{fmt(stat.taxAmount)}</td>
                    </tr>
                  );
                })}

                <tr className="font-bold bg-gray-100 text-center border-t border-black">
                  <td className="border-r border-black p-1 text-center">Total</td>
                  <td className="border-r border-black p-1 text-right font-extrabold">{fmt(subtotal)}</td>
                  {data.taxMode === 'cgst_sgst' ? (
                    <>
                      <td className="border-r border-black p-1"></td>
                      <td className="border-r border-black p-1 text-right font-bold">
                        {fmt(totalTaxAmount / 2)}
                      </td>
                      <td className="border-r border-black p-1"></td>
                      <td className="border-r border-black p-1 text-right font-bold">
                        {fmt(totalTaxAmount / 2)}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border-r border-black p-1"></td>
                      <td className="border-r border-black p-1 text-right font-bold">
                        {fmt(totalTaxAmount)}
                      </td>
                    </>
                  )}
                  <td className="p-1 text-right font-extrabold">{fmt(totalTaxAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Amount in words */}
          <div className="border-x border-b border-black p-2 text-[10.5px]">
            <span className="text-[9.5px] text-gray-600">Tax Amount (in words) : </span>
            <span className="font-bold">{taxTotalWords}</span>
          </div>

          {/* Bottom Bank Details, UPI QR, Declaration and Signatory */}
          <div className="border-x border-b border-black grid grid-cols-12 text-[10.5px]">
            {/* Left Box: Bank Details & UPI QR */}
            <div className="col-span-7 border-r border-black p-2.5 flex justify-between items-start">
              <div className="space-y-0.5">
                <div className="font-extrabold text-[11px] underline mb-1">Company's Bank Details</div>
                <div>
                  <span className="text-gray-600">A/c Holder's Name : </span>
                  <span className="font-bold">{data.bank.accountHolder}</span>
                </div>
                <div>
                  <span className="text-gray-600">Bank Name : </span>
                  <span className="font-bold">{data.bank.bankName}</span>
                </div>
                <div>
                  <span className="text-gray-600">A/c No. : </span>
                  <span className="font-extrabold font-mono text-[11px]">{data.bank.accountNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600">Branch &amp; IFS Code : </span>
                  <span className="font-bold">
                    {data.bank.branch} &amp; {data.bank.ifscCode}
                  </span>
                </div>
                {data.bank.upiId && (
                  <div>
                    <span className="text-gray-600">UPI ID : </span>
                    <span className="font-bold text-amber-700">{data.bank.upiId}</span>
                  </div>
                )}
              </div>

              {showQrCode && qrCodeImage && (
                <div className="text-center p-1 bg-white border border-gray-300 rounded shadow-xs ml-2 shrink-0">
                  <img
                    src={qrCodeImage}
                    alt="UPI Payment QR"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain mx-auto"
                  />
                  <span className="text-[8px] font-bold text-gray-600 block mt-0.5">Scan to Pay UPI</span>
                </div>
              )}
            </div>

            {/* Right Box: Signatory */}
            <div className="col-span-5 p-2.5 flex flex-col justify-between text-right">
              <div>
                <span className="text-[10px] text-gray-600">for </span>
                <span className="font-extrabold uppercase text-[11px]">{data.seller.name}</span>
              </div>
              <div className="h-12 flex items-center justify-end">
                {data.signatureImage ? (
                  <img
                    src={data.signatureImage}
                    alt="Signature"
                    className="max-h-12 object-contain"
                  />
                ) : (
                  <span className="text-[9px] text-gray-400 italic">Signature / Digital Seal</span>
                )}
              </div>
              <div className="font-bold text-[10.5px] border-t border-black/30 pt-1">
                {data.signatoryTitle || 'Authorised Signatory'}
              </div>
            </div>
          </div>

          {/* Declaration Section */}
          <div className="border-x border-b border-black p-2 text-[9.5px] text-gray-700">
            <span className="font-bold underline block mb-0.5">Declaration :</span>
            <p className="leading-snug">{data.declaration}</p>
          </div>

          {/* Footer Computer Generated Notice */}
          <div className="text-center text-[9px] text-gray-500 font-medium pt-2">
            This is a Computer Generated Invoice • Powered by PrimeAstra Pro Workspace
          </div>
        </div>
      </div>
    );
  }

  // 2. MODERN GOLD / EXECUTIVE THEME
  if (template === 'modern_gold') {
    return (
      <div className="w-full overflow-x-auto flex justify-center py-2">
        <div
          ref={previewRef}
          id="invoicePrintArea"
          className="bg-[#0f0f14] text-white text-[11px] leading-relaxed font-sans shadow-2xl border border-[rgba(226,192,114,0.3)] max-w-[800px] w-full p-6 sm:p-8 rounded-2xl relative overflow-hidden"
          style={{ minHeight: '1050px', boxSizing: 'border-box' }}
        >
          {/* Header Banner */}
          <div className="flex items-start justify-between pb-6 border-b border-[rgba(226,192,114,0.25)]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e2c072]"></span>
                <span className="text-[10px] uppercase font-black tracking-widest text-[#e2c072]">
                  {data.copyType}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {data.seller.name || 'COMPANY NAME'}
              </h2>
              <p className="text-[10px] text-slate-400 max-w-sm">{data.seller.address}</p>
              <p className="text-[10.5px] text-[#e2c072] font-mono mt-1">
                GSTIN: <span className="font-bold">{data.seller.gstin}</span> • State:{' '}
                {data.seller.state} ({data.seller.stateCode})
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="px-3 py-1 bg-[rgba(226,192,114,0.15)] text-[#e2c072] border border-[rgba(226,192,114,0.3)] text-xs font-black rounded-lg">
                TAX INVOICE
              </span>
              <div className="pt-2 font-mono text-sm font-extrabold text-white">{data.invoiceNo}</div>
              <div className="text-[10.5px] text-slate-400">Date: {data.invoiceDate}</div>
              {data.dueDate && (
                <div className="text-[10px] text-amber-400 font-semibold">Due: {data.dueDate}</div>
              )}
            </div>
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-[rgba(226,192,114,0.2)]">
            <div className="p-3 bg-[#181820] rounded-xl border border-[rgba(226,192,114,0.15)] space-y-1">
              <span className="text-[9.5px] uppercase font-bold text-[#e2c072]">Billed To:</span>
              <div className="font-extrabold text-white text-xs">{data.buyer.name}</div>
              <div className="text-[10px] text-slate-400">{data.buyer.address}</div>
              <div className="text-[10px] text-slate-300">GSTIN: {data.buyer.gstin || 'N/A'}</div>
            </div>
            <div className="p-3 bg-[#181820] rounded-xl border border-[rgba(226,192,114,0.15)] space-y-1">
              <span className="text-[9.5px] uppercase font-bold text-[#e2c072]">Shipped To:</span>
              <div className="font-extrabold text-white text-xs">{data.consignee.name}</div>
              <div className="text-[10px] text-slate-400">{data.consignee.address}</div>
              <div className="text-[10px] text-slate-300">
                Dispatched Via: {data.transport.dispatchedThrough}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-4">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-[rgba(226,192,114,0.3)] text-[#e2c072] text-[10px] uppercase font-bold pb-2">
                  <th className="py-2">Item &amp; Description</th>
                  <th className="py-2 text-center">HSN</th>
                  <th className="py-2 text-right">Qty</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(226,192,114,0.1)]">
                {itemsCalculations.map((c) => (
                  <tr key={c.item.id} className="py-2.5">
                    <td className="py-2.5 font-bold text-white">{c.item.description}</td>
                    <td className="py-2.5 text-center font-mono text-slate-400">{c.item.hsn}</td>
                    <td className="py-2.5 text-right font-extrabold text-[#e2c072]">
                      {c.qty} {c.item.unit}
                    </td>
                    <td className="py-2.5 text-right text-slate-300">{fmt(c.rate)}</td>
                    <td className="py-2.5 text-right font-bold text-white">{fmt(c.discountedTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-between items-start border-t border-[rgba(226,192,114,0.25)] pt-4">
            <div className="space-y-1 max-w-sm">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Amount in Words:</span>
              <p className="text-[11px] font-extrabold text-[#e2c072]">{grandTotalWords}</p>

              <div className="mt-4 p-3 bg-[#181820] rounded-xl border border-[rgba(226,192,114,0.15)] text-[10px] space-y-0.5">
                <span className="font-bold text-white block">Bank Settlement:</span>
                <span className="text-slate-400">
                  {data.bank.bankName} • A/C: {data.bank.accountNumber} • IFSC: {data.bank.ifscCode}
                </span>
                {data.bank.upiId && (
                  <span className="text-[#e2c072] block font-mono">UPI: {data.bank.upiId}</span>
                )}
              </div>
            </div>

            <div className="w-56 space-y-1.5 text-right text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="text-white font-semibold">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax Output:</span>
                <span className="text-[#e2c072] font-semibold">{fmt(totalTaxAmount)}</span>
              </div>
              {roundOff !== 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Round Off:</span>
                  <span className="text-white font-semibold">{fmt(roundOff)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-extrabold text-[#e2c072] border-t border-[rgba(226,192,114,0.3)] pt-2 mt-2">
                <span>Grand Total:</span>
                <span>
                  {data.currencySymbol} {fmt(grandTotal)}
                </span>
              </div>

              {showQrCode && qrCodeImage && (
                <div className="pt-2 flex justify-end">
                  <div className="p-1.5 bg-white rounded-lg shadow-md">
                    <img src={qrCodeImage} alt="QR" className="w-16 h-16 object-contain" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[rgba(226,192,114,0.15)] flex justify-between items-end text-[9.5px] text-slate-500">
            <div>
              <p className="max-w-md">{data.declaration}</p>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-white block">{data.seller.name}</span>
              <span className="text-[#e2c072] font-semibold">Authorised Signatory</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. CLEAN MINIMALIST THEME
  return (
    <div className="w-full overflow-x-auto flex justify-center py-2">
      <div
        ref={previewRef}
        id="invoicePrintArea"
        className="bg-white text-slate-800 text-[11px] leading-relaxed font-sans shadow-xl border border-slate-200 max-w-[800px] w-full p-6 sm:p-8 rounded-xl"
        style={{ minHeight: '1050px', boxSizing: 'border-box' }}
      >
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{data.seller.name}</h2>
            <p className="text-[10px] text-slate-600 whitespace-pre-line mt-0.5">{data.seller.address}</p>
            <p className="text-[10px] text-slate-700 font-semibold mt-1">GSTIN: {data.seller.gstin}</p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold uppercase tracking-wide text-slate-800">
              {data.invoiceTitle}
            </h3>
            <p className="text-slate-500 font-mono text-xs">{data.invoiceNo}</p>
            <p className="text-slate-600 text-[10px]">Date: {data.invoiceDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 my-4 py-2 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Bill To:</span>
            <p className="font-bold text-slate-900 text-xs">{data.buyer.name}</p>
            <p className="text-[10px] text-slate-600 whitespace-pre-line">{data.buyer.address}</p>
            <p className="text-[10px] text-slate-700">GSTIN: {data.buyer.gstin || 'Unregistered'}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Ship To:</span>
            <p className="font-bold text-slate-900 text-xs">{data.consignee.name}</p>
            <p className="text-[10px] text-slate-600 whitespace-pre-line">{data.consignee.address}</p>
          </div>
        </div>

        <table className="w-full text-left my-4">
          <thead>
            <tr className="border-b-2 border-slate-200 text-slate-600 text-[10px] uppercase font-bold">
              <th className="py-2">Item</th>
              <th className="py-2 text-center">HSN</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Rate</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {itemsCalculations.map((c) => (
              <tr key={c.item.id} className="py-2">
                <td className="py-2 font-semibold text-slate-800">{c.item.description}</td>
                <td className="py-2 text-center text-slate-500 font-mono">{c.item.hsn}</td>
                <td className="py-2 text-right font-bold">
                  {c.qty} {c.item.unit}
                </td>
                <td className="py-2 text-right">{fmt(c.rate)}</td>
                <td className="py-2 text-right font-bold">{fmt(c.discountedTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-start border-t border-slate-200 pt-4">
          <div className="space-y-1 max-w-sm">
            <span className="text-[9.5px] uppercase font-semibold text-slate-500">In Words:</span>
            <p className="font-bold text-slate-800">{grandTotalWords}</p>
            <div className="mt-4 text-[10px] text-slate-600">
              <span className="font-bold block text-slate-800">Bank Details:</span>
              <span>
                {data.bank.bankName} • A/c: {data.bank.accountNumber} • IFSC: {data.bank.ifscCode}
              </span>
            </div>
          </div>
          <div className="w-48 space-y-1 text-right">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-medium">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax:</span>
              <span className="font-medium">{fmt(totalTaxAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-300 pt-2">
              <span>Total:</span>
              <span>
                {data.currencySymbol} {fmt(grandTotal)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[9px] text-slate-400">
          {data.declaration}
        </div>
      </div>
    </div>
  );
};
