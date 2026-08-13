import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import BookCard from './components/BookCard'
import SearchBar from './components/SearchBar'
import umbrellaIcon from "./assets/umbrellaWhite.svg";
import wordmark from "./assets/wordmark.svg";

function App() {
  return (
    <>
      <Header/>
      
        <section className="flex flex-col items-center max-w-[1200px] mx-auto px-5 py-10">
          <img 
            src={umbrellaIcon}
            alt="The Umbrella Library Icon"
            className="h-14 w-auto mx-auto mb-5"
          />
          <img src={wordmark} alt="The Umbrella Library Wordmark" className="h-14 w-auto mx-auto mb-5" />
          <p className="text-black italic text-[20px] mb-5">
            All your books under one umbrella.
          </p>

          <SearchBar/>

          <section className="max-w-[1200px]">
            <div className="inline-flex flex-col gap-1.5 mt-10">
                <div className="border border-2 border-black bg-[#000000] w-full h-1"></div>
                <div className="flex flex-row items-center bg-[#000000] gap-3 px-2">
                  <div className="box-decor"></div>
                  <h2 className="text-white italic text-[25px]">
                    Most Popular 
                  </h2>
                  <div className="box-decor"></div>
                </div>
                <div className="border border-black bg-[#000000] w-full h-1"></div>
            </div>

            <div className="border border-black flex flex-row items-center mx-auto px-5 py-10 gap-10">
              <BookCard
                cover="https://images-na.ssl-images-amazon.com/images/I/51N-u8AsmdL._SX329_BO1,204,203,200_.jpg"
                title="The Great Gatsby"
                year="1925"
                author="F. Scott Fitzgerald"
              />
              <BookCard
                cover="https://images-na.ssl-images-amazon.com/images/I/41+eK8zBwQL._SX331_BO1,204,203,200_.jpg"
                title="To Kill a Mockingbird"
                year="1960"
                author="Harper Lee"
              />
              <BookCard
                cover="https://images-na.ssl-images-amazon.com/images/I/51oHUv7kJmL._SX331_BO1,204,203,200_.jpg"
                title="1984"
                year="1949"
                author="George Orwell"
              />
              <BookCard
                cover="https://images-na.ssl-images-amazon.com/images/I/51s5o0Z1J-L._SX331_BO1,204,203,200_.jpg"
                title="Pride and Prejudice"
                year="1813"
                author="Jane Austen"
              />
              <BookCard
                cover="https://images-na.ssl-images-amazon.com/images/I/51b5YG6Y1rL._SX331_BO1,204,203,200_.jpg"
                title="The Catcher in the Rye"
                year="1951"
                author="J.D. Salinger"
              />
            </div>
          </section>
        </section>

    </>
  )
}

export default App
