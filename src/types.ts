export type Phase = {
  name: string;
  duration: number;
  transform: string;
};

export type Exercise = '4-7-8-0' | 'Box Breathing' | 'Custom';

export type BreathingExercise = {
  id: Exercise;
  name: string;
  phases: Record<string, number>;
}


export interface AnimationProps {
  phase: Phase["name"];
  variants: Record<string, any>;
}

export type Animation = {
    id: string;
    name: string;
    phases: Phase[];
    component: React.ComponentType<{phases: Phase[]}>;
}