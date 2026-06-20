import Link from "next/link";
import { KardLogo } from "@/components/kard/kard-logo";
export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
      <KardLogo size="md" isDark className="mb-10" />
      <p className="text-[#333] text-xs font-mono mb-4">404</p>
      <h1 className="text-2xl font-medium text-white mb-3">This Kard doesn't exist</h1>
      <p className="text-[#444] text-sm mb-8">The card may have been removed or the username is wrong.</p>
      <Link href="/" className="bg-[#E07020] hover:bg-[#c85e18] text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">
        Go home
      </Link>
    </main>
  );
}
