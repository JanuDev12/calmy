import type { AnimationProps } from "@/types";
import { motion } from "motion/react";


const WaveComponent = ({ variants, currentVariant }) => (
  <motion.div
    className="mx-auto h-32 w-full bg-blue-300"
    variants={variants}
    animate={currentVariant}
    initial={{ transform: "translateY(0)" }}
    transition={{ type: "tween" }}
    style={{ originY: 0.5 }}
  />
);

const WaveAnimation = {
  id: "wave",
  displayName: "Wave",
  phases: [
    {
      name: "inhale",
      duration: 4000,
      transform: "translateY(25px)",
    },
    {
      name: "holdInhale",
      duration: 7000,
      transform: "translateY(25px)",
    },
    {
      name: "exhale",
      duration: 8000,
      transform: "translateY(0)",
    },
    {
      name: "holdExhale",
      duration: 0,
      transform: "translateY(0)",
    },
  ],
  component: WaveComponent,
};

export default WaveAnimation;