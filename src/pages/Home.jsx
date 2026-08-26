import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import umbrella from "/favicon.svg";
import wordmark from "../assets/wordmark.svg";

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function onSearch() {
    if (!query || query.trim() === "") return;
    navigate(`/results?q=${encodeURIComponent(query)}&page=1`);
  }

  return (
    <>
      <main className="flex flex-col items-center max-w-[1200px] mx-auto my-10 px-5 py-10 gap-5">
        <img
          src={umbrella}
          alt="The Umbrella Library Icon"
          className="h-14 w-auto mx-auto"
        />
        <img
          src={wordmark}
          alt="The Umbrella Library Wordmark"
          className="h-14 w-auto mx-auto"
        />
        <p className="text-black italic text-[20px] mb-5">
          All your books under one umbrella.
        </p>

        <SearchBar query={query} setQuery={setQuery} onSearch={onSearch} />
      </main>
    </>
  );
}
