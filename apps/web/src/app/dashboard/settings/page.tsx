import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/signin");
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, include: { verification: true } });
  if (!user) redirect("/auth/signin");
  return (
    <DashboardShell user={{ name: user.name, email: user.email, plan: user.plan }}>
      <div className="flex-1 p-8 max-w-lg">
        <h1 className="text-lg font-medium text-white mb-6">Settings</h1>
        <div className="space-y-4">
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5">
            <p className="text-[11px] text-[#444] uppercase tracking-widest font-medium mb-3">Account</p>
            <p className="text-sm text-[#666]">{user.email}</p>
            <p className="text-xs text-[#333] mt-1">Plan: <span className="text-[#555] capitalize">{user.plan.toLowerCase()}</span></p>
          </div>
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5">
            <p className="text-[11px] text-[#444] uppercase tracking-widest font-medium mb-3">Verification</p>
            <p className="text-sm text-[#666]">Level {user.verification?.level ?? 0}</p>
            <div className="mt-3 space-y-1.5">
              {[["LinkedIn", user.verification?.linkedinVerified], ["GitHub", user.verification?.githubVerified], ["Google", user.verification?.googleVerified]].map(([name, verified]) => (
                <div key={String(name)} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${verified ? "bg-green-500" : "bg-[#333]"}`} />
                  <span className="text-xs text-[#555]">{String(name)}</span>
                  <span className={`text-[10px] ${verified ? "text-green-600" : "text-[#333]"}`}>{verified ? "Verified" : "Not connected"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
