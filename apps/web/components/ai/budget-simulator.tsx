'use client';

import { destinations, simulateBudget, type BudgetSimulationInput } from '@vietwander/shared';
import { useMemo, useState } from 'react';
import { getDestinationCopy } from '@/lib/destination-copy';
import { formatVnd } from '@/lib/utils';

type SelectFieldProps<T extends string> = {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
};

export function BudgetSimulator({
  initialDestinationSlug = 'da-nang',
}: {
  initialDestinationSlug?: string;
}) {
  const [destinationSlug, setDestinationSlug] = useState(initialDestinationSlug);
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(4);
  const [hotelLevel, setHotelLevel] = useState<BudgetSimulationInput['hotelLevel']>('comfort');
  const [foodLevel, setFoodLevel] = useState<BudgetSimulationInput['foodLevel']>('balanced');
  const [transportLevel, setTransportLevel] =
    useState<BudgetSimulationInput['transportLevel']>('mixed');
  const [activityLevel, setActivityLevel] =
    useState<BudgetSimulationInput['activityLevel']>('balanced');

  const budget = useMemo(
    () =>
      simulateBudget({
        destinationSlug,
        travelers,
        days,
        hotelLevel,
        foodLevel,
        transportLevel,
        activityLevel,
      }),
    [activityLevel, days, destinationSlug, foodLevel, hotelLevel, travelers, transportLevel],
  );

  return (
    <section className="rounded-tv border border-tv-border bg-white p-5 shadow-[0_18px_48px_rgba(2,68,120,0.08)]">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-tv-blue">
            Mô phỏng ngân sách thông minh
          </p>
          <h2 className="mt-2 text-3xl font-bold text-tv-ink">
            {
              getDestinationCopy(
                destinations.find((item) => item.slug === destinationSlug) ?? destinations[0]!,
              ).name
            }
          </h2>
        </div>
        <div className="rounded-tv bg-tv-blue p-5 text-right text-white shadow-[0_14px_32px_rgba(2,119,212,0.18)]">
          <p className="text-sm text-white/65">Tổng chi phí demo dự kiến</p>
          <p className="text-3xl font-bold">{formatVnd(budget.total)}</p>
          <p className="text-sm text-white/65">{formatVnd(budget.perPerson)} / người</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="block text-sm font-bold text-tv-ink">
          Điểm đến
          <select
            value={destinationSlug}
            onChange={(event) => setDestinationSlug(event.target.value)}
            className="mt-2 w-full rounded-lg border border-tv-border bg-tv-bg px-3 py-3"
          >
            {destinations.map((destination) => (
              <option key={destination.slug} value={destination.slug}>
                {getDestinationCopy(destination).name}
              </option>
            ))}
          </select>
        </label>
        <NumberSlider label="Số khách" value={travelers} min={1} max={8} onChange={setTravelers} />
        <NumberSlider label="Số ngày" value={days} min={2} max={14} onChange={setDays} />
        <SelectField
          label="Lưu trú"
          value={hotelLevel}
          onChange={setHotelLevel}
          options={[
            { value: 'hostel', label: 'Tiết kiệm' },
            { value: 'comfort', label: 'Thoải mái' },
            { value: 'boutique', label: 'Boutique' },
            { value: 'luxury', label: 'Cao cấp' },
          ]}
        />
        <SelectField
          label="Ăn uống"
          value={foodLevel}
          onChange={setFoodLevel}
          options={[
            { value: 'street', label: 'Món địa phương' },
            { value: 'balanced', label: 'Cân bằng' },
            { value: 'premium', label: 'Cao cấp' },
          ]}
        />
        <SelectField
          label="Di chuyển"
          value={transportLevel}
          onChange={setTransportLevel}
          options={[
            { value: 'public', label: 'Công cộng' },
            { value: 'mixed', label: 'Kết hợp' },
            { value: 'private', label: 'Riêng tư' },
          ]}
        />
        <SelectField
          label="Nhịp đi"
          value={activityLevel}
          onChange={setActivityLevel}
          options={[
            { value: 'slow', label: 'Thong thả' },
            { value: 'balanced', label: 'Cân bằng' },
            { value: 'packed', label: 'Dày lịch' },
          ]}
        />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {Object.entries(budget.breakdown).map(([label, value]) => (
          <div key={label} className="rounded-tv-sm border border-tv-border bg-tv-bg p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-tv-ink-3">
              {budgetLabel(label)}
            </p>
            <p className="mt-2 text-lg font-bold text-tv-ink">{formatVnd(value)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-tv-sm border border-tv-border bg-tv-blue-light p-4">
        <p className="font-bold text-tv-ink">
          Gợi ý nhịp lịch trình: {translateBudgetBias(budget.itineraryBias)}
        </p>
        <ul className="mt-2 space-y-1 text-sm text-tv-ink-3">
          {budget.adjustmentNotes.map((note) => (
            <li key={note}>{translateBudgetNote(note)}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function budgetLabel(label: string) {
  return (
    {
      hotel: 'Lưu trú',
      food: 'Ăn uống',
      transport: 'Di chuyển',
      activities: 'Hoạt động',
    }[label] ?? label
  );
}

function translateBudgetBias(value: string) {
  return value
    .replace('budget-aware', 'tối ưu ngân sách')
    .replace('balanced', 'cân bằng')
    .replace('comfort', 'thoải mái')
    .replace('premium', 'cao cấp')
    .replace('luxury', 'sang trọng');
}

function translateBudgetNote(value: string) {
  return (
    {
      'Prioritize fewer hotel moves and private transfers.':
        'Ưu tiên ít đổi khách sạn hơn và dùng xe riêng khi cần.',
      'Hotel level keeps the trip flexible.':
        'Mức lưu trú này giữ chuyến đi linh hoạt và dễ điều chỉnh.',
      'Street food routes increase local texture and lower cost.':
        'Tuyến món địa phương giúp tăng trải nghiệm bản địa và giảm chi phí.',
      'Food budget supports curated meals and cafe stops.':
        'Ngân sách ăn uống đủ cho bữa chọn lọc và các điểm cà phê.',
      'Packed pacing needs stronger rest windows and transport buffers.':
        'Lịch dày cần chừa thêm khoảng nghỉ và thời gian di chuyển.',
      'Pacing leaves room for weather and local discoveries.':
        'Nhịp đi này còn khoảng trống cho thời tiết và khám phá tại chỗ.',
    }[value] ?? value
  );
}

function NumberSlider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm font-bold text-tv-ink">
      {label}: {value}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full accent-tv-blue"
      />
    </label>
  );
}

function SelectField<T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) {
  return (
    <label className="block text-sm font-bold text-tv-ink">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="mt-2 w-full rounded-lg border border-tv-border bg-tv-bg px-3 py-3"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
