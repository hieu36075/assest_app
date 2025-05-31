import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCard } from "./ProductCard";
import type { CharacterItem } from "./types";

interface ProductCarouselProps {
  data: CharacterItem[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  imgRefs: React.MutableRefObject<(HTMLImageElement | null)[]>;
  onCardClick: (item: CharacterItem, index: number) => void;
}

export function ProductCarousel({
  data,
  activeIndex,
  setActiveIndex,
  imgRefs,
  onCardClick,
}: ProductCarouselProps) {
  return (
    <Swiper
      grabCursor
      slidesPerView={4}
      spaceBetween={15}
      initialSlide={0}
      onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
    >
      {data.map((item, index) => (
        <SwiperSlide key={index} className="!w-32 lg:!w-64 rounded-3xl  z-0">
          <ProductCard
            item={item}
            index={index}
            activeIndex={activeIndex}
            imgRef={(el) => (imgRefs.current[index] = el)}
            onClick={() => onCardClick(item, index)}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
