import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import { PiPhoneCall } from "react-icons/pi";
import CharacterModalMobile from "./CharacterModalMobile";
interface NerbyServiceProps {
  isOpen?: boolean;
  onClose: () => void;
}

const weekList = [
  {
    day: "Monday",
    date: "22",
    month: "February",
  },
  {
    day: "Tuesday",
    date: "23",
    month: "February",
  },
  {
    day: "Wednesday",
    date: "24",
    month: "February",
  },
  {
    day: "Thursday",
    date: "25",
    month: "February",
  },
  {
    day: "Friday",
    date: "26",
    month: "February",
  },
  {
    day: "Saturday",
    date: "27",
    month: "February",
  },
  {
    day: "Sunday",
    date: "28",
    month: "February",
  },
];

const locations = [
  { name: "Spa 1", label: "24 Milter", top: "30%", left: "20%" },
  { name: "Spa 3", label: "52 Ocean", top: "50%", left: "40%" },
];

const myLocations = {
  name: "My location",
  label: "17 River",
  top: "60%",
  left: "10%",
};

const NerbyService = ({ onClose }: NerbyServiceProps) => {
  const DEFAULT_TITLE = "February 22 in the nearest service, okay?";
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [name, setName] = useState<string | null>(null);
  const [date, setDate] = useState("February 22");
  const [currentDateIndex, setCurrentDateIndex] = useState<number | null>(0);
  const [filterLocations, setFilterLocations] = useState(locations);
  const [step, setStep] = useState(0);

  const onClickLocation = (name: string) => {
    if (step === 1) return;
    setName((prev) => (prev === name ? null : name));
  };

  const onClickTime = (date: string, month: string, index: number) => {
    if (currentDateIndex === index) return null;
    setCurrentDateIndex(index);
    setDate(`${date} ${month}`);
  };

  const handleCloseFinal = () => {
    setStep(0);
    setFilterLocations(locations);
    onClose();
    setName(null);
    setTitle(DEFAULT_TITLE);
    setCurrentDateIndex(0);
    setDate("February 22");
  };
  useEffect(() => {
    if (step === 0) return;
    if (name === null) {
      return setFilterLocations(locations);
    } else {
      setFilterLocations((prev) => {
        const newLocations = prev.filter((loc) => loc.name === name);
        return [...newLocations, myLocations];
      });
    }
  }, [name, step]);

  useEffect(() => {
    if (name) {
      setTitle(`${date} in the nearest service, okay?`);
      if (date && name) {
        setTitle(`${date} in the ${name}, okay?`);
      }
    } else {
      setTitle(DEFAULT_TITLE);
    }
  }, [name, date]);

  return (
    <CharacterModalMobile onClose={handleCloseFinal}>
      <div className="flex relative flex-col h-full py-15 gap-3">
        <MdOutlineArrowBack
          className="absolute top-4 left-4"
          size={22}
          onClick={handleCloseFinal}
        />
        <motion.h1
          className="text-center h-10 text-3xl text-transparent  bg-clip-text bg-gradient-to-br from-pink-300  to-blue-300 mb-5"
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
          {title}
        </motion.h1>
        <div className="flex gap-4 justify-center items-center">
          {weekList.map((item, index) => (
            <div
              className={`flex flex-col ${
                currentDateIndex === index ? "bg-white shadow-2xl" : ""
              } h-14 w-8 rounded-full justify-center items-center`}
              key={index}
              onClick={() => onClickTime(item.date, item.month, index)}
            >
              <p>{item.day.toUpperCase().slice(0, 1)}</p>
              <p className="">{item.date}</p>
            </div>
          ))}
        </div>
        <div className="flex relative">
          <div className="relative">
            <img
              className=" w-full h-96 opacity-40"
              src="https://t4.ftcdn.net/jpg/03/38/37/73/360_F_338377354_1Y6oyGrvaae2kqY3YS07b6X4NDKZntne.jpg"
              alt=""
            />
            {filterLocations.map((loc, i) => (
              <div
                key={i}
                className={`absolute flex flex-col items-center cursor-pointer ${
                  name === loc.name ? "z-10" : "z-0"
                }`}
                style={{
                  top: loc.top,
                  left: loc.left,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => onClickLocation(loc.name)}
              >
                <div className="text-sm text-black/60 mb-1">{loc.label}</div>
                <div
                  className={`rounded-full px-2 py-0.5 text-white bg-black `}
                >
                  {loc.name}
                </div>
                <div className="w-[2px] h-2 bg-black"></div>
                <div className="w-3 h-3 bg-black rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            ))}

            <svg
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {step === 1 &&
                name &&
                locations
                  .filter((loc) => loc.name === name)
                  .map((loc, i) => {
                    const from = loc;
                    const to = myLocations;
                    if (!to) return null;
                    return (
                      <line
                        key={i}
                        x1={from.left}
                        y1={from.top}
                        x2={to.left}
                        y2={to.top}
                        stroke="#000"
                        strokeWidth="1"
                        strokeDasharray="4"
                      />
                    );
                  })}
            </svg>
          </div>
          <motion.img
            className="w-80 h-80 absolute top-0 -right-1/2 object-cover"
            initial={{ right: "-50%" }}
            animate={
              step === 1
                ? { right: "-100%" }
                : name !== null
                ? { right: "-20%" }
                : { right: "-50%" }
            }
            transition={{ duration: 0.5, ease: "easeInOut" }}
            src="https://static.vecteezy.com/system/resources/previews/048/051/786/non_2x/isolated-spa-products-on-transparent-background-free-png.png"
            alt=""
          />
        </div>
        {name !== null && (
          <>
            {step === 0 ? (
              <div className="flex gap-4 w-full items-center justify-center mt-4 z-9999">
                <button
                  className="px-6 rounded-full py-2 bg-black text-white shadow-2xl"
                  onClick={() => setStep(1)}
                >
                  Yes
                </button>
                <button className="px-6 rounded-full py-2 bg-white text-black shadow-2xl">
                  no
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col z-99999">
                  <div className="flex gap-4 items-center justify-center">
                    <div className="relative flex flex-col w-12 h-24 rounded-full">
                      <img
                        className="w-full h-full object-cover rounded-full"
                        src="https://cdn.pixabay.com/photo/2022/03/11/06/14/indian-man-7061278_640.jpg"
                        alt=""
                      />
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 bg-gray-200/50 rounded-full">
                        <PiPhoneCall className="text-white" size={18} />
                      </div>
                    </div>
                    <div className="flex flex-col ">
                      <p className="uppercase text-black text-xl font-semibold">
                        John <span className="font-bold">DOWS</span>
                      </p>
                      <p className=" uppercase text-lg text-gray-500 font-semibold">
                        JDOW's Service Mechain
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center">
                    <button
                      className="px-6 rounded-full py-2 bg-black text-white shadow-2xl "
                      onClick={handleCloseFinal}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
        <div className="fixed bottom-0 left-0 w-full overflow-hidden leading-none z-0 ">
          <svg
            className="relative block w-[calc(200%+1.3px)] h-26 animate-wave"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.39C197.86,82.51,93.74,89.52,0,63.69V120H1200V0C1074.86,26.88,962,56.39,821.58,56.39,681.73,56.39,543.24,26.88,321.39,56.39Z"
              fill="#E0F7FA"
            />
          </svg>
          <svg
            className="absolute bottom-1 w-[200%] h-24 animate-wave opacity-70"
            style={{ animationDuration: "15s" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,66.39C197.86,92.51,93.74,99.52,0,73.69V120H1200V0C1074.86,36.88,962,66.39,821.58,66.39,681.73,66.39,543.24,36.88,321.39,66.39Z"
              fill="#B2EBF2"
            />
          </svg>
        </div>
      </div>
    </CharacterModalMobile>
  );
};

export default NerbyService;
