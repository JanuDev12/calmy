
import './App.css'
import { motion } from "motion/react";
import Breathcircle from './components/Breathcircle';
import { useEffect, useMemo, useState } from 'react';

// Define the phases of breathing
const PHASES = [
  {
    name: "inhale",
    duration: 4000,
    transform: "scale(1.5)",
  },
  {
    name: "inhaleHold",
    duration: 4000,
    transform: "scale(1.5)",
  },
  {
    name: "exhale",
    duration: 4000,
    transform: "scale(1)",
  },
  {
    name: "exhaleHold",
    duration: 4000,
    transform: "scale(1)",
  },
];


function App() {

  // Initial Phase on inhale
  const [phase, setPhase] = useState(PHASES[0].name);


  // Creating animations for each phase
  const animationVariants = useMemo(() => {
    return PHASES.reduce((variants, config) => {
      variants[config.name] = {
        transform: config.transform,
        // Motion expects seconds
        transition: { duration: config.duration / 1000, ease: "lineal"},
      };
      return variants;
    }, {});
  }, []);


  // useEffect for transitioning to each phase of breathing
  useEffect(() => {
    const currentPhase = PHASES.findIndex(
      (config) => config.name === phase
    );
    const nextPhase = (currentPhase + 1) % PHASES.length;
    // Timer for calculate when transitioning to nextPhase
    const timer = setTimeout(() => {
      setPhase(PHASES[nextPhase].name);
    }, PHASES[currentPhase].duration);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <>
      <div className="w-full h-screen bg-amber-100 flex flex-col justify-center items-center">
        <motion.div
          className="w-2xl h-1/2 border-2 border-red-300 flex items-center"
        >
          <motion.div
            className="mx-auto size-32 rounded-full border-2 bg-blue-300"
            variants={animationVariants}
            animate={phase}
            initial={{transform: "scale(1)" }}
            transition={{ease: 'linear'}}
          ></motion.div>
        </motion.div>
        <div className="w-xl mt-20 flex justify-between">
          <button className="cursor-pointer">Start</button>
          <button className="cursor-pointer">Pause</button>
          <span>Fase actual de la respiracion: {phase}</span>
        </div>
      </div>
    </>
  );
}

export default App
