import { useState } from "react";
import { Link } from "react-router-dom";
import umbrella from "/favicon.svg";
import wordmark from "../assets/wordmark_white.svg";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black text-[#fffffc]">
      <div className="flex items-center justify-between px-10 py-5 md:py-2">
        <a href="/" className="flex items-center gap-3">
          <img
            src={umbrella}
            alt="Umbrella Icon"
            className="h-7.5 md:h-8 w-auto"
          />
          <img
            src={wordmark}
            alt="The Umbrella Library Wordmark"
            className="h-3.5 md:h-4 w-auto"
          />
        </a>

        <nav className="hidden md:flex items-center gap-[45px]">
          <Link to="/" className="italic text-[18px] hover:opacity-80">
            Home
          </Link>
          <Link
            to="/my-umbrella"
            className="italic text-[18px] hover:opacity-80"
          >
            My Umbrella
          </Link>
        </nav>

        <button
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden flex flex-col justify-center gap-[5px] w-[25px] h-[25px] cursor-pointer"
        >
          <span
            className={`h-[2px] w-full bg-[var(--color-white)] transition-transform duration-200 ${
              menuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`h-[2px] w-full bg-[var(--color-white)] transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-[2px] w-full bg-[var(--color-white)] transition-transform duration-200 ${
              menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          menuOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-10 pb-5">
          <ul className="flex flex-col items-start gap-6">
            <li>
              <Link
                to="/my-umbrella"
                className="italic text-[18px] hover:opacity-80"
                onClick={() => setMenuOpen(false)}
              >
                My Umbrella
              </Link>
            </li>
            <li>
              <Link to="#" className="italic text-[18px] hover:opacity-80">
                Log in
              </Link>
            </li>
            <li>
              <Link to="#" className="button-white italic text-[18px]">
                Sign up
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
