import { motion } from "framer-motion";

interface ProductCardProps {
  item: {
    src: string;
    bgColor: string;
    name: string;
  };
  index: number;
  activeIndex: number;
  imgRef: (el: HTMLImageElement | null) => void;
  onClick: () => void;
}

export function ProductCard({
  item,
  index,
  activeIndex,
  imgRef,
  onClick,
}: ProductCardProps) {
  const isEven = index % 2 === 0;
  const containerHeight = isEven ? "h-full lg:h-2/3 mt-auto" : "h-5/6";

  return (
    <div
      className={`absolute bottom-0 flex flex-col items-center justify-center w-full rounded-3xl ${containerHeight}`}
      style={{
        background: `linear-gradient(to bottom left, ${item.bgColor}, black 120%)`,
      }}
    >
      <motion.img
        ref={imgRef}
        src={item.src}
        alt={`Character ${index}`}
        draggable={false}
        onClick={onClick}
        className={`w-full h-30 relative lg:h-40  2xl:h-50 lg:absolute z-50 object-contain rounded-2xl px-4 ${
          isEven
            ? "bottom-1/2  md:translate-y-[70%] lg:translate-y-1/2"
            : "bottom-1/2 md:translate-y-[70%] lg:translate-y-20 right-0"
        }`}
        initial={{ scale: 0.9, opacity: 0.6 }}
        whileHover={{ scale: 1, opacity: 1, y: -20 }}
        animate={{
          scale: index === activeIndex ? 1 : 0.9,
          opacity: index === activeIndex ? 1 : 0.6,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 22,
        }}
      />
      <div className="flex flex-col absolute bottom-4 ">
        <span className="text-grad text-white">{item.name}</span>
      </div>
    </div>
  );
}
