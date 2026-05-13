'use client';

import { useState, useCallback, useMemo } from 'react';
import { useLocale } from '@/lib/i18n';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PassengerData {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
}

interface PassengerFormProps {
  onSubmit?: (data: PassengerData) => void;
}

interface FormErrors {
  fullName?: string;
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const NATIONALITIES = [
  'Việt Nam',
  'United States',
  'Japan',
  'South Korea',
  'China',
  'Thailand',
  'Singapore',
  'Malaysia',
  'Australia',
  'United Kingdom',
  'France',
  'Germany',
  'Canada',
  'India',
  'Philippines',
  'Indonesia',
  'Taiwan',
  'Cambodia',
  'Laos',
  'Myanmar',
] as const;

const PASSPORT_REGEX = /^[A-Za-z0-9]{6,9}$/;

// ─── Component ───────────────────────────────────────────────────────────────

export function PassengerForm({ onSubmit }: PassengerFormProps) {
  const { t } = useLocale();

  const [form, setForm] = useState<PassengerData>({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // ─── Validation ──────────────────────────────────────────────────────────

  const validate = useCallback(
    (data: PassengerData): FormErrors => {
      const errs: FormErrors = {};

      // Full name: 1-100 chars, required
      if (!data.fullName.trim()) {
        errs.fullName = t.flight.fullName + ' là bắt buộc';
      } else if (data.fullName.trim().length > 100) {
        errs.fullName = 'Tối đa 100 ký tự';
      }

      // Date of birth: valid past date, required
      if (!data.dateOfBirth) {
        errs.dateOfBirth = t.flight.dateOfBirth + ' là bắt buộc';
      } else {
        const dob = new Date(data.dateOfBirth);
        const now = new Date();
        if (isNaN(dob.getTime()) || dob >= now) {
          errs.dateOfBirth = 'Phải là ngày trong quá khứ';
        }
      }

      // Nationality: required
      if (!data.nationality) {
        errs.nationality = t.flight.nationality + ' là bắt buộc';
      }

      // Passport number: 6-9 alphanumeric, required
      if (!data.passportNumber.trim()) {
        errs.passportNumber = t.flight.passportNumber + ' là bắt buộc';
      } else if (!PASSPORT_REGEX.test(data.passportNumber.trim())) {
        errs.passportNumber = '6-9 ký tự chữ và số';
      }

      return errs;
    },
    [t],
  );

  const isValid = useMemo(() => {
    const errs = validate(form);
    return Object.keys(errs).length === 0;
  }, [form, validate]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleChange = useCallback(
    (field: keyof PassengerData, value: string) => {
      const next = { ...form, [field]: value };
      setForm(next);

      // Validate on change if field was already touched
      if (touched[field]) {
        const errs = validate(next);
        setErrors((prev) => ({
          ...prev,
          [field]: errs[field],
        }));
      }
    },
    [form, touched, validate],
  );

  const handleBlur = useCallback(
    (field: keyof PassengerData) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const errs = validate(form);
      setErrors((prev) => ({
        ...prev,
        [field]: errs[field],
      }));
    },
    [form, validate],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      setTouched({
        fullName: true,
        dateOfBirth: true,
        nationality: true,
        passportNumber: true,
      });

      const errs = validate(form);
      setErrors(errs);

      if (Object.keys(errs).length === 0) {
        onSubmit?.(form);
      }
    },
    [form, validate, onSubmit],
  );

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-tv-xl border border-border bg-white p-5 shadow-card"
      noValidate
    >
      {/* Header with DEMO badge */}
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-bold text-ink">{t.flight.passengerInfo}</h3>
        <span className="rounded bg-orange-cta px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          DEMO
        </span>
      </div>

      <p className="mt-1 text-xs text-muted-ink">
        Dữ liệu demo — không lưu trữ thông tin hành khách thật
      </p>

      <div className="mt-5 space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="passenger-fullname" className="block text-sm font-medium text-ink">
            {t.flight.fullName} <span className="text-red-500">*</span>
          </label>
          <input
            id="passenger-fullname"
            type="text"
            value={form.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            onBlur={() => handleBlur('fullName')}
            maxLength={100}
            placeholder="Nguyen Van A"
            className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm text-ink placeholder:text-muted-ink/50 focus:outline-none focus:ring-2 focus:ring-booking-blue/30 ${
              errors.fullName && touched.fullName
                ? 'border-red-400 bg-red-50'
                : 'border-border bg-white'
            }`}
          />
          {errors.fullName && touched.fullName && (
            <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="passenger-dob" className="block text-sm font-medium text-ink">
            {t.flight.dateOfBirth} <span className="text-red-500">*</span>
          </label>
          <input
            id="passenger-dob"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            onBlur={() => handleBlur('dateOfBirth')}
            max={new Date().toISOString().split('T')[0]}
            className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-booking-blue/30 ${
              errors.dateOfBirth && touched.dateOfBirth
                ? 'border-red-400 bg-red-50'
                : 'border-border bg-white'
            }`}
          />
          {errors.dateOfBirth && touched.dateOfBirth && (
            <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Nationality */}
        <div>
          <label htmlFor="passenger-nationality" className="block text-sm font-medium text-ink">
            {t.flight.nationality} <span className="text-red-500">*</span>
          </label>
          <select
            id="passenger-nationality"
            value={form.nationality}
            onChange={(e) => handleChange('nationality', e.target.value)}
            onBlur={() => handleBlur('nationality')}
            className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-booking-blue/30 ${
              errors.nationality && touched.nationality
                ? 'border-red-400 bg-red-50'
                : 'border-border bg-white'
            }`}
          >
            <option value="">— {t.flight.nationality} —</option>
            {NATIONALITIES.map((nat) => (
              <option key={nat} value={nat}>
                {nat}
              </option>
            ))}
          </select>
          {errors.nationality && touched.nationality && (
            <p className="mt-1 text-xs text-red-500">{errors.nationality}</p>
          )}
        </div>

        {/* Passport Number */}
        <div>
          <label htmlFor="passenger-passport" className="block text-sm font-medium text-ink">
            {t.flight.passportNumber} <span className="text-red-500">*</span>
          </label>
          <input
            id="passenger-passport"
            type="text"
            value={form.passportNumber}
            onChange={(e) => handleChange('passportNumber', e.target.value.toUpperCase())}
            onBlur={() => handleBlur('passportNumber')}
            maxLength={9}
            placeholder="B12345678"
            className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-sm font-mono text-ink placeholder:text-muted-ink/50 focus:outline-none focus:ring-2 focus:ring-booking-blue/30 ${
              errors.passportNumber && touched.passportNumber
                ? 'border-red-400 bg-red-50'
                : 'border-border bg-white'
            }`}
          />
          {errors.passportNumber && touched.passportNumber && (
            <p className="mt-1 text-xs text-red-500">{errors.passportNumber}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid}
        className="mt-6 w-full rounded-lg bg-orange-cta px-6 py-3 text-sm font-bold text-white transition hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-orange-cta/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t.common.confirm}
      </button>
    </form>
  );
}
