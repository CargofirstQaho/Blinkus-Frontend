import { useEffect, useMemo, useRef } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { Calculator, Pencil } from 'lucide-react';
import { Field, Section, inputCls, sanitizeNumber, BRAND, LIGHT, BORDER, TEXT, MUTED } from './FormUI';
import { computeCreditNoteTotals } from '../constants/creditNoteOptions';

function useOverridableAmount(control, setValue, name, computed) {
  const watched = useWatch({ control, name });
  const prevRef = useRef(computed);
  useEffect(() => {
    const current = parseFloat(watched);
    const prev    = prevRef.current;
    if (Number.isNaN(current) || Math.abs(current - prev) < 0.005) {
      setValue(name, Number(computed.toFixed(2)), { shouldValidate: true });
    }
    prevRef.current = computed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computed]);
  return watched;
}

function EditableTaxRow({ control, name, label, currency }) {
  return (
    <div className="flex justify-between items-center px-4 py-2.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
      <span className="text-sm font-semibold" style={{ color: MUTED }}>{label}</span>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <label className="flex items-center gap-1.5 cursor-text">
            <span className="text-sm font-semibold" style={{ color: MUTED }}>{currency}</span>
            <input
              ref={ref}
              type="text"
              inputMode="decimal"
              value={value == null ? '' : String(value)}
              onChange={(e) => onChange(sanitizeNumber(e.target.value))}
              onBlur={onBlur}
              className="font-bold text-sm text-right bg-transparent outline-none border-0 p-0 w-20"
              style={{ color: TEXT }}
            />
            <Pencil size={12} style={{ color: MUTED }} />
          </label>
        )}
      />
    </div>
  );
}

export default function CreditNoteSummary({ control, errors, setValue, orgGstNumber }) {
  const lineItems     = useWatch({ control, name: 'lineItems' });
  const placeOfSupply = useWatch({ control, name: 'creditNoteInfo.placeOfSupply' });
  const currency      = useWatch({ control, name: 'creditNoteInfo.currency' }) || 'INR';
  const creditAmount  = useWatch({ control, name: 'summary.creditAmount' });

  const { subTotal, cgst: cgstComputed, sgst: sgstComputed, igst: igstComputed } = useMemo(
    () => computeCreditNoteTotals(lineItems, placeOfSupply, orgGstNumber),
    [lineItems, placeOfSupply, orgGstNumber]
  );

  const cgst = useOverridableAmount(control, setValue, 'summary.cgst', cgstComputed);
  const sgst = useOverridableAmount(control, setValue, 'summary.sgst', sgstComputed);
  const igst = useOverridableAmount(control, setValue, 'summary.igst', igstComputed);

  const total = subTotal + (parseFloat(cgst) || 0) + (parseFloat(sgst) || 0) + (parseFloat(igst) || 0);

  const prevTotalRef = useRef(total);
  useEffect(() => {
    const current = parseFloat(creditAmount);
    const prev    = prevTotalRef.current;
    if (Number.isNaN(current) || Math.abs(current - prev) < 0.005) {
      setValue('summary.creditAmount', Number(total.toFixed(2)), { shouldValidate: true });
    }
    prevTotalRef.current = total;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return (
    <Section title="Summary" icon={Calculator}>
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="flex justify-between items-center px-4 py-2.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <span className="text-sm font-semibold" style={{ color: MUTED }}>Sub Total</span>
          <span className="font-bold text-sm" style={{ color: TEXT }}>{currency} {subTotal.toFixed(2)}</span>
        </div>

        <EditableTaxRow control={control} name="summary.cgst" label="CGST" currency={currency} />
        <EditableTaxRow control={control} name="summary.sgst" label="SGST" currency={currency} />
        <EditableTaxRow control={control} name="summary.igst" label="IGST" currency={currency} />

        <div className="flex justify-between items-center px-4 py-2.5" style={{ background: LIGHT, borderBottom: `1px solid ${BORDER}` }}>
          <span className="text-sm font-semibold" style={{ color: BRAND }}>Total</span>
          <span className="font-bold text-sm" style={{ color: BRAND }}>{currency} {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 max-w-xs ml-auto">
        <Field label="Credit Amount" required error={errors.summary?.creditAmount?.message}>
          <Controller control={control} name="summary.creditAmount" render={({ field: { value, onChange, onBlur, ref } }) => (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: MUTED }}>{currency}</span>
              <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)}
                onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur}
                className={inputCls(!!errors.summary?.creditAmount?.message)} />
            </div>
          )} />
        </Field>
        <p className="text-xs mt-1.5" style={{ color: MUTED }}>Defaults to Total. Adjust for partial credit.</p>
      </div>
    </Section>
  );
}
