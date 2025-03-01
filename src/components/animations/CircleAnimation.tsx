import { motion } from "motion/react";


// Visuals
const CircleComponent = ({ variants, currentVariant }) => (
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
  displayName: "Circle",
  phases: [
    {
      name: "inhale",
      transform: "scale(1.5)",
    },
    {
      name: "holdInhale",
      transform: "scale(1.5)",
    },
    {
      name: "exhale",
      transform: "scale(1)",
    },
    {
      name: "holdExhale",
      transform: "scale(1)",
    },
  ],
  component: CircleComponent,
};

export default CircleAnimation