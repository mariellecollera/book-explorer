import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import umbrellaIcon from "/umbrellaWhite.svg";
import wordmark from "../assets/wordmark.svg";

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function onSearch() {
    if (!query || query.trim() === '') return
    navigate(`/results?q=${encodeURIComponent(query)}`)
  }

  return (
    <>
      <section className="flex flex-col items-center max-w-[1200px] mx-auto px-5 py-10">
        <img src={umbrellaIcon} alt="The Umbrella Library Icon" className="h-14 w-auto mx-auto mb-5" />
        <img src={wordmark} alt="The Umbrella Library Wordmark" className="h-14 w-auto mx-auto mb-5" />
        <p className="text-black italic text-[20px] mb-5">All your books under one umbrella.</p>

        <SearchBar query={query} setQuery={setQuery} onSearch={onSearch} />

        <div className="inline-flex flex-col gap-1.5 mt-10 items-center">
          <div className="border border-black bg-[#000000] w-full h-1" />
          <div className="flex flex-row items-center bg-[#000000] gap-3 px-2">
            <div className="box-decor" />
            <h2 className="text-white italic text-[25px]">Most Popular</h2>
            <div className="box-decor" />
          </div>
          <div className="border border-black bg-[#000000] w-full h-1" />
        </div>
      </section>
    </>
  )
}
