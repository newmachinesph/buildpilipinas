"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";

export type DropdownOption = {
  value: string;
  label: string;
  hint?: string;
};

type Props = {
  label: string;
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  /** Rendered inside the trigger, before the label. */
  icon?: ReactNode;
  /** Trigger classes — the menu styling is fixed so every menu matches. */
  triggerClassName?: string;
  align?: "start" | "end";
  /** Optional row pinned to the bottom of the menu (e.g. "Clear filter"). */
  footer?: ReactNode;
};

/**
 * One keyboard-accessible menu used by every dropdown on the page.
 * Roving focus with the arrow keys, Home/End, Escape to close and return focus,
 * click-outside to dismiss, and `aria-checked` on the selected row.
 */
export function Dropdown({
  label,
  options,
  value,
  onChange,
  icon,
  triggerClassName = "",
  align = "start",
  footer,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  // Open at the current selection so the menu doesn't lose the user's place.
  const openMenu = () => {
    const i = options.findIndex((o) => o.value === value);
    setActiveIndex(i < 0 ? 0 : i);
    setOpen(true);
  };

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + options.length) % options.length);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
    }
  };

  /* Tab is allowed to move naturally so the footer row ("Clear category") is
     keyboard-reachable; the menu closes only once focus actually leaves it. */
  const onBlur = (e: React.FocusEvent) => {
    if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
  };

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={rootRef} onBlur={onBlur} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        /* The visible text is just the current value ("Quezon City"), which on
           its own tells a screen-reader user nothing about what it controls.
           Prefixing the label keeps the visible string inside the accessible
           name, so WCAG 2.5.3 Label in Name still holds. */
        aria-label={selected ? `${label}: ${selected.label}` : label}
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            openMenu();
          }
        }}
        className={`ctl inline-flex min-h-11 items-center gap-[var(--space-3xs)] rounded-sm transition-colors duration-[var(--dur-short)] nowrap ${triggerClassName}`}
      >
        {icon}
        <span className="truncate">{selected?.label ?? label}</span>
        <ChevronDown
          size={14}
          strokeWidth={2.25}
          className={`shrink-0 transition-transform duration-[var(--dur-short)] ease-[var(--ease-out)] ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className={`absolute top-[calc(100%+var(--space-3xs))] z-40 max-h-[19rem] w-[15rem] overflow-y-auto rounded-md border border-rule bg-paper p-[var(--space-3xs)] shadow-[var(--bp-shadow-plate)] ${
            align === "end" ? "right-0" : "left-0"
          }`}
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            return (
              <button
                key={o.value}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                tabIndex={i === activeIndex ? 0 : -1}
                onClick={() => {
                  onChange(o.value);
                  close();
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className="flex w-full items-center gap-[var(--space-2xs)] rounded-xs px-[var(--space-2xs)] py-[var(--space-2xs)] text-left text-[length:var(--text-sm)] transition-colors duration-[var(--dur-short)] hover:bg-paper-2"
              >
                <Check
                  size={14}
                  strokeWidth={2.5}
                  className={`shrink-0 text-flag-blue ${isSelected ? "" : "invisible"}`}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate">{o.label}</span>
                {o.hint && (
                  <span className="tnum shrink-0 text-[length:var(--text-xs)] text-muted">
                    {o.hint}
                  </span>
                )}
              </button>
            );
          })}

          {footer && (
            <div className="mt-[var(--space-3xs)] border-t border-rule-2 pt-[var(--space-3xs)]">
              {footer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
