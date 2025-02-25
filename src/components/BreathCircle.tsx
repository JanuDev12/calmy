import { motion, useAnimate } from "motion/react";
import { useEffect } from "react";


const Breathcircle =  ({
    inhaleDuration = 4, 
    holdDuration = 7,
    exhaleDuration = 8,
    initialScale = 1,
    inhaleScale = 1.5,
    size = 150
}) => {
 
    const totalDuration = inhaleDuration + holdDuration + exhaleDuration;

    const times = [0, inhaleDuration / totalDuration, (inhaleDuration + holdDuration) / totalDuration, 1, ]

  return (
    <motion.div
      className="mx-auto size-32 rounded-full border-2 bg-blue-300"
      animate={{ scale: [initialScale, inhaleScale, inhaleScale, initialScale]}}
      transition={{
        duration: totalDuration,
        times,
        repeat: Infinity
      }}
      style={{width: size, height: size}}
    ></motion.div>
  );
}

export default Breathcircle