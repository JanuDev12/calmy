import { Maximize2, VolumeOff, Wind } from "lucide-react";
import { Button } from "./ui/button";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { animations } from "./animations";
import type { BreathingExercise, Exercise } from "@/types";

type AnimationType = keyof typeof animations;

const formatTime = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

const BREATHING_EXERCISES: Record<Exercise, BreathingExercise> = {
  "4-7-8-0": {
    id: "4-7-8-0",
    name: "4-7-8-0 Breathing",
    phases: {
      inhale: 4000,
      holdInhale: 7000,
      exhale: 8000,
      holdExhale: 0,
    },
  },
  "Box Breathing": {
    id: "Box Breathing",
    name: "Box Breathing",
    phases: {
      inhale: 4000,
      holdInhale: 4000,
      exhale: 4000,
      holdExhale: 4000,
    },
  },
  Custom: {
    id: "Custom",
    name: "Custom Breathing",
    phases: {
      inhale: 4000,
      holdInhale: 4000,
      exhale: 4000,
      holdExhale: 4000,
    },
  },
};

function BreathingApp() {
  // Circle Animation as default
  const [selectedAnimation, setSelectedAnimation] = useState<AnimationType>("circle");

  // Select Breathing exercise as default
  const [selectedExercise, setSelectedExercise] = useState<keyof typeof BREATHING_EXERCISES>("4-7-8-0")
  const [customPhases, setCustomPhases] = useState(BREATHING_EXERCISES.Custom.phases)

  // Getting initial Phase of selected animation
  const initialPhase = useMemo(
    () => animations[selectedAnimation].phases[0].name,
    [selectedAnimation]
  )

  // Storing the initial Phase in local state for logic
  const [phase, setPhase] = useState<string>(initialPhase);

  const [isRunning, setIsRunning] = useState(false);

  // Timers
  const timerRef = useRef(0);
  const [timer, setTimer] = useState(0);
  const timerInterval = useRef(0);

  // Selecting current animation for use
  const currentAnimation = useMemo(
    () => animations[selectedAnimation],
    [selectedAnimation]
  );

  const currentExercise = useMemo(() => (
    BREATHING_EXERCISES[selectedExercise]
  ),[selectedExercise, customPhases]);

 /*  const PHASE_INDEX = useMemo(
    () => new Map(currentAnimation.phases.map((p, i) => [p.name, i])),
    [currentAnimation]
  ); */

  // Creating animations for each phase
  const animationVariants = useMemo(
    () =>
      currentAnimation.phases.reduce(
        (acc, phase) => ({
          ...acc,
          [phase.name]: {
            transform: phase.transform,
            // Motion expects seconds
            transition: { duration: (currentExercise.phases[phase.name] || 0) / 1000 },
          },
        }),
        {}
      ),
    [currentAnimation, currentExercise.phases]
  );


  const resetBreathing = () => {
    if (isRunning) {
      clearTimeout(timerRef.current);
      clearInterval(timerInterval.current);
      setPhase(currentAnimation.phases[0].name);
      setTimer(0);
    }
    setIsRunning(false);
  };

  // useEffect for transitioning to each phase of breathing
  useEffect(() => {
    if (!isRunning) return;

    /* const currentPhase = PHASE_INDEX.get(phase)!; */
   
/* 
    const { duration } = currentAnimation.phases[currentPhase];

    timerRef.current = setTimeout(() => {
      const nextPhase = getNextPhase(currentPhase);
      setPhase(currentAnimation.phases[nextPhase].name);
    }, duration); */

      const phaseNames = Object.keys(currentExercise.phases);
      const currentPhaseIndex = phaseNames.indexOf(phase);

      const nextPhaseIndex = getNextPhase(currentPhaseIndex);
      const nextPhase = phaseNames[nextPhaseIndex];
      const duration = currentExercise.phases[nextPhase];

      timerRef.current = setTimeout(() => {
        setPhase(nextPhase);
      }, duration);

    return () =>  clearTimeout(timerRef.current);
  }, [phase, isRunning, currentExercise.phases]);

  // Timer of breathing
  useEffect(() => {
    if (isRunning) {
      timerInterval.current = setInterval(() => {
        setTimer((prev) => prev + 1000);
      }, 1000);
    } else {
       clearInterval(timerInterval.current);
    }

    return () => {
       clearInterval(timerInterval.current);
    };
  }, [isRunning]);

  function getNextPhase(currentPhase: number): number {
    let i = 0;
    let nextPhase = currentPhase;
    const phaseNames = Object.keys(currentExercise.phases);

    // Loop for skip to the next phase if its 0s
    do {
      nextPhase = (nextPhase + 1) % currentAnimation.phases.length;
      i++;
      if (i >= phaseNames.length) {
        console.log("Infnite Loop detected");
      }
    } while (currentExercise.phases[phaseNames[nextPhase]] === 0);

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

        {/*  BREATHING ANIMATION */}
        <currentAnimation.component
          variants={animationVariants}
          currentVariant={isRunning ? phase : "initial"}
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

        {/* SELECT ANIMATION */}
        <Select
          value={selectedAnimation}
          onValueChange={(value: AnimationType) => setSelectedAnimation(value)}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="Select animation" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(animations).map((anim) => (
              <SelectItem key={anim.id} value={anim.id}>
                {anim.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* SELECT TYPE OF BREATHING */}
        <Select
          value={selectedExercise}
          onValueChange={(value) => setSelectedExercise(value)}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="Select breathing" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(BREATHING_EXERCISES).map((exercise) => (
              <SelectItem key={exercise.id} value={exercise.id}>
                {exercise.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

export default BreathingApp;
