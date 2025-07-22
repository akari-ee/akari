import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { BasePhoto } from "~/types/base";

function Carousel({ items }: { items: BasePhoto[] }) {
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!carousel.current) return;

    setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth + 50);
  }, [carousel]);

  return (
    <div className="w-full overflow-hidden">
      <motion.div
        ref={carousel}
        drag="x"
        whileDrag={{ scale: 0.95 }}
        dragElastic={0.2}
        dragConstraints={{ right: 0, left: -width }}
        dragTransition={{ bounceDamping: 30 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex will-change-transform cursor-grab active:cursor-grabbing"
      >
        {items.map((item, index) => {
          return (
            <motion.div className="min-w-[20rem] min-h-[25rem] p-2">
              <img
                src={item.url}
                width={400}
                height={400}
                alt="img"
                className="w-full h-full object-cover pointer-events-none rounded-md"
                loading="lazy"
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default Carousel;
