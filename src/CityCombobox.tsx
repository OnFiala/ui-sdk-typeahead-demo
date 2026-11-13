"use client"

import {
  Combobox,
  ComboboxClear,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxList,
  ComboboxStatus,
  ComboboxTrigger,
} from "@ui-sdk/react/combobox"
import { useState } from "react"
import { cityByValue, cityItems, residents } from "./data/cities"

function visibleCities(items: readonly unknown[]) {
  const found = []
  for (const entry of items) {
    if (typeof entry !== "object" || entry === null || !("value" in entry)) {
      continue
    }
    const value = entry.value
    if (typeof value !== "string") continue
    const city = cityByValue.get(value)
    if (city) found.push(city)
  }
  return found
}

function CityCombobox() {
  const [value, setValue] = useState<string | null>(null)
  const selected = value ? cityByValue.get(value) : undefined

  return (
    <Combobox
      name="city"
      items={cityItems}
      value={value}
      onValueChange={setValue}
      autoHighlight="always"
      loop={false}
    >
      <div className="field">
        <ComboboxLabel>City</ComboboxLabel>
        <p className="hint">
          {cityItems.length} cities. Accents are optional, and a region name
          matches too.
        </p>
        <div className="control">
          <ComboboxInput
            placeholder="Praha, Brno, Pilsen…"
            autoComplete="off"
            spellCheck={false}
          />
          <ComboboxTrigger aria-label="Show cities" />
          <ComboboxClear aria-label="Clear city">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 6 L18 18 M18 6 L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </ComboboxClear>
        </div>
      </div>
      <ComboboxContent>
        <ComboboxStatus>
          {(state) =>
            state.count > 0
              ? `${state.count} ${state.count === 1 ? "city" : "cities"}`
              : null
          }
        </ComboboxStatus>
        <ComboboxEmpty>No cities match that search.</ComboboxEmpty>
        <ComboboxList>
          {(state) =>
            visibleCities(state.items).map((city) => (
              <ComboboxItem
                key={city.value}
                value={city.value}
                label={city.label}
              >
                <span className="option-copy">
                  <ComboboxItemText />
                  <span className="option-region">{city.region}</span>
                </span>
                <ComboboxItemIndicator />
              </ComboboxItem>
            ))
          }
        </ComboboxList>
      </ComboboxContent>
      <section className="selection" aria-labelledby="selected-heading">
        <h2 id="selected-heading">Selected</h2>
        {selected ? (
          <>
            <p className="city-name">{selected.label}</p>
            <p className="city-meta">
              {selected.region}
              <span aria-hidden="true"> · </span>
              about {residents.format(selected.residents)} residents
            </p>
          </>
        ) : (
          <p className="city-meta">No city selected.</p>
        )}
      </section>
    </Combobox>
  )
}

export { CityCombobox }
