import umbrellaIcon from "../assets/umbrellaWhite.svg";// 

export default function Header() {
  return (
    <header className="sticky top-0 bg-black text-[#fffffc] flex items-center justify-between px-3 py-3">
      <div className="flex items-center gap-5">
        <img src={umbrellaIcon} alt="Umbrella Icon" className="h-7 w-auto" />
      </div>

      <nav className="flex items-center gap-[45px]">
        <a href="#" className="italic text-[20px] hover:opacity-80">
          My Umbrella
        </a>
        <a href="#" className="italic text-[20px] hover:opacity-80">
          Log in
        </a>
        <a
          href="#"
          className="bg-[#fffffc] text-black italic text-[20px] px-3.5 py-1 hover:opacity-90"
        >
          Sign up
        </a>
      </nav>

      {/* Hamburger */}
      <button aria-label="Menu" className="flex flex-col gap-1.25 w-[25px]">
        <span className="h-[2px] w-full bg-[#fffffc]" />
        <span className="h-[2px] w-full bg-[#fffffc]" />
        <span className="h-[2px] w-full bg-[#fffffc]" />
      </button>
    </header>
  );
}