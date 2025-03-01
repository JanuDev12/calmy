import type { AnimationProps } from "@/types";
import { motion } from "motion/react";


// Visuals
const CircleComponent = ({ variants, currentVariant }: AnimationProps) => (
  <motion.div
    className="mx-auto size-32 rounded-full bg-blue-300 flex justify-center items-center"
    variants={variants}
    animate={currentVariant}
    initial={{ transform: "scale(1)" }}
    transition={{ type: "tween" }}
  >
    <div className="absolute">Inhale</div>
  </motion.div>
);

// Config

const CircleAnimation = {
  id: "circle",
  name: "Circle",
  phases: {
    inhale: "scale(1.5)",
    holdInhale: "scale(1.5)",
    exhale: "scale(1)",
    holdExhale: "scale(1)",
  },
  component: CircleComponent,
};

export default CircleAnimation