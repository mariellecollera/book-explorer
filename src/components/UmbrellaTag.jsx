import umbrella_shape from "../assets/umbrella_shape.svg";

export default function UmbrellaTag({ isMyUmbrella }) {
  return (
    <>
      {isMyUmbrella && (
        // <div className="absolute top-[-5px] right-[-5px] bg-gradient-to-tr from-transparent from-30% to-[var(--color-white)] to-30%">
        //   <img
        //     src={umbrella_shape}
        //     alt="umbrella shape"
        //     className="rotate-45 w-10 object-cover"
        //   />
        // </div>

        <img
          src={umbrella_shape}
          alt="umbrella shape"
          className="absolute top-[-15px] right-[-15px] rotate-45 w-12 object-cover z-10"
        />
      )}
    </>
  );
}
