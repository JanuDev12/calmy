import type { Animation, AnimationProps } from "@/types";
import { motion } from "motion/react";


const WaveComponent = ({ variants, currentVariant }: AnimationProps) => (
  <motion.div
    className="mx-auto h-32 w-full bg-blue-300"
    variants={variants}
    animate={currentVariant}
    initial={{ transform: "translateY(0)" }}
    transition={{ type: "tween" }}
    style={{ originY: 0.5 }}
  />
);

const WaveAnimation: Animation = {
  id: "wave",
  name: "Wave",
  phases: {
    inhale: "translateY(25px)",
    holdInhale: "translateY(25px)",
    exhale: "translateY(0)",
    holdExhale: "translateY(0)",
  },
  component: WaveComponent,
};

export default WaveAnimation;