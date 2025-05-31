import { motion, type Variants } from "framer-motion";

interface ProductModalProps {
  item: {
    src: string;
    name: string;
    description: string;
    bgColor: string;
  };
  origin: { x: number; y: number };
  onClose: () => void;
}

export function ProductModal({ item, origin, onClose }: ProductModalProps) {
  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0,
      x: origin.x - window.innerWidth / 2,
      y: origin.y - window.innerHeight / 2,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 20 },
    },
    exit: {
      opacity: 0,
      scale: 0,
      x: origin.x - window.innerWidth / 2,
      y: origin.y - window.innerHeight / 2,
    },
  };

  return (
    <motion.div
      className="fixed -bottom-0 right-0 flex z-50"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div
        className="relative w-[80vw] h-[70vh] rounded-tl-[30%] shadow-lg"
        style={{
          background: `linear-gradient(to bottom left, ${item.bgColor}, black 120%)`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute -top-8 right-4 text-xl font-bold text-black z-10"
        >
          Close ✕
        </button>
        <div className="flex flex-row w-full h-full pl-20 py-15 text-white">
          <img
            src={item.src}
            alt={item.name}
            className="w-64 rounded-xl -translate-y-1/2 -translate-x-10 object-contain"
          />
          <div className="flex flex-col">
            <h2 className="text-4xl font-bold mb-6">{item.name}</h2>
            <p className="mb-6 opacity-80">{item.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
