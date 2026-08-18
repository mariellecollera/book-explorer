import umbrella_white from "../assets/umbrella_white.svg";

export default function PlaceholderCover({ cover, title, year, author }) {
  return (
    <div className="bg-[var(--color-black)] w-full h-full flex flex-col items-center justify-between p-5 gap-2.5">
      <div className="flex flex-col items-center">
        <img
          src={umbrella_white}
          alt="White umbrella logo"
          className="w-8 h-8 mt-5 mb-4"
        />
        <div className="text-white text-center text-sm">
          {title} {year && `(${year})`}
        </div>
      </div>
      <div className="italic text-white text-sm">by {author}</div>
    </div>
  );
}
