export type Event = {
  _id: string;
  session_id: string;
  event: string;
  page_url: string;
  timestamp: string;
  x?: number;
  y?: number;
  tag: string;
  text?: string | null;
  href?: string | null;
};

export type PageBlock = {
  pageUrl: string;
  events: Event[];
};

function createPageBlocks(events: Event[]): PageBlock[] {
  const blocks: PageBlock[] = [];
  let currentBlock: PageBlock | null = null;

  for (const event of events) {
    console.log(event.event,event.timestamp)
    if (event.event === "page_view") {
      // We found a new page, so finish the previous block first
      if (currentBlock && currentBlock.events.length > 0) {
        currentBlock.events.push(event);
        blocks.push(currentBlock);
      } else {
        currentBlock = {
          pageUrl: event.page_url,
          events: [event],
        };
        blocks.push(currentBlock);
      }

      currentBlock = null ;

    } else if (currentBlock) {
      // Add clicks/etc. to the current block
      currentBlock.events.push(event);
    } else {
      currentBlock = {
        pageUrl: event.page_url,
        events: [event],
      };
    }
  }

  // Push the final block
  if (currentBlock && currentBlock.events.length > 0) {
    blocks.push(currentBlock);
  }

  return blocks;
}

export type SessionData = {
  session_id: string;
  event_count: number;
  events: Event[];
};
export default function UserJourney({
  sessionData,
}: {
  sessionData: SessionData;
}) {
  const blocks = createPageBlocks(sessionData?.events);

  return (
    <div className="space-y-6">
      {blocks.map((block, blockIndex) => (
        <div key={blockIndex} className="rounded-lg border bg-card p-4">
          {/* Page header */}
          <div className="mb-4">
            <p className="font-medium">{block.pageUrl.split("/").pop()}</p>

            <p className="text-xs text-muted-foreground">
              {block.events.length} events
            </p>
          </div>

          {/* Events */}
          <div className="relative ml-3 border-l pl-6">
            {block.events.map((event, index) => (
              <TimelineEvent key={event._id} event={event} index={index} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineEvent({ event, index }: { event: Event; index: number }) {
  return (
    <div className="relative mb-5">
      <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border bg-background" />

      <div>
        <div className="flex justify-between">
          <div className="text-sm font-medium gap">
            {event.event === "page_view" ? "Page viewed" : "Clicked"}

            {event.event === "click" && event?.tag && (
              <>
                {event?.text && (
                  <span className="px-2">{event.text} Button</span>
                )}

                {event?.href && (
                  <span className="px-2">Redirected To {event.href}</span>
                )}
              </>
            )}
          </div>

          <span className="text-xs text-muted-foreground">
            {new Date(event.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}
