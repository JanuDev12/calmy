
import './App.css'
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from 'react';

type Phase = {
  name: string;
  duration: number;
  transform: string;
}

// Define the phases of breathing
const PHASES: Phase[] = [
  {
    name: "inhale",
    duration: 5000,
    transform: "scale(1.5)",
  },
  {
    name: "inhaleHold",
    duration: 0,
    transform: "scale(1.5)",
  },
  {
    name: "exhale",
    duration: 5000,
    transform: "scale(1)",
  },
  {
    name: "exhaleHold",
    duration: 0,
    transform: "scale(1)",
  },
];


// Creating map for more efficiency
const PHASE_INDEX = new Map(
  PHASES.map((phase, index) => [phase.name, index])
);

function getNextPhase(currentPhase: number): number {
  let i = 0;
  let nextPhase = currentPhase;

  // Loop for skip to the next phase if its 0ms
  do {
    nextPhase = (nextPhase + 1) % PHASES.length;
    i++
    if(i > PHASES.length) {
      console.log("Infnite Loop detected")
    }
  } while (PHASES[nextPhase].duration === 0);
    
    return nextPhase;
  }

function App() {

  // Initial Phase (inhale)
  const [phase, setPhase] = useState<Phase['name']>(PHASES[0].name);


  // Creating animations for each phase
  const animationVariants = useMemo(() => {
    return PHASES.reduce((variants, config) => {
      variants[config.name] = {
        transform: config.transform,
        // Motion expects seconds
        transition: { duration: config.duration / 1000},
      };
      return variants;
    }, {});
  }, []);

 

  // useEffect for transitioning to each phase of breathing
  useEffect(() => {
    const currentPhase = PHASE_INDEX.get(phase) ?? -1;
    if (currentPhase === -1) return;

    if(PHASES[currentPhase].duration === 0) {
      // If the current phase is 0ms skip to the next

      const nextPhase = getNextPhase(currentPhase);
       setPhase(PHASES[nextPhase].name);
    } else {
      // Timer for calculate when transitioning to nextPhase

      const timer = setTimeout(() => {
        const nextPhase = getNextPhase(currentPhase);
        setPhase(PHASES[nextPhase].name);
      }, PHASES[currentPhase].duration);
      return () => clearTimeout(timer);
    }
    
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
