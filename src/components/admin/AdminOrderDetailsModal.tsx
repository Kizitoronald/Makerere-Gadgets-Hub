import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  PhoneCall, 
  MessageSquare, 
  Save,
  Clock
} from 'lucide-react';
import { Order, OrderStatus, BusinessSettings } from '../../types';
import { formatUGX } from '../../utils/currency';
import { generateWhatsAppChatUrl } from '../../utils/whatsapp';

interface AdminOrderDetailsModalProps {
  order: Order | null;
  settings: BusinessSettings;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, note?: string) => void;
}

export const AdminOrderDetailsModal: React.FC<AdminOrderDetailsModalProps> = ({
  order,
  settings,
  onClose,
  onUpdateStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order?.status || 'pending');
  const [statusNote, setStatusNote] = useState('');

  if (!order) return null;

  const handleStatusChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(order.id, selectedStatus, statusNote.trim() || undefined);
    setStatusNote('');
  };

  const customerWhatsAppUrl = generateWhatsAppChatUrl(
    order.customer.whatsapp || order.customer.phone,
    `Hello ${order.customer.name}, this is Makerere Gadgets Hub regarding your order ${order.orderNumber}. It is currently ${selectedStatus.replace(/_/g, ' ')}.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base text-slate-900">
                Order {order.orderNumber}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                order.status === 'out_for_delivery' ? 'bg-sky-100 text-sky-800' :
                order.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString('en-UG')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Customer Details & Contact Actions */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Customer & Destination</h4>
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div>Name: <span className="font-semibold text-slate-900">{order.customer.name}</span></div>
              <div>Phone: <span className="font-semibold text-slate-900">{order.customer.phone}</span></div>
              <div className="col-span-2 flex items-start gap-1 text-slate-900">
                <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                <span>
                  <strong>{order.deliveryDetails.locationName}</strong>
                  {order.deliveryDetails.roomOrBlock && ` — ${order.deliveryDetails.roomOrBlock}`}
                </span>
              </div>
              {order.deliveryDetails.landmark && (
                <div className="col-span-2 text-slate-500">
                  Landmark: {order.deliveryDetails.landmark}
                </div>
              )}
              {order.deliveryDetails.instructions && (
                <div className="col-span-2 text-slate-500">
                  Instructions: {order.deliveryDetails.instructions}
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href={`tel:${order.customer.phone.replace(/\s+/g, '')}`}
                className="py-1.5 px-3 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
                <span>Call Customer</span>
              </a>
              <a
                href={customerWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Ordered Products Breakdown */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">Order Line Items</h4>
            <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between bg-white">
                  <div>
                    <span className="font-bold text-slate-900">{item.quantity} × {item.name}</span>
                    <span className="text-slate-400 block text-[11px]">Unit: {formatUGX(item.price)}</span>
                  </div>
                  <span className="font-bold tabular-nums text-slate-900">
                    {formatUGX(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="p-3 bg-slate-50 flex justify-between text-slate-600">
                <span>Campus Delivery Fee:</span>
                <span className="font-semibold text-emerald-600">
                  {order.deliveryFee === 0 ? 'FREE' : formatUGX(order.deliveryFee)}
                </span>
              </div>
              <div className="p-3 bg-slate-900 text-white flex justify-between font-bold text-sm">
                <span>Total Amount:</span>
                <span className="text-sky-400 tabular-nums">{formatUGX(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Update Status Form */}
          <form onSubmit={handleStatusChangeSubmit} className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-3">
            <h4 className="font-bold text-sky-950 uppercase tracking-wider text-[11px]">
              Update Order Status
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-sky-900 mb-1">
                  Change Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="w-full p-2 text-xs rounded-lg border border-sky-300 bg-white font-semibold text-slate-800"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing (Packing)</option>
                  <option value="ready">Ready for Dispatch</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered & Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-sky-900 mb-1">
                  Status Note / Dispatcher Update
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rider Brian assigned on boda"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-sky-300 bg-white text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Status Update</span>
            </button>
          </form>

          {/* Status Timeline History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">Status Audit Trail</h4>
              <div className="space-y-2 border-l-2 border-slate-200 ml-2 pl-3 text-xs">
                {order.statusHistory.map((h, i) => (
                  <div key={i} className="text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 capitalize">{h.status.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {h.note && <div className="text-[11px] text-slate-500 mt-0.5">{h.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
