import { motion, useAnimation, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface CharacterModalProps {
  onClose: () => void;
  children?: React.ReactNode;
}

const modalVariants: Variants = {
  hidden: { y: "100%", opacity: 0, transition: { duration: 0.3 } },
  visible: {
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 1,
    },
  },
  exitDown: {
    y: "100%",
    opacity: 0,
    transition: { duration: 0.3 },
  },
  exitUp: {
    y: "-100%",
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

export default function CharacterModalMobile({
  onClose,
  children,
}: CharacterModalProps) {
  const controls = useAnimation();
  const [exitDirection, setExitDirection] = useState<"exitDown" | "exitUp">(
    "exitDown"
  );

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  const handleClose = async (direction: "exitDown" | "exitUp") => {
    setExitDirection(direction);
    await controls.start(direction);
    onClose();
  };
  

  return createPortal(
    <>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => handleClose("exitDown")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        style={{ pointerEvents: "auto" }}
      />

      <motion.div
        className="fixed inset-x-0 bottom-0 top-0 z-50 bg-light-blue rounded-t-xl shadow-lg flex flex-col"
        variants={modalVariants}
        initial="hidden"
        animate={controls}
        exit={exitDirection}
        drag="y"
        dragElastic={0.3}
        onDragEnd={(_, info) => {
          if (info.point.y > 450 || info.velocity.y > 800) {
            handleClose("exitDown");
          } else if (info.point.y < -100 || info.velocity.y < -300) {
            handleClose("exitUp");
          } else {
            controls.start("visible");
          }
        }}
        style={{ touchAction: "none" }}
      >
        {children}
      </motion.div>
    </>,
    modalRoot
  );
}
