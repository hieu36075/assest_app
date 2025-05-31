import { motion } from "framer-motion";

export function Header() {
  return (
    <div className="flex sticky top-0 w-full justify-between px-20 py-5">
      <div className="flex gap-2 items-center text-white">
        <span>VICTORIA's</span>
        <div className="h-1/2 w-[1px] bg-gray-400 "></div>
        <span className="flex flex-col">
          <span className="text-xs font-bold ">Beauty</span>
          <span className="text-xs text-gray-500">Product</span>
        </span>
      </div>
      <div className="flex gap-4 items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="w-[60px] h-[60px] bg-yellow-300 text-black text-2xl font-bold flex items-center justify-center shadow-lg"
          style={{
            borderRadius: "100% 63% 82% 69% / 94% 90% 73% 62% ",
          }}
        >
          +
        </motion.button>
        <span className="whitespace-pre-line text-white">
          On Sale <p>Now</p>
        </span>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        className="w-[60px] h-[60px] bg-red-300 text-black text-2xl font-bold flex items-center justify-center shadow-lg"
        style={{
          borderRadius: "100% 63% 82% 69% / 94% 90% 73% 62% ",
        }}
      >
        +
      </motion.button>
    </div>
  );
}
