import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperCore } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { FreeMode, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { CharacterItem } from "../../features/product/types";
import DetailsProduct from "./DetailsProduct";

interface Props {
  data: CharacterItem[];
  type?: "normal" | "infinity";
}

export default function CharacterCarouselMobile({
  data,
  type = "normal",
}: Props) {
  const [currentItem, setCurrentItem] = useState<CharacterItem | null>(null);
  const swiperRef = useRef<SwiperCore | null>(null);
  const handleClick = (item: CharacterItem) => {
    setCurrentItem(item);
  };
  const handleTransform = useCallback(() => {
    if (!swiperRef.current && type === "infinity") return;
    swiperRef.current?.slides?.forEach((slide: HTMLElement) => {
      const slideRect = slide.getBoundingClientRect();
      if (!swiperRef.current) return;
      const swiperRect = swiperRef.current.el.getBoundingClientRect();

      const slideCenter = slideRect.left + slideRect.width / 2;
      const swiperCenter = swiperRect.left + swiperRect.width / 2;

      const offset = swiperCenter - slideCenter;
      const offsetRatio = offset / swiperRect.width;

      const scaleNormal = Math.max(0.8, 1 - Math.abs(offsetRatio) * 0.5);

      const scaleInfinity = 1 - Math.abs(offsetRatio) * 0.1;

      const scale = type === "normal" ? scaleNormal : scaleInfinity;

      const translateZ = -Math.abs(offsetRatio) * 80;

      const transformStr = `
      perspective(800px)
      translateZ(${translateZ}px)
       scale(${scale})
    `;

      if (slide.style.transform !== transformStr) {
        slide.style.transform = transformStr;
        slide.style.transition = "transform 0.1s ease-out";
        if (type === "normal") {
          slide.style.zIndex = `${Math.round(scale * 100)}`;
        } else {
          slide.style.zIndex = `${-Math.round(offset)}`;
        }
      }
    });
  }, [type]);

  useEffect(() => {
    let frameId: number;

    const loop = () => {
      handleTransform();
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [handleTransform]);

  return (
    <div className="flex w-screen h-64 overflow-hidden [perspective:1000px]">
      <Swiper
        className={`${type === "normal" ? "w-full" : "!w-dvh"} h-full`}
        slidesPerView="auto"
        spaceBetween={type === "infinity" ? -100 : -40}
        initialSlide={data.length - 1}
        centeredSlides
        centeredSlidesBounds={type === "normal"}
        grabCursor
        loop={type === "normal"}
        freeMode={type === "infinity"} 
        slideToClickedSlide={type === "normal"} 
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          handleTransform();
        }}
        onProgress={handleTransform}
        onSlideChange={handleTransform}
        onTouchMove={handleTransform}
        modules={[FreeMode, Mousewheel]}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 0.5,
          releaseOnEdges: true,
        }}
      >
        {data.map((item, idx) => (
          <SwiperSlide
            key={idx}
            className="!w-auto px-2 py-4 [transform-style:preserve-3d] [backface-visibility:hidden] relative"
            onClick={() => handleClick(item)}
          >
            <div
              className={`w-64 h-full transition-all duration-500 ease-in-out flex flex-col text-center text-white rounded-2xl ${
                type === "normal" ? "" : "rotate-y-40"
              }`}
              style={{ backgroundColor: item.bgColor, zIndex: idx }}
            >
              <img
                className="h-full w-full object-contain pointer-events-none select-none"
                draggable={false}
                src={item.src}
                alt={item.name}
              />

              <span className={`${type !== "normal" && "hidden"}`}>
                {item.name}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <AnimatePresence>
        {currentItem && (
          <DetailsProduct
            item={currentItem}
            onClose={() => setCurrentItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
