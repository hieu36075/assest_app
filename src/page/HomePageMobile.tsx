import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useAnimationFrame,
} from "framer-motion";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { TbArrowNarrowDown } from "react-icons/tb";
import type { CharacterItem } from "../features/product/types";
import CharacterCarouselMobile from "./component/CharacterCarouselMobile";
import CharacterModalMobile from "./component/CharacterModalMobile";
import DonutChart from "./component/Chart";
import NerbyService from "./component/NerbyService";

const data: CharacterItem[] = [
  {
    src: "https://static.vecteezy.com/system/resources/previews/047/307/761/non_2x/isolated-spa-wellness-products-transparent-free-png.png",
    bgColor: "#6AC0E6",
    name: "Sadness",
    description: "Represents the emotion of sadness",
  },
  {
    src: "https://png.pngtree.com/png-clipart/20231018/original/pngtree-spa-cosmetic-products-png-image_13355902.png",
    bgColor: "#91D35B",
    name: "Disgust",
    description: "Represents the emotion of disgust",
  },
  {
    src: "https://static.vecteezy.com/system/resources/previews/048/051/786/non_2x/isolated-spa-products-on-transparent-background-free-png.png",
    bgColor: "#B68CF1",
    name: "Fear",
    description: "Represents the emotion of fear",
  },
  {
    src: "https://png.pngtree.com/png-clipart/20231018/original/pngtree-spa-cosmetic-products-png-image_13355902.png",
    bgColor: "#91D35B",
    name: "Disgust",
    description: "Represents the emotion of disgust",
  },
  {
    src: "https://static.vecteezy.com/system/resources/previews/047/307/761/non_2x/isolated-spa-wellness-products-transparent-free-png.png",
    bgColor: "#6AC0E6",
    name: "Sadness",
    description: "Represents the emotion of sadness",
  },
  {
    src: "https://static.vecteezy.com/system/resources/previews/048/051/786/non_2x/isolated-spa-products-on-transparent-background-free-png.png",
    bgColor: "#B68CF1",
    name: "Fear",
    description: "Represents the emotion of fear",
  },
  {
    src: "https://png.pngtree.com/png-clipart/20231018/original/pngtree-spa-cosmetic-products-png-image_13355902.png",
    bgColor: "#91D35B",
    name: "Disgust",
    description: "Represents the emotion of disgust",
  },
];

const HomePageMobile = () => {
  const [percent, setPercent] = useState(0);
  const [isTry, setIsTry] = useState(false);
  const [isTrading, setIsTrading] = useState(false);
  const controls = useAnimationControls();
  const [typeCarousel, setTypeCarousel] = useState<"normal" | "infinity">(
    "normal"
  );
  useEffect(() => {
    let startTime: number | null = null;
    let frameId: number;
    const duration = 3000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const newPercent = Math.min(100, (progress / duration) * 100);
      setPercent((prev) =>
        Math.abs(prev - newPercent) > 0.5 ? newPercent : prev
      );

      if (newPercent < 100) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);
  useEffect(() => {
    controls.start({
      scaleY: [1, 1.6, 1.2, 0.8, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  }, [controls]);

  const waveConfigs = useMemo(() => {
    return [...Array(5)].map(() => ({
      phaseOffset: Math.random() * 100,
      frequency: 0.08 + Math.random() * 0.05,
      amplitude: 8 + Math.random() * 5,
      opacity: 0.2 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <>
      <div className="flex relative flex-col h-dvh bg-white overflow-hidden ">
        <div className="relative h-5 mb-8 w-full">
          <div className="absolute top-0 left-1/2 -translate-x-7 w-1/5 rounded-b-full mx-auto h-12 bg-blue-200/50 overflow-hidden z-10" />
          <div className="absolute top-0 left-1/2 w-1/5 rounded-b-full mx-auto h-12 bg-pink-200 overflow-hidden z-20" />
        </div>

        <motion.h1
          className="
        text-3xl font-bold text-transparent bg-clip-text text-center mx-auto mb-2 max-w-[66%]
        bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300
      "
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
          What about insuring your new car?
        </motion.h1>

        <div className="flex gap-6 w-full justify-center my-5">
          <button
            className="px-3 py-1 rounded-full uppercase font-semibold text-base shadow-md cursor-pointer hover:opacity-60"
            onClick={() => {
              setIsTry(!isTry);
              setTimeout(() => {
                if (typeCarousel === "normal") {
                  setTypeCarousel("infinity");
                } else {
                  setTypeCarousel("normal");
                }
              }, 100);
            }}
          >
            Let's try
          </button>
          <button
            className="px-3 py-1 rounded-full uppercase font-semibold text-base shadow-md cursor-pointer hover:opacity-60"
            onClick={() => setIsTrading(!isTrading)}
          >
            Trading View
          </button>
        </div>

        <div className="h-auto mb-6">
          <CharacterCarouselMobile type={typeCarousel} data={data} />
        </div>
        <div className="flex gap-4 px-4 ">
          <div className="h-32 w-16 overflow-hidden rounded-full">
            <img
              className="w-full h-full object-cover "
              src="https://www.shutterstock.com/image-photo/side-view-portrait-young-woman-600nw-2512391747.jpg"
            />
          </div>
          <div className="flex relative overflow-hidden rounded-full bg-black">
            <div className="relative h-16 w-16">
              {waveConfigs.map((config, i) => (
                <MemoSmoothWaveAudio key={i} {...config} />
              ))}
            </div>
            <div className="absolute flex flex-col bottom-8 left-1/2 -translate-x-1/2 text-white text-sm font-bold">
              <span>{Math.round(percent)}%</span>
              <span>Insumed</span>
            </div>
          </div>
          <div className="h-22 w-22 mt-auto flex flex-col items-center overflow-hidden rounded-full shadow-2xl justify-center">
            <span>{Math.round(percent)}%</span>
            <span>ANALYSED</span>
          </div>
        </div>
        <div className="fixed -bottom-1 -right-30 w-full  leading-none z-0 h-10 -rotate-10">
          <svg
            className="relative block w-[calc(200%+1.3px)] h-16 animate-wave text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.39C197.86,82.51,93.74,89.52,0,63.69V120H1200V0C1074.86,26.88,962,56.39,821.58,56.39,681.73,56.39,543.24,26.88,321.39,56.39Z"
              fill="currentColor"
            />
          </svg>
          <svg
            className="absolute bottom-1 w-[200%] h-16 animate-wave opacity-70 text-gray-200 "
            style={{ animationDuration: "15s" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,66.39C197.86,92.51,93.74,99.52,0,73.69V120H1200V0C1074.86,36.88,962,66.39,821.58,66.39,681.73,66.39,543.24,36.88,321.39,66.39Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
      <AnimatePresence>
        {isTry && <NerbyService onClose={() => setIsTry(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {isTrading && (
          <>
            <CharacterModalMobile onClose={() => setIsTrading(false)}>
              <div className="flex relative flex-col items-center  h-full">
                <TbArrowNarrowDown
                  className="absolute top-4 left-4"
                  size={22}
                  onClick={() => setIsTrading(!isTrading)}
                />
                <motion.h1
                  className="text-center mt-10 text-3xl text-transparent  bg-clip-text bg-gradient-to-br from-pink-300 -from-15% to-blue-300 mb-15"
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
                  Trading View
                </motion.h1>
                <DonutChart />
              </div>
            </CharacterModalMobile>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HomePageMobile;

interface SmoothWaveProps {
  phaseOffset?: number;
  frequency?: number;
  amplitude?: number;
  color?: string;
  opacity?: number;
}

const SmoothWaveAudio = ({
  phaseOffset = 0,
  frequency = 0.1,
  amplitude = 10,
  color = "#a855f7",
  opacity = 0.5,
}: SmoothWaveProps) => {
  const ref = useRef<SVGPathElement>(null);

  useAnimationFrame((time) => {
    const newT = time / 100;
    if (ref.current) {
      ref.current.setAttribute("d", wavePath(newT));
    }
  });

  const wavePath = (t: number) => {
    const points = [];
    for (let x = 0; x <= 100; x++) {
      const y = 20 + amplitude * Math.sin(frequency * (x + t + phaseOffset));
      points.push(`${x},${y}`);
    }
    return `M0,30 ` + points.map((p) => `L${p}`).join(" ");
  };

  return (
    <svg viewBox="0 0 100 40" className="w-full h-full absolute">
      <path
        ref={ref}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={opacity}
      />
    </svg>
  );
};

export const MemoSmoothWaveAudio = memo(SmoothWaveAudio);
