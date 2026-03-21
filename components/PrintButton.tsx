"use client";

export default function PrintButton({
  label = "Print / Save PDF",
}: {
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 print:hidden"
    >
      {label}
    </button>
  );
}