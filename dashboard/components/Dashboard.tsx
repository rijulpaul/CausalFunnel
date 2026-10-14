"use client";
import HeatmapDashboard from "@/components/HeatmapDashboard";
import SessionDashboard from "@/components/SessionDashboard";
import { useViewMode } from "@/state/viewMode";

export default function Dashboard() {
  const { view } = useViewMode();
  return <div className="w-full px-6 py-2 h-[85vh]">
    {view === "heatmap" ? <HeatmapDashboard /> : <SessionDashboard />}
  </div>
}
