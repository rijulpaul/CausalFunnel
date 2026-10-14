import { Input } from "@/components/ui/input"

export default function SearchBar() {
  return <Input
          type="search"
          placeholder="Enter URL / Session ID"
          className="pl-10 border-gray-200 h-5vh rounded-full"
        />
}
