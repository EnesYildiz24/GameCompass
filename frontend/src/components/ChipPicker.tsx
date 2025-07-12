// src/components/ChipPicker.tsx
import { useMemo, useState } from "react";
import { Button, Dropdown, Form, Badge, Stack } from "react-bootstrap";

/* ---------- Props ---------- */
interface ChipPickerProps {
  label: string;            // z.B. "Genres"
  options: string[];        // ["Action", "RPG", …]
  values: string[];         // aktuell selektierte Werte
  onChange: (v: string[]) => void;
}

export function ChipPicker({ label, options, values, onChange }: ChipPickerProps) {
  /* ---- interne Search-State (nur fürs Dropdown) ---- */
  const [filter, setFilter] = useState("");

  /* ---- gefilterte Optionen ---- */
  const filtered = useMemo(
    () =>
      options.filter((o) =>
        o.toLowerCase().includes(filter.trim().toLowerCase())
      ),
    [filter, options]
  );

  /* ---- Toggle Handling ---- */
  const toggleValue = (val: string) => {
    onChange(
      values.includes(val)
        ? values.filter((v) => v !== val)
        : [...values, val]
    );
  };

  return (
    <>
      <Form.Label className="fw-medium mb-1">{label}</Form.Label>

      {/* -------- Chips / Badges -------- */}
      <Stack direction="horizontal" gap={2} className="flex-wrap mb-2">
        {values.map((v) => (
          <Badge
            pill
            bg="primary"
            key={v}
            style={{ cursor: "pointer" }}
            onClick={() => toggleValue(v)}
          >
            {v} &times;
          </Badge>
        ))}

        {values.length === 0 && (
          <span className="text-muted">{label} wählen…</span>
        )}
      </Stack>

      {/* -------- Dropdown -------- */}
      <Dropdown autoClose="outside">
        <Dropdown.Toggle size="sm">{label} auswählen</Dropdown.Toggle>

        <Dropdown.Menu style={{ minWidth: 240 }}>
          {/* Suchfeld */}
          <Form.Control
            size="sm"
            placeholder="Suchen…"
            className="mx-2 my-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <div style={{ maxHeight: 260, overflowY: "auto" }}>
            {filtered.map((opt) => (
              <Form.Check
                key={opt}
                id={`${label}-${opt}`}
                type="checkbox"
                label={opt}
                checked={values.includes(opt)}
                className="mx-3 my-1"
                onChange={() => toggleValue(opt)}
              />
            ))}

            {filtered.length === 0 && (
              <div className="text-muted text-center py-2">Keine Treffer</div>
            )}
          </div>

          {/* Quick-Clear */}
          {values.length > 0 && (
            <Button
              variant="link"
              size="sm"
              className="w-100 mt-1"
              onClick={() => onChange([])}
            >
              Auswahl löschen
            </Button>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
