import umbrella from "/favicon.svg";
import wordmark from "../assets/wordmark_white.svg";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black text-[#fffffc] flex items-center justify-between px-10 py-3">
      <a href="/" className="flex items-center gap-3">
        <img src={umbrella} alt="Umbrella Icon" className="h-7 w-auto" />
        <img src={wordmark} alt="The Umbrella Library Wordmark" className="h-3 w-auto" />
      </a>

      <nav className="flex items-center gap-[45px]">
        <a href="#" className="italic text-[18px] hover:opacity-80">
          My Umbrella
        </a>
        <a href="#" className="italic text-[18px] hover:opacity-80">
          Log in
        </a>
        <a
          href="#"
          className="button-white italic text-[18px]"
        >
          Sign up
        </a>
        <button aria-label="Menu" className="flex flex-col gap-[5px] w-[25px]">
          <span className="h-[2px] w-full bg-[#fffffc]" />
          <span className="h-[2px] w-full bg-[#fffffc]" />
          <span className="h-[2px] w-full bg-[#fffffc]" />
        </button>
      </nav>

    </header>
  );
}