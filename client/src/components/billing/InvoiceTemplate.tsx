
import { Separator } from "@/components/ui/separator";

interface InvoiceTemplateProps {
  invoice: any; 
  id?: string;
}

export function InvoiceTemplate({ invoice, id }: InvoiceTemplateProps) {
  if (!invoice) return null;

  return (
    <div id={id} className="bg-white text-slate-900 p-12 w-[800px] min-h-[1100px] relative font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div>
          <div className="flex items-center gap-3 mb-6">
             <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-xl">A</span>
             </div>
             <span className="text-2xl font-bold tracking-tight text-slate-900">Acme Inc.</span>
          </div>
          <div className="text-sm text-slate-500 leading-relaxed">
            123 Business Street<br />
            San Francisco, CA 94103<br />
            United States
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-light text-slate-900 mb-2 tracking-wide">INVOICE</h1>
          <div className="text-base text-slate-500 font-medium">#{invoice.id.toUpperCase()}</div>
        </div>
      </div>

      {/* Bill To / Dates */}
      <div className="flex justify-between mb-16">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Bill To</h3>
          <div className="text-base font-bold text-slate-900 mb-1">Acme Corp Customer</div>
          <div className="text-sm text-slate-500 leading-relaxed">
            456 Client Road<br />
            New York, NY 10001<br />
            billing@acmecorp.com
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="flex justify-end gap-8">
            <span className="text-sm text-slate-500 w-24">Date Issued:</span>
            <span className="text-sm font-semibold text-slate-900">{new Date(invoice.date).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-end gap-8">
            <span className="text-sm text-slate-500 w-24">Due Date:</span>
            <span className="text-sm font-semibold text-slate-900">{new Date(invoice.date).toLocaleDateString()}</span>
          </div>
           <div className="flex justify-end gap-8">
            <span className="text-sm text-slate-500 w-24">Status:</span>
            <span className="text-sm font-bold uppercase text-green-600 tracking-wide">{invoice.status}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-12">
        <div className="flex border-b-2 border-slate-900 pb-3 mb-4">
          <div className="w-1/2 text-xs font-bold uppercase tracking-widest text-slate-900">Description</div>
          <div className="w-1/6 text-right text-xs font-bold uppercase tracking-widest text-slate-900">Qty</div>
          <div className="w-1/6 text-right text-xs font-bold uppercase tracking-widest text-slate-900">Price</div>
          <div className="w-1/6 text-right text-xs font-bold uppercase tracking-widest text-slate-900">Amount</div>
        </div>
        
        <div className="flex py-4 border-b border-slate-100 items-start">
           <div className="w-1/2 text-sm pr-4">
             <div className="font-bold text-slate-900">{invoice.description}</div>
             <div className="text-xs text-slate-500 mt-1">Monthly subscription for Pro Plan services.</div>
           </div>
           <div className="w-1/6 text-right text-sm text-slate-600">1</div>
           <div className="w-1/6 text-right text-sm text-slate-600">{invoice.amount}</div>
           <div className="w-1/6 text-right text-sm font-bold text-slate-900">{invoice.amount}</div>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-20">
        <div className="w-5/12 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-semibold text-slate-900">{invoice.amount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Tax (0%)</span>
            <span className="font-semibold text-slate-900">$0.00</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-xl font-bold text-slate-900 pt-1">
            <span>Total</span>
            <span>{invoice.amount}</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-12 left-12 right-12 text-center border-t border-slate-100 pt-8">
        <div className="text-sm font-bold text-slate-900 mb-1">Thank you for your business!</div>
        <div className="text-xs text-slate-400">
          Please contact support@acme.inc for any questions regarding this invoice.
        </div>
      </div>
    </div>
  );
}
