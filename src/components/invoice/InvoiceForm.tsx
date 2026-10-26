import React, { useState } from 'react';
import { InvoiceData, InvoiceItem, TaxMode } from '../../types/invoice';
import {
  Plus,
  Trash2,
  Building2,
  Users,
  Truck,
  PackageOpen,
  Landmark,
  FileText,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (updated: InvoiceData) => void;
  onLoadSample: () => void;
  onResetEmpty: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  data,
  onChange,
  onLoadSample,
  onResetEmpty,
}) => {
  const [openSection, setOpenSection] = useState<string>('items');

  const toggleSection = (sec: string) => {
    setOpenSection(openSection === sec ? '' : sec);
  };

  const handleSellerChange = (field: string, val: string) => {
    onChange({
      ...data,
      seller: { ...data.seller, [field]: val },
    });
  };

  const handleBuyerChange = (field: string, val: string) => {
    const updatedBuyer = { ...data.buyer, [field]: val };
    onChange({
      ...data,
      buyer: updatedBuyer,
      consignee: data.sameAsBuyer ? updatedBuyer : data.consignee,
    });
  };

  const handleConsigneeChange = (field: string, val: string) => {
    onChange({
      ...data,
      consignee: { ...data.consignee, [field]: val },
    });
  };

  const handleTransportChange = (field: string, val: string) => {
    onChange({
      ...data,
      transport: { ...data.transport, [field]: val },
    });
  };

  const handleBankChange = (field: string, val: string) => {
    onChange({
      ...data,
      bank: { ...data.bank, [field]: val },
    });
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    val: string | number
  ) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: val };
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: '',
      hsn: '90211000',
      quantity: 1,
      unit: 'pcs',
      rate: 100,
      discountPercent: 0,
      taxRatePercent: 5,
    };
    onChange({ ...data, items: [...data.items, newItem] });
    setOpenSection('items');
  };

  const removeItem = (index: number) => {
    if (data.items.length <= 1) return;
    const newItems = data.items.filter((_, i) => i !== index);
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Quick Presets & Control Bar */}
      <div className="bg-[#181820] p-3.5 rounded-2xl border border-[rgba(226,192,114,0.25)] space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#e2c072] to-[#c5a059] text-[#070707] font-black rounded-xl text-[11px] shadow-sm hover:brightness-110 transition active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample (FZ Surgical / Skywear)</span>
            </button>
            <button
              type="button"
              onClick={onResetEmpty}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] text-slate-300 hover:text-white rounded-xl text-[11px] transition active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Blank</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold">Tax Mode:</span>
            <select
              value={data.taxMode}
              onChange={(e) => onChange({ ...data, taxMode: e.target.value as TaxMode })}
              className="bg-[#121216] border border-[rgba(226,192,114,0.3)] text-white text-[11px] rounded-lg px-2.5 py-1 focus:outline-none font-bold"
            >
              <option value="cgst_sgst">Intra-State (CGST + SGST)</option>
              <option value="igst">Inter-State (IGST)</option>
              <option value="none">Zero Tax / Exempt</option>
            </select>
          </div>
        </div>

        {/* Global Invoice Settings */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[rgba(226,192,114,0.15)] text-[11px]">
          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">
              Invoice Title
            </label>
            <input
              type="text"
              value={data.invoiceTitle}
              onChange={(e) => onChange({ ...data, invoiceTitle: e.target.value })}
              className="w-full p-2 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">
              Copy Badge
            </label>
            <select
              value={data.copyType}
              onChange={(e) => onChange({ ...data, copyType: e.target.value })}
              className="w-full p-2 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white font-semibold"
            >
              <option value="(ORIGINAL FOR RECIPIENT)">(ORIGINAL FOR RECIPIENT)</option>
              <option value="(DUPLICATE FOR TRANSPORTER)">(DUPLICATE FOR TRANSPORTER)</option>
              <option value="(TRIPLICATE FOR SUPPLIER)">(TRIPLICATE FOR SUPPLIER)</option>
              <option value="(EXTRA COPY)">(EXTRA COPY)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">
              Invoice No. *
            </label>
            <input
              type="text"
              value={data.invoiceNo}
              onChange={(e) => onChange({ ...data, invoiceNo: e.target.value })}
              className="w-full p-2 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white font-mono font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">
              Invoice Date *
            </label>
            <input
              type="date"
              value={data.invoiceDate}
              onChange={(e) => onChange({ ...data, invoiceDate: e.target.value })}
              className="w-full p-2 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white font-bold"
            />
          </div>
        </div>
      </div>

      {/* 1. SELLER / YOUR BUSINESS SECTION */}
      <div className="bg-[#121216] rounded-2xl border border-[rgba(226,192,114,0.15)] overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('seller')}
          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-white hover:bg-[#181820] transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-[#e2c072]" />
            <span>1. Supplier / Seller Details (Your Company)</span>
          </div>
          {openSection === 'seller' ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSection === 'seller' && (
          <div className="p-4 pt-1 border-t border-[rgba(226,192,114,0.1)] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-semibold text-slate-400">
                  Company / Trade Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. F Z SURGICAL (ZAID)"
                  value={data.seller.name}
                  onChange={(e) => handleSellerChange('name', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white font-bold focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-semibold text-slate-400">Address *</label>
                <textarea
                  rows={2}
                  placeholder="Full office/factory address"
                  value={data.seller.address}
                  onChange={(e) => handleSellerChange('address', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">
                  GSTIN / UIN *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 07AEYPZ3220R1ZD"
                  value={data.seller.gstin}
                  onChange={(e) => handleSellerChange('gstin', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white font-mono font-semibold focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400">State *</label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi"
                    value={data.seller.state}
                    onChange={(e) => handleSellerChange('state', e.target.value)}
                    className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400">Code</label>
                  <input
                    type="text"
                    placeholder="07"
                    value={data.seller.stateCode}
                    onChange={(e) => handleSellerChange('stateCode', e.target.value)}
                    className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Email</label>
                <input
                  type="email"
                  placeholder="info@fzsurgical.com"
                  value={data.seller.email || ''}
                  onChange={(e) => handleSellerChange('email', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">PAN No.</label>
                <input
                  type="text"
                  placeholder="AEYPZ3220R"
                  value={data.seller.pan || ''}
                  onChange={(e) => handleSellerChange('pan', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. BUYER & CONSIGNEE SECTION */}
      <div className="bg-[#121216] rounded-2xl border border-[rgba(226,192,114,0.15)] overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('buyer')}
          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-white hover:bg-[#181820] transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-[#e2c072]" />
            <span>2. Buyer (Bill to) &amp; Consignee (Ship to)</span>
          </div>
          {openSection === 'buyer' ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSection === 'buyer' && (
          <div className="p-4 pt-1 border-t border-[rgba(226,192,114,0.1)] space-y-4">
            {/* Buyer */}
            <div className="space-y-2.5">
              <span className="font-extrabold text-white text-xs block text-[#e2c072]">
                Buyer (Bill to) Details:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-semibold text-slate-400">Buyer Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. SKYWEAR"
                    value={data.buyer.name}
                    onChange={(e) => handleBuyerChange('name', e.target.value)}
                    className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white font-bold focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-semibold text-slate-400">Address *</label>
                  <textarea
                    rows={2}
                    placeholder="Buyer billing address"
                    value={data.buyer.address}
                    onChange={(e) => handleBuyerChange('address', e.target.value)}
                    className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400">GSTIN / UIN</label>
                  <input
                    type="text"
                    placeholder="07BZPPV5409J1ZM"
                    value={data.buyer.gstin}
                    onChange={(e) => handleBuyerChange('gstin', e.target.value)}
                    className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white font-mono focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400">State *</label>
                    <input
                      type="text"
                      placeholder="Delhi"
                      value={data.buyer.state}
                      onChange={(e) => handleBuyerChange('state', e.target.value)}
                      className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400">Code</label>
                    <input
                      type="text"
                      placeholder="07"
                      value={data.buyer.stateCode}
                      onChange={(e) => handleBuyerChange('stateCode', e.target.value)}
                      className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Same as buyer checkbox */}
            <div className="pt-2 border-t border-[rgba(226,192,114,0.15)]">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-white">
                <input
                  type="checkbox"
                  checked={data.sameAsBuyer}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      sameAsBuyer: e.target.checked,
                      consignee: e.target.checked ? data.buyer : data.consignee,
                    })
                  }
                  className="rounded text-[#e2c072] accent-[#e2c072]"
                />
                <span>Consignee (Ship to) is same as Buyer (Bill to)</span>
              </label>
            </div>

            {/* Consignee if different */}
            {!data.sameAsBuyer && (
              <div className="space-y-2.5 pt-2">
                <span className="font-extrabold text-white text-xs block text-slate-300">
                  Consignee (Ship to) Details:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-semibold text-slate-400">
                      Consignee Name
                    </label>
                    <input
                      type="text"
                      value={data.consignee.name}
                      onChange={(e) => handleConsigneeChange('name', e.target.value)}
                      className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-semibold text-slate-400">
                      Shipping Address
                    </label>
                    <textarea
                      rows={2}
                      value={data.consignee.address}
                      onChange={(e) => handleConsigneeChange('address', e.target.value)}
                      className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. ITEMS / GOODS SECTION */}
      <div className="bg-[#121216] rounded-2xl border border-[rgba(226,192,114,0.15)] overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('items')}
          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-white hover:bg-[#181820] transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <PackageOpen className="w-4 h-4 text-[#e2c072]" />
            <span>3. Goods &amp; Line Items ({data.items.length})</span>
          </div>
          {openSection === 'items' ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSection === 'items' && (
          <div className="p-4 pt-1 border-t border-[rgba(226,192,114,0.1)] space-y-3">
            {data.items.map((item, index) => {
              const qty = Number(item.quantity) || 0;
              const rate = Number(item.rate) || 0;
              const discount = Number(item.discountPercent) || 0;
              const itemTotal = qty * rate * (1 - discount / 100);

              return (
                <div
                  key={item.id}
                  className="p-3 bg-[#181820] rounded-xl border border-[rgba(226,192,114,0.15)] space-y-2.5 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#e2c072] text-[11px]">
                      Item #{index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-black text-white">
                        {data.currencySymbol}{' '}
                        {itemTotal.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      {data.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-6">
                      <label className="text-[9.5px] font-semibold text-slate-400">
                        Description of Goods *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. BACK REST LONG (U)"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white font-bold"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[9.5px] font-semibold text-slate-400">
                        HSN / SAC Code
                      </label>
                      <input
                        type="text"
                        placeholder="90211000"
                        value={item.hsn}
                        onChange={(e) => handleItemChange(index, 'hsn', e.target.value)}
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white font-mono text-[11px]"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[9.5px] font-semibold text-slate-400">GST Rate %</label>
                      <select
                        value={item.taxRatePercent}
                        onChange={(e) =>
                          handleItemChange(index, 'taxRatePercent', Number(e.target.value))
                        }
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white font-bold"
                      >
                        <option value={0}>0% (Exempt)</option>
                        <option value={5}>5% (2.5% + 2.5%)</option>
                        <option value={12}>12% (6% + 6%)</option>
                        <option value={18}>18% (9% + 9%)</option>
                        <option value={28}>28% (14% + 14%)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[9.5px] font-semibold text-slate-400">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, 'quantity', Number(e.target.value))
                        }
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white font-bold"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[9.5px] font-semibold text-slate-400">Unit (per)</label>
                      <input
                        type="text"
                        placeholder="pcs, nos, kg"
                        value={item.unit}
                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[9.5px] font-semibold text-slate-400">
                        Rate ({data.currencySymbol}) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(index, 'rate', Number(e.target.value))
                        }
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white font-bold"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[9.5px] font-semibold text-slate-400">Discount %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="any"
                        value={item.discountPercent || 0}
                        onChange={(e) =>
                          handleItemChange(index, 'discountPercent', Number(e.target.value))
                        }
                        className="w-full mt-0.5 p-1.5 bg-[#121216] border border-[rgba(226,192,114,0.2)] rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={addItem}
              className="w-full py-2.5 bg-[#181820] hover:bg-[#20202a] border border-dashed border-[rgba(226,192,114,0.3)] text-[#e2c072] font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Item</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. DISPATCH & TRANSPORT SECTION */}
      <div className="bg-[#121216] rounded-2xl border border-[rgba(226,192,114,0.15)] overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('transport')}
          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-white hover:bg-[#181820] transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-[#e2c072]" />
            <span>4. Dispatch, Vehicle &amp; Delivery Terms</span>
          </div>
          {openSection === 'transport' ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSection === 'transport' && (
          <div className="p-4 pt-1 border-t border-[rgba(226,192,114,0.1)] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10px] font-semibold text-slate-400">
                  Mode / Terms of Payment
                </label>
                <input
                  type="text"
                  placeholder="e.g. Net Banking / Credit"
                  value={data.transport.modeOfPayment}
                  onChange={(e) => handleTransportChange('modeOfPayment', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Dispatched Through</label>
                <input
                  type="text"
                  placeholder="By Road / Transport Co."
                  value={data.transport.dispatchedThrough}
                  onChange={(e) => handleTransportChange('dispatchedThrough', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Destination</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi / Warehouse"
                  value={data.transport.destination}
                  onChange={(e) => handleTransportChange('destination', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Dispatch Doc No.</label>
                <input
                  type="text"
                  placeholder="FZ/26-27/105"
                  value={data.transport.dispatchDocNo}
                  onChange={(e) => handleTransportChange('dispatchDocNo', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Bill of Lading / LR-RR No.</label>
                <input
                  type="text"
                  placeholder="dt. 26-Nov-26"
                  value={data.transport.billOfLadingNo}
                  onChange={(e) => handleTransportChange('billOfLadingNo', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Motor Vehicle No.</label>
                <input
                  type="text"
                  placeholder="e.g. DL-01-AB-1234"
                  value={data.transport.vehicleNo}
                  onChange={(e) => handleTransportChange('vehicleNo', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Buyer's Order No.</label>
                <input
                  type="text"
                  placeholder="PO-2026/89"
                  value={data.transport.buyerOrderNo}
                  onChange={(e) => handleTransportChange('buyerOrderNo', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-semibold text-slate-400">Terms of Delivery</label>
                <input
                  type="text"
                  placeholder="e.g. Door Delivery / Ex-Warehouse"
                  value={data.transport.termsOfDelivery}
                  onChange={(e) => handleTransportChange('termsOfDelivery', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. BANK & UPI DETAILS SECTION */}
      <div className="bg-[#121216] rounded-2xl border border-[rgba(226,192,114,0.15)] overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('bank')}
          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-white hover:bg-[#181820] transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Landmark className="w-4 h-4 text-[#e2c072]" />
            <span>5. Company Bank &amp; UPI Details (QR Enabled)</span>
          </div>
          {openSection === 'bank' ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSection === 'bank' && (
          <div className="p-4 pt-1 border-t border-[rgba(226,192,114,0.1)] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-semibold text-slate-400">
                  A/c Holder Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Zaid"
                  value={data.bank.accountHolder}
                  onChange={(e) => handleBankChange('accountHolder', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Bank Name *</label>
                <input
                  type="text"
                  placeholder="e.g. INDIAN OVERSEAS BANK"
                  value={data.bank.bankName}
                  onChange={(e) => handleBankChange('bankName', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Account Number *</label>
                <input
                  type="text"
                  placeholder="279301000012201"
                  value={data.bank.accountNumber}
                  onChange={(e) => handleBankChange('accountNumber', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Branch &amp; IFS Code *</label>
                <input
                  type="text"
                  placeholder="Delhi & IOBA0002793"
                  value={data.bank.ifscCode}
                  onChange={(e) => handleBankChange('ifscCode', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-semibold text-[#e2c072]">
                  UPI ID (Auto-generates instant payment QR code)
                </label>
                <input
                  type="text"
                  placeholder="e.g. zaid@indianbk or mobile@upi"
                  value={data.bank.upiId || ''}
                  onChange={(e) => handleBankChange('upiId', e.target.value)}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.3)] rounded-xl text-[#e2c072] font-mono font-bold"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. DECLARATION, TERMS & SIGNATORY */}
      <div className="bg-[#121216] rounded-2xl border border-[rgba(226,192,114,0.15)] overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('terms')}
          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-white hover:bg-[#181820] transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-[#e2c072]" />
            <span>6. Declaration, Terms &amp; Authorised Signatory</span>
          </div>
          {openSection === 'terms' ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSection === 'terms' && (
          <div className="p-4 pt-1 border-t border-[rgba(226,192,114,0.1)] space-y-3">
            <div>
              <label className="text-[10px] font-semibold text-slate-400">Declaration Text</label>
              <textarea
                rows={2}
                value={data.declaration}
                onChange={(e) => onChange({ ...data, declaration: e.target.value })}
                className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white text-xs"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-semibold text-slate-400">
                  Signatory Designation / Title
                </label>
                <input
                  type="text"
                  value={data.signatoryTitle}
                  onChange={(e) => onChange({ ...data, signatoryTitle: e.target.value })}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">
                  Round Off Adjustment ({data.currencySymbol})
                </label>
                <input
                  type="number"
                  step="any"
                  value={data.roundOff}
                  onChange={(e) => onChange({ ...data, roundOff: Number(e.target.value) })}
                  className="w-full mt-1 p-2 bg-[#181820] border border-[rgba(226,192,114,0.2)] rounded-xl text-white font-bold"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
