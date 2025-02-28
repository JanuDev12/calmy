import { Activity, Ear, Maximize2, VolumeOff, Wind } from 'lucide-react';
import { Button } from './ui/button';

import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { Phase } from '@/types';
import { animations } from './animations';

// Define the phases of breathing
/* const PHASES: Phase[] = [
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
 */
// Creating map for more efficiency
/* const PHASE_INDEX = new Map(PHASES.map((phase, index) => [phase.name, index]));
 */

const formatTime = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

type AnimationType = keyof typeof animations;

function BreathingApp() {

    const [selectedAnimation, setSelectedAnimation] = useState<AnimationType>("circle");
     // Initial Phase (inhale)
    const [phase, setPhase] = useState<string>(animations.circle.phases[0].name);
      const [isRunning, setIsRunning] = useState(false);

    // Timers
      const timerRef = useRef(0);
      const [timer, setTimer] = useState(0);
      const timerInterval = useRef(0)

    const currentAnimation = useMemo(() => animations[selectedAnimation], [selectedAnimation]);

    const PHASE_INDEX = useMemo(
      () => new Map(currentAnimation.phases.map((p, i) => [p.name, i])),
      [currentAnimation]
    );
    
      // Creating animations for each phase
      const animationVariants = useMemo(
        () =>
          /*  {
        return PHASES.reduce((variants, config) => {
          variants[config.name] = {
            transform: config.transform,
            // Motion expects seconds
            transition: { duration: config.duration / 1000 },
          };
          return variants;
        }, {}); */

          currentAnimation.phases.reduce(
            (acc, phase) => ({
              ...acc,
              [phase.name]: {
                transform: phase.transform,
                // Motion expects seconds
                transition: { duration: phase.duration / 1000 },
              },
            }),
            {}
          ),
        [currentAnimation]
      );
        
        
       
      
    
      const resetBreathing = () => {
        if (isRunning) {
          if (timerRef.current) clearTimeout(timerRef.current);
          if (timerInterval.current) clearInterval(timerInterval.current);
          setPhase(currentAnimation.phases[0].name);
          setTimer(0);
        }
        setIsRunning(false);
      };
    
      // useEffect for transitioning to each phase of breathing
      useEffect(() => {
        if (!isRunning) return;
    
        const currentPhase = PHASE_INDEX.get(phase)!;
    
        const { duration } = currentAnimation.phases[currentPhase];
    
        timerRef.current = setTimeout(() => {
          const nextPhase = getNextPhase(currentPhase);
          setPhase(currentAnimation.phases[nextPhase].name);
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


      
function getNextPhase(currentPhase: number): number {
  let i = 0;
  let nextPhase = currentPhase;

  // Loop for skip to the next phase if its 0ms
  do {
    nextPhase = (nextPhase + 1) % currentAnimation.phases.length;
    i++;
    if (i > currentAnimation.phases.length) {
      console.log("Infnite Loop detected");
    }
  } while (currentAnimation.phases[nextPhase].duration === 0);

  return nextPhase;
}



  return (
    <>
      <div className="relative w-full h-[250px] border-[1.5px] flex border-black/8 rounded-xl bg-black/1  justify-center items-center overflow-hidden">
        <div className="absolute flex top-3 left-4 text-sm">
          {formatTime(timer)}
        </div>
        <div className="absolute flex gap-3 top-3 right-4">
          <VolumeOff size={18} className="cursor-pointer" />
          <Wind size={18} className="cursor-pointer" />
        </div>

        {/*  SELECT ANIMATION */}
        {/* <div className=" w-full h-full bg-amber-300"></div> */}
        {/* <motion.div
          className="mx-auto size-32 rounded-full bg-blue-300"
          variants={animationVariants}
          animate={isRunning ? phase : undefined}
          initial={{ transform: "scale(1)" }}
          transition={{ type: "tween" }}
        ></motion.div> */}
        <currentAnimation.component variants={animationVariants} currentVariant={isRunning ? phase : "initial"}
        />

        <div className="absolute bottom-3 right-4">
          <Maximize2 size={15} className="cursor-pointer" />
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

        {/* COMPONENT FOR SELECT ANIMATION */}
        <Select value={selectedAnimation} onValueChange={(value: AnimationType) => setSelectedAnimation(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select animation" />
          </SelectTrigger>
          <SelectContent>
           {/*  <SelectItem defaultValue="circle" value="circle">Circle</SelectItem>
            <SelectItem value="wave">Wave</SelectItem>
            <SelectItem value="box">Box</SelectItem> */}
            {Object.values(animations).map((anim) => (
                <SelectItem key={anim.id} value={anim.id}>
                    {anim.displayName}
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

export default BreathingApp