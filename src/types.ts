export type Phases = "inhale" | "holdInhale" | "exhale" | "holdExhale";

export type Exercise = "4-7-8-0" | "Box Breathing" | "Custom";

export type BreathingExercise = {
  id: Exercise;
  name: string;
  phases: Record<Phases, number>;
}

/* export type PhaseAnimation = {
  name: Phases;
  duration: number;
  transform: string;
}; */

export type AnimationProps = {
  variants: Record<string, any>;
  currentVariant: Phases;
}

export type Animation = {
    id: string;
    name: string;
    phases: Record<Phases, string>;
    component: React.ComponentType<AnimationProps>;
}