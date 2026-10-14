"use client";

import { sidePanelOpen } from "@/state/sidePanelOpen";

type Props = {
  title?: string
  sections?: Record<string,number>[]
}

export default function SidePanel({ props, onLinkClick }: {props:Props, onLinkClick?:(text:string)=>void}) {

  const {isOpen, toggle} = sidePanelOpen()

  const handleClick = (e) => {
    const text = e.target.textContent?.trim();
    console.log(text)

    if (text && onLinkClick) {
      onLinkClick(text);
    }
  }

  return (
    <div
      className={`fixed h-[70vh] w-100 bg-black rounded border transition-transform z-50 duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-[-105%]"
      }`}
    >
      <button
        onClick={() => toggle()}
        className="absolute -right-4 top-1/2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border bg-black  text-white"
      >
        {isOpen ? "×" : ">"}
      </button>

      <div className="p-6">
        {/*breadcrumb*/}
        <div className="flex justify-between pb-5">
          <p className="text-xl">{props?.title || "Title"}</p>
          <p className="text-xl">Events</p>
        </div>
        {
        <div>
              {props?.sections?.map((page) => (
                <div key={page.id} className="flex justify-between p-0.5" onClick={handleClick}>
                  <span className="hover:underline hover:text-stone-400 text-xs w-[85%] truncate overflow-scroll">{page.id}</span>
                  <a className="m-auto h-[2ch] w-[3ch] text-center rounded-full bg-stone-900 border border-stone-600 text-[14px]">{page.count}</a>
                </div>
              ))}
            </div>
            }
      </div>
    </div>
  );
}
