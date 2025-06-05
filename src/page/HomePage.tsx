import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Header } from "../components/Header";
import { HeroSection, ProductCarousel, ProductModal } from "../features";
import type { CharacterItem } from "../features/product/types";
import useIsMobile from "../hook/useIsMobile";
import HomePageMobile from "./HomePageMobile";

const data: CharacterItem[] = [
  {
    src: "https://static.vecteezy.com/system/resources/previews/047/307/761/non_2x/isolated-spa-wellness-products-transparent-free-png.png",
    bgColor: "#6AC0E6",
    name: "Sadness",
    description: `Sadness is a natural emotional response to loss, disappointment, or difficult situations. 
    It often leads to introspection, reflection, and a temporary withdrawal from social activities. 
    Although it can feel overwhelming, sadness helps us process grief and understand our emotions more deeply, 
    ultimately contributing to emotional healing and growth.`,
  },
  {
    src: "https://png.pngtree.com/png-clipart/20231018/original/pngtree-spa-cosmetic-products-png-image_13355902.png",
    bgColor: "#91D35B",
    name: "Disgust",
    description: `Disgust is an emotional reaction that protects us from things perceived as harmful or offensive, 
    such as unpleasant tastes, smells, or behaviors. It plays an important role in maintaining hygiene and social boundaries, 
    signaling when something is potentially dangerous or morally unacceptable. Disgust often triggers avoidance or rejection.`,
  },
  {
    src: "https://static.vecteezy.com/system/resources/previews/048/051/786/non_2x/isolated-spa-products-on-transparent-background-free-png.png",
    bgColor: "#B68CF1",
    name: "Fear",
    description: `Fear is a primal emotion designed to alert us to danger and prepare our bodies for a fight-or-flight response. 
    It sharpens our senses, increases heart rate, and helps us respond quickly to threats. While fear can be unpleasant, 
    it is essential for survival and helps us avoid risky situations.`,
  },
  {
    src: "https://cdn-icons-png.flaticon.com/512/742/742751.png",
    bgColor: "#FFD93B",
    name: "Joy",
    description: `Joy is a feeling of great pleasure and happiness that arises from positive experiences, achievements, or relationships. 
    It inspires motivation, creativity, and a sense of connection with others. Joy contributes to overall well-being 
    and encourages us to seek out and savor life's meaningful moments.`,
  },
  {
    src: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
    bgColor: "#F44336",
    name: "Anger",
    description: `Anger is a strong emotional response to perceived injustice, frustration, or threat. 
    It can energize us to take action and set boundaries but can also lead to conflict if not managed properly. 
    Understanding and expressing anger in healthy ways is important for maintaining relationships and emotional balance.`,
  },
  {
    src: "https://static.vecteezy.com/system/resources/previews/047/307/761/non_2x/isolated-spa-wellness-products-transparent-free-png.png",
    bgColor: "#6AC0E6",
    name: "Sadness",
    description: `Sadness is a natural emotional response to loss, disappointment, or difficult situations. 
    It often leads to introspection, reflection, and a temporary withdrawal from social activities. 
    Although it can feel overwhelming, sadness helps us process grief and understand our emotions more deeply, 
    ultimately contributing to emotional healing and growth.`,
  },
  {
    src: "https://png.pngtree.com/png-clipart/20231018/original/pngtree-spa-cosmetic-products-png-image_13355902.png",
    bgColor: "#91D35B",
    name: "Disgust",
    description: `Disgust is an emotional reaction that protects us from things perceived as harmful or offensive, 
    such as unpleasant tastes, smells, or behaviors. It plays an important role in maintaining hygiene and social boundaries, 
    signaling when something is potentially dangerous or morally unacceptable. Disgust often triggers avoidance or rejection.`,
  },
  {
    src: "https://static.vecteezy.com/system/resources/previews/048/051/786/non_2x/isolated-spa-products-on-transparent-background-free-png.png",
    bgColor: "#B68CF1",
    name: "Fear",
    description: `Fear is a primal emotion designed to alert us to danger and prepare our bodies for a fight-or-flight response. 
    It sharpens our senses, increases heart rate, and helps us respond quickly to threats. While fear can be unpleasant, 
    it is essential for survival and helps us avoid risky situations.`,
  },
];

function HomePage() {
  const isMobile = useIsMobile();
  const BGURL =
    "https://calista.com.tr/media/532bmoz2/spa-nedir.jpg?rmode=max&width=500&height=265";
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<CharacterItem | null>(null);
  const [modalOrigin, setModalOrigin] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const imgRefs = useRef<Array<HTMLImageElement | null>>([]);
  const handleOpenModal = (item: CharacterItem, index: number) => {
    const img = imgRefs.current[index];
    if (img) {
      const rect = img.getBoundingClientRect();
      setModalOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setActiveItem(item);
    setModalOpen(true);
  };

  return (
    <>
      {isMobile ? (
        <>
          <HomePageMobile />
        </>
      ) : (
        <div
          className="relative h-screen flex flex-col bg-cover bg-center overflow-y-auto "
          style={{ backgroundImage: `url(${BGURL})` }}
        >
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />
          <Header />
          <div className="flex flex-col gap-5 md:gap-0 lg:gap-10">
            <HeroSection />
            <div className="flex h-40 lg:h-80 w-full lg:max-w-6xl xl:max-w-screen py-2 lg:py-10 mt-auto">
              <ProductCarousel
                data={data}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                imgRefs={imgRefs}
                onCardClick={handleOpenModal}
              />
            </div>
          </div>
          <AnimatePresence>
            {modalOpen && activeItem && (
              <ProductModal
                item={activeItem}
                origin={modalOrigin}
                onClose={() => setModalOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

export default HomePage;
