import { VolumeOff } from 'lucide-react';
import { Button } from './ui/button';

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

type Phase = {
  name: string;
  duration: number;
  transform: string;
};

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
const PHASE_INDEX = new Map(PHASES.map((phase, index) => [phase.name, index]));

function getNextPhase(currentPhase: number): number {
  let i = 0;
  let nextPhase = currentPhase;

  // Loop for skip to the next phase if its 0ms
  do {
    nextPhase = (nextPhase + 1) % PHASES.length;
    i++;
    if (i > PHASES.length) {
      console.log("Infnite Loop detected");
    }
  } while (PHASES[nextPhase].duration === 0);

  return nextPhase;
}

const formatTime = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};


function BreathingApp() {


     // Initial Phase (inhale)
      const [phase, setPhase] = useState<Phase["name"]>(PHASES[0].name);
    
      const [isRunning, setIsRunning] = useState(false);
      const timerRef = useRef(0);
      const [timer, setTimer] = useState(0);
      const timerInterval = useRef(0)
    
      // Creating animations for each phase
      const animationVariants = useMemo(() => {
        return PHASES.reduce((variants, config) => {
          variants[config.name] = {
            transform: config.transform,
            // Motion expects seconds
            transition: { duration: config.duration / 1000 },
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
    
        const { duration } = PHASES[currentPhase];
    
        timerRef.current = setTimeout(() => {
          const nextPhase = getNextPhase(currentPhase);
          setPhase(PHASES[nextPhase].name);
        }, duration);
    
        return () => {
          if (timerRef.current) clearTimeout(timerRef.current);
        };
      }, [phase, isRunning]);

      useEffect(() => {
        if (isRunning) {
            timerInterval.current = setInterval(() => {
                setTimer(prev => prev + 1000);
            }, 1000);
        }else {
            if (timerRef.current) clearInterval(timerInterval.current)
        }

        return () => {
    if (timerInterval.current) clearInterval(timerInterval.current);
  };
      }, [isRunning])



  return (
    <>
      <div className="relative w-full h-[250px] border-[1.5px] flex border-black/8 rounded-xl bg-black/1  justify-center items-center overflow-hidden">
        <div className="absolute flex top-3 left-4 text-sm">
          {formatTime(timer)}
        </div>
        <div className="absolute flex gap-3 top-3 right-4">
          <VolumeOff size={18} />
          <VolumeOff size={18} />
        </div>

        {/*  SELECT ANIMATION */}
        {/* <div className=" w-full h-full bg-amber-300"></div> */}
        <motion.div
          className="mx-auto size-32 rounded-full bg-blue-300"
          variants={animationVariants}
          animate={isRunning ? phase : undefined}
          initial={{ transform: "scale(1)" }}
          transition={{ type: "tween" }}
        ></motion.div>

        <div className="absolute bottom-3 right-4">
          <VolumeOff size={18} />
        </div>
      </div>

      <div className="w-xl flex justify-between">
        <Button
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
        </Button>
        <span>Fase actual de la respiracion: {phase}</span>
      </div>
    </>
  );
}

export default BreathingApp