import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "cmdk"
import { Command } from "./ui/Command"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useRef, useState } from "react"
import axios from "axios"
import { Prisma, Subreddit } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Users } from "lucide-react"
import { request } from "http"
import debounce from "lodash.debounce"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"


const SearchBar = () => {

  const [input, setInput] = useState<string>("")
  const router = useRouter();

  

  const { data: queryResults, refetch, isFetching, isFetched } = useQuery({
    queryFn: async() => {
      if(!input) return []
    const { data } = await axios.get(`/api/search?=${input}`)
    return data as (Subreddit & {
      _count: Prisma.SubredditCountOutputType
    })[]
    },
    queryKey: ['search-query'],
    enabled: false,
  })

  const request = debounce(()=> {
    refetch()
  }, 300)

  const debounceRequest = useCallback(() => {
    request()
  }, [])

  const commandRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(commandRef, () => {
    setInput("")
  })

  return (
    <Command ref={commandRef} className="relative rounded-lg border max-w-lg z-50 overflow-visible">
      <CommandInput
        onValueChange={(text) => {
          setInput(text)
          debounceRequest()
        }} 
        placeholder="Search Communities..." 
        className="outline-none border-none focus:border-none focus:outline-none ring-0" />

        {input.length > 0 ? (
          <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
            {isFetched && <CommandEmpty>No Results found.</CommandEmpty>}
            {(queryResults?.length ?? 0) > 0 ? (
              <CommandGroup heading="Communities">
                {queryResults?.map((subreddit) => (
                  <CommandItem onSelect={(e) => {
                    router.push(`/r/${e}`)
                    router.refresh()
                  }} key={subreddit.id} value={subreddit.name}>
                    <Users className="mr-2 h-4 w-4"/>
                    <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                  </CommandItem>
                ))}
              </CommandGroup>
            ): null}
          </CommandList>
        ): null}
    </Command>
  )
}

export default SearchBar
