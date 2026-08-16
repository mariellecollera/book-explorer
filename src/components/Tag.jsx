export default function Tag({ label }) {
  return (
    <div className="inline-flex flex-col gap-1 mt-5 items-center">
      <div className="border border-black bg-black w-full h-1" />
      <div className="flex flex-row items-center bg-black gap-3 px-2">
        <div className="box-decor" />
        <span className="text-white px-3 py-1 text-sm italic">{label}</span>
        <div className="box-decor" />
      </div>
      <div className="border border-black bg-black w-full h-1" />
    </div>
  );
}
