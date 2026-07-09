import { Controller } from 'react-hook-form';
import { Pencil } from 'lucide-react';
import { useOverridableAmount } from '../hooks/useOverridableAmount';

const BRAND  = '#2563eb';
const LIGHT  = '#eff6ff';
const BORDER = '#bfdbfe';
const TEXT   = '#0f172a';
const MUTED  = '#64748b';

function sanitizeNumber(raw) {
  return raw.replace(/[^0-9.]/g, '').replace(/^(\d*\.?\d*).*$/, '$1');
}

function EditableRow({ control, name, label, currency, bold }) {
  return (
    <div className="flex justify-between items-center px-4 py-2.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
      <span className={`text-sm font-semibold ${bold ? '' : ''}`} style={{ color: bold ? BRAND : MUTED }}>{label}</span>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <label className="flex items-center gap-1.5 cursor-text">
            <span className="text-sm font-semibold" style={{ color: bold ? BRAND : MUTED }}>{currency}</span>
            <input
              ref={ref}
              type="text"
              inputMode="decimal"
              value={value == null ? '' : String(value)}
              onChange={(e) => onChange(sanitizeNumber(e.target.value))}
              onBlur={onBlur}
              className="font-bold text-sm text-right bg-transparent outline-none border-0 p-0 w-20"
              style={{ color: bold ? BRAND : TEXT }}
            />
            <Pencil size={12} style={{ color: bold ? BRAND : MUTED }} />
          </label>
        )}
      />
    </div>
  );
}

export default function GstSummaryBox({
  control, setValue, subtotal, computedCgst, computedSgst, computedIgst,
  currency, prefix, grandTotalField = 'grandTotal', extraRows = [],
}) {
  useOverridableAmount(control, setValue, `${prefix}.cgst`, computedCgst);
  useOverridableAmount(control, setValue, `${prefix}.sgst`, computedSgst);
  useOverridableAmount(control, setValue, `${prefix}.igst`, computedIgst);

  const extraTotal = extraRows.reduce((s, r) => s + (parseFloat(r.value) || 0), 0);
  const computedGrandTotal = subtotal + computedCgst + computedSgst + computedIgst + extraTotal;
  useOverridableAmount(control, setValue, `${prefix}.${grandTotalField}`, computedGrandTotal);

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
      <div className="flex justify-between items-center px-4 py-2.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <span className="text-sm font-semibold" style={{ color: MUTED }}>Sub Total</span>
        <span className="font-bold text-sm" style={{ color: TEXT }}>{currency} {subtotal.toFixed(2)}</span>
      </div>

      <EditableRow control={control} name={`${prefix}.cgst`} label="CGST" currency={currency} />
      <EditableRow control={control} name={`${prefix}.sgst`} label="SGST" currency={currency} />
      <EditableRow control={control} name={`${prefix}.igst`} label="IGST" currency={currency} />

      {extraRows.map((row) => (
        <div key={row.label} className="flex justify-between items-center px-4 py-2.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <span className="text-sm font-semibold" style={{ color: MUTED }}>{row.label}</span>
          <span className="font-bold text-sm" style={{ color: TEXT }}>{currency} {(parseFloat(row.value) || 0).toFixed(2)}</span>
        </div>
      ))}

      <div style={{ background: LIGHT }}>
        <EditableRow control={control} name={`${prefix}.${grandTotalField}`} label="Grand Total" currency={currency} bold />
      </div>
    </div>
  );
}
