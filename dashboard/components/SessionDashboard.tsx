import SidePanel from "@/elements/SidePanel";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import UserJourney, { type SessionData} from "@/elements/UserJourney";

export default function SessionDashboard() {
  const [sessions, setSessions] = useState();
  const [currentSession, setCurrentSession] = useState("");
  const [sessionData, setSessionData] = useState<SessionData | undefined>();

  useEffect(() => {
    fetch("/api/sessions")
      .then((res) => res.json())
      .then((res) => {
        const formattedPages = res?.sessions.map((sessions) => ({
          count: sessions.event_count,
          id: sessions.session_id,
        }));
        setSessions(formattedPages);
      });
  }, []);

  useEffect(() => {
    if (!currentSession) return;
    fetch(`/api/${currentSession}`)
      .then((res) => res.json())
      .then((res) => setSessionData(res));
  }, [currentSession]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 py-4">
        {/* URL */}
        <div className="flex flex-2 gap-2">
          <Input
            value={currentSession}
            placeholder="Sessions ID"
            onChange={(e) => {
              setCurrentSession(e.target.value);
            }}
          />
        </div>

        <div className="flex-2 truncate overflow-auto scrollbar-none m-auto border rounded-lg py-[3px]">
          {/*<span className="bg-stone-700 px-2 m-auto rounded-l-lg">Url:</span>{" "}*/}
          <span className="px-2">{sessionData?.events?.at(-1)?.page_url || <span className="text-stone-500 text-[14px]">Page Url</span>}</span>
        </div>
        {/* Device controls */}
        <div className="m-auto"><span className="text-stone-400">Total Events: </span>{sessionData?.event_count || "NA"}</div>
      </div>
      <div className="flex md:py-4">
        <SidePanel
          props={{ title: "Sessions", sections: sessions }}
          onLinkClick={(text) => setCurrentSession(text)}
        />
        <div className="flex justify-center w-full flex-col">
          <div>
            {sessionData
              ? < UserJourney sessionData={sessionData} />
              : <div className="flex h-[70vh] rounded-lg bg-stone-950 text-stone-500 w-full justify-center items-center">
                Select a Session to View Here
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
