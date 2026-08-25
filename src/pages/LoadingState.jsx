import umbrella from "/favicon.svg";

export default function Loading() {
  return (
    <div className="py-20 flex items-center justify-center">
      <img src={umbrella} alt="loading" className="w-30 h-30 animate-pulse" />
    </div>
  );
}
