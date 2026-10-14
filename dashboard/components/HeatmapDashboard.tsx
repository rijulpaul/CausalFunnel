"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SidePanel from "@/elements/SidePanel";

const devices = {
  mobile: [414, 896],
  desktop: [1280, 720],
};

type ClickPoint = {
  x: number;
  y: number;
};

export default function HeatmapDashboard() {
  const [url, setUrl] = useState("");
  const [width, setWidth] = useState(devices.desktop[0]);
  const [height, setHeight] = useState(devices.desktop[1]);
  const [urlError, setUrlError] = useState("");
  const [clickData, setClickData] = useState<ClickPoint[]>([]);
  const [pages, setPages] = useState();

  const isMobile = width === devices.mobile[0];

  useEffect(() => {
    fetch("/api/pages")
      .then((res) => res.json())
      .then((res) => {
        const formattedPages = res?.pages.map((page) => ({
          count: page.event_count,
          id: page.page_url,
        }));
        setPages(formattedPages);
      });
  }, []);

  useEffect(() => {
    if (!url) return;
    fetch(`/api/page?page_url=${url}`)
      .then((res) => res.json())
      .then((res) => {
        const points = res.clicks.map(({ x, y }: { x: number; y: number }) => {

          return {
            x: x,
            y: y,
          };
        });
        setClickData(points);
      });
  }, [url]);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 py-4">
        {/* URL */}
        <div className="flex flex-2 gap-2">
          <Input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setUrlError("");
            }}
            placeholder="https://example.com"
          />

          {urlError && (
            <p className="self-center text-sm text-destructive">{urlError}</p>
          )}
        </div>

        {/* Device controls */}
        <div className="flex gap-2">
          <Button
            variant={!isMobile ? "default" : "outline"}
            onClick={() => {
              setHeight(devices.mobile[1]);
              setWidth(devices.mobile[0]);
            }}
          >
            Mobile
          </Button>

          <Button
            variant={isMobile ? "default" : "outline"}
            onClick={() => {
              setHeight(devices.desktop[1]);
              setWidth(devices.desktop[0]);
            }}
          >
            Desktop
          </Button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex overflow-scroll bg-muted md:py-4 gap-2">
        <SidePanel
          props={{ title: "Pages", sections: pages }}
          onLinkClick={(text: string) => setUrl(text)}
        />
        {/* Viewport */}
        <div className="flex m-auto  justify-center">
          <div
            className="shrink-0 overflow-auto rounded-lg bg-stone-950 border shadow"
            style={{
              width: `${width}px`,
              height: `${height}px`,
            }}
          >
            {/* Page */}
            <div
              className="relative"
              style={{
                width: `${width}px`,
                height: "100%",
              }}
            >
              {!url && (
                <div className="h-full w-full flex justify-center items-center text-stone-500">
                  Select a Url to view here
                </div>
              )}

              {/* Website */}
              {url && (
                <iframe
                  src={url}
                  title="Website preview"
                  className="absolute left-0 top-0 z-0 border-0"
                  style={{
                    width: `${width}px`,
                    height: "100%",
                  }}
                  onError={() => {
                    setUrlError("Unable to load this URL");
                  }}
                />
              )}

              {/* Heatmap */}
              {url && (
                <div className="pointer-events-none absolute left-0 top-0 z-10">
                  {clickData?.map((point, index) => (
                    <div
                      key={index}
                      className="absolute h-4 w-4 justify-center flex items-center rounded-full bg-red-500"
                      style={{
                        top: `${point.y * height}px`,
                        left: `${point.x * width}px`,
                        // top: `340px`,
                        // left: `340px`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <span className="font-bold text-red-600">×</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
