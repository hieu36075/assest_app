import { motion } from "framer-motion";
import { MdOutlineArrowDownward } from "react-icons/md";
import type { CharacterItem } from "../../features/product/types";
import CharacterModalMobile from "./CharacterModalMobile";

interface DetailsModalProps {
  item: CharacterItem | null;
  onClose: () => void;
}
const DetailsProduct = ({ item, onClose }: DetailsModalProps) => {
  return (
    <CharacterModalMobile onClose={onClose}>
      <div className="p-4 overflow-y-auto flex-grow py-10">
        <MdOutlineArrowDownward
          onClick={onClose}
          className=" absolute top-4 left-4 cursor-pointer"
          size={24}
        />
        <motion.h1
          className="text-center text-3xl text-transparent  bg-clip-text bg-gradient-to-br from-pink-300 -from-15% to-blue-300 mb-20"
          style={{
            backgroundSize: "200% 200%",
            backgroundPosition: "0% 50%",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          So, this is the best offer especcially for you!
        </motion.h1>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold mb-2">{item?.name}</h2>
            <div className="h-[1px] w-full bg-gray-200 my-2"></div>
            <label className="font-semibold text-gray-500">Desciprtion</label>
            <p className="">{item?.description}</p>
            <div className="h-[1px] w-full bg-gray-200 my-2"></div>
            <label className="font-semibold text-gray-500">Dua Date</label>
            <p>20/12/2022</p>
          </div>
          <div>
            <img
              src={item?.src}
              alt={item?.name}
              className="w-32 h-32 object-cover rounded-full"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-auto my-6 mx-auto">
        <button className="px-4 py-2 bg-black text-white rounded-full shadow-md">
          YES, INSURE
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white text-black rounded-full shadow-md cursor-pointer hover:opacity-50"
        >
          NOT NOW
        </button>
      </div>
    </CharacterModalMobile>
  );
};

export default DetailsProduct;
