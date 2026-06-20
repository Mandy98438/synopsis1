import Link from "next/link";
export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#0d0d0d] border border-[#1e1e1e] flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="3" y="5" width="22" height="18" rx="2.5" stroke="#333" strokeWidth="1.5"/>
            <path d="M3 10h22" stroke="#333" strokeWidth="1.5"/>
            <path d="M14 16v4M12 18h4" stroke="#E07020" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="text-lg font-medium text-white mb-2">No Kard yet</h2>
        <p className="text-[#444] text-sm leading-relaxed mb-8">Create your first Kard and share your identity with a single link or QR code.</p>
        <Link href="/dashboard/new" className="inline-flex items-center gap-2 bg-[#E07020] hover:bg-[#c85e18] text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">
          Create my Kard
        </Link>
      </div>
    </div>
  );
}
