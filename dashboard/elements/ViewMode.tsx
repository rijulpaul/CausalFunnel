"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useViewMode } from "@/state/viewMode";

export default function ViewMode() {
  const { view, setView } = useViewMode();

  return (
    <ButtonGroup className="rounded-full outline-1 ">
      <Button
        className={view === "heatmap" ? "" : "text-stone-500"}
        onClick={() => setView("heatmap")}
      >
        Heatmap View
      </Button>

      <Button
        className={view === "session" ? "" : "text-stone-500"}
        onClick={() => setView("session")}
      >
        Session View
      </Button>
    </ButtonGroup>
  );
}
