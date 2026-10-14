import Dashboard from "@/components/Dashboard";
import Header from "@/components/Header";
import "./globals.css";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Header/>
      <Dashboard/>
    </div>
  );
}
