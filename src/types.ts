export type Phase = {
  name: string;
  duration: number;
  transform: string;
};



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