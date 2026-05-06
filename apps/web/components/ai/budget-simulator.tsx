"use client";

import { useMemo, useState } from "react";
import { destinations, simulateBudget, type BudgetSimulationInput } from "@vietwander/shared";
import { formatVnd } from "@/lib/utils";

type SelectFieldProps<T extends string> = {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
};

export function BudgetSimulator({ initialDestinationSlug = "da-nang" }: { initialDestinationSlug?: string }) {
  const [destinationSlug, setDestinationSlug] = useState(initialDestinationSlug);
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(4);
  const [hotelLevel, setHotelLevel] = useState<BudgetSimulationInput["hotelLevel"]>("comfort");
  const [foodLevel, setFoodLevel] = useState<BudgetSimulationInput["foodLevel"]>("balanced");
  const [transportLevel, setTransportLevel] = useState<BudgetSimulationInput["transportLevel"]>("mixed");
  const [activityLevel, setActivityLevel] = useState<BudgetSimulationInput["activityLevel"]>("balanced");

  const budget = useMemo(
    () =>
      simulateBudget({
        destinationSlug,
        travelers,
        days,
        hotelLevel,
        foodLevel,
        transportLevel,
        activityLevel
      }),
    [activityLevel, days, destinationSlug, foodLevel, hotelLevel, travelers, transportLevel]
  );

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal">Smart Budget Simulator</p>
          <h2 className="mt-2 text-3xl font-black text-navy">{budget.destination}</h2>
        </div>
        <div className="rounded-2xl bg-navy p-5 text-right text-white">
          <p className="text-sm text-white/65">Estimated local demo total</p>
          <p className="text-3xl font-black">{formatVnd(budget.total)}</p>
          <p className="text-sm text-white/65">{formatVnd(budget.perPerson)} per person</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <label className="block text-sm font-bold text-navy">
          Destination
          <select value={destinationSlug} onChange={(event) => setDestinationSlug(event.target.value)} className="mt-2 w-full rounded-lg border border-navy/15 px-3 py-3">
            {destinations.map((destination) => (
              <option key={destination.slug} value={destination.slug}>
                {destination.name}
              </option>
            ))}
          </select>
        </label>
        <NumberSlider label="Travelers" value={travelers} min={1} max={8} onChange={setTravelers} />
        <NumberSlider label="Days" value={days} min={2} max={14} onChange={setDays} />
        <SelectField
          label="Hotel"
          value={hotelLevel}
          onChange={setHotelLevel}
          options={[
            { value: "hostel", label: "Hostel" },
            { value: "comfort", label: "Comfort" },
            { value: "boutique", label: "Boutique" },
            { value: "luxury", label: "Luxury" }
          ]}
        />
        <SelectField
          label="Food"
          value={foodLevel}
          onChange={setFoodLevel}
          options={[
            { value: "street", label: "Street food" },
            { value: "balanced", label: "Balanced" },
            { value: "premium", label: "Premium" }
          ]}
        />
        <SelectField
          label="Transport"
          value={transportLevel}
          onChange={setTransportLevel}
          options={[
            { value: "public", label: "Public" },
            { value: "mixed", label: "Mixed" },
            { value: "private", label: "Private" }
          ]}
        />
        <SelectField
          label="Pace"
          value={activityLevel}
          onChange={setActivityLevel}
          options={[
            { value: "slow", label: "Slow" },
            { value: "balanced", label: "Balanced" },
            { value: "packed", label: "Packed" }
          ]}
        />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {Object.entries(budget.breakdown).map(([label, value]) => (
          <div key={label} className="rounded-xl bg-ivory p-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy/55">{label}</p>
            <p className="mt-2 text-lg font-black text-navy">{formatVnd(value)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-mist p-4">
        <p className="font-bold text-navy">AI itinerary bias: {budget.itineraryBias}</p>
        <ul className="mt-2 space-y-1 text-sm text-navy/70">
          {budget.adjustmentNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function NumberSlider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-sm font-bold text-navy">
      {label}: {value}
      <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-4 w-full accent-teal" />
    </label>
  );
}

function SelectField<T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) {
  return (
    <label className="block text-sm font-bold text-navy">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value as T)} className="mt-2 w-full rounded-lg border border-navy/15 px-3 py-3">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
