import CircleAnimation from "./CircleAnimation";
import WaveAnimation from "./WaveAnimation";

export const animations = {
    [CircleAnimation.id]: CircleAnimation,
    [WaveAnimation.id]: WaveAnimation,
} as const;

export type AnimationType = keyof typeof animations;