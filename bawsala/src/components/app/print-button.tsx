"use client";
export function PrintButton({ label }: { label: string }) {
  return <button type="button" className="btn btn-secondary btn-sm no-print" onClick={() => window.print()}>{label}</button>;
}
