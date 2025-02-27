
import './App.css'
import { motion } from "motion/react";
import {useEffect, useMemo, useRef, useState } from 'react';

type Phase = {
  name: string;
  duration: number;
  transform: string;
}

// Define the phases of breathing
const PHASES: Phase[] = [
  {
    name: "inhale",
    duration: 4000,
    transform: "scale(1.5)",
  },
  {
    name: "inhaleHold",
    duration: 7000,
    transform: "scale(1.5)",
  },
  {
    name: "exhale",
    duration: 8000,
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

  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(0);


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


  const resetBreathing = () => {
    if (isRunning) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase(PHASES[0].name);
    }
    setIsRunning(false);
  };
 

  // useEffect for transitioning to each phase of breathing
  useEffect(() => {
    if (!isRunning) return;

    const currentPhase = PHASE_INDEX.get(phase)!;

    const {duration} = PHASES[currentPhase];

    timerRef.current = setTimeout(() => {
       const nextPhase = getNextPhase(currentPhase);
       setPhase(PHASES[nextPhase].name);
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    
  }, [phase, isRunning]);

  return (
    <>
      <div className="w-full h-screen bg-amber-100 flex flex-col justify-center items-center">
        <div className="w-2xl h-1/2 border-2 border-red-300 flex items-center">
          <motion.div
            className="mx-auto size-32 rounded-full border-2 bg-blue-300"
            variants={animationVariants}
            animate={isRunning ? phase : undefined}
            initial={{ transform: "scale(1)" }}
            transition={{ type: "tween" }}
          ></motion.div>
        </div>
        <div className="w-xl mt-20 flex justify-between">
          <button
            className="cursor-pointer"
            onClick={() => {
              if (isRunning) {
                resetBreathing();
              } else {
                setIsRunning(true);
              }
            }}
          >
            {isRunning ? "Pause" : "Play"}
          </button>
          <span>Fase actual de la respiracion: {phase}</span>
        </div>
      </div>
    </>
  );
}

export default App
