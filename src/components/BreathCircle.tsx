import { motion } from "motion/react";


function Breathcircle() {
  return (
      <motion.div
        className="mx-auto size-32 rounded-full border-2 border-blue-300"
        animate={{
          scale: 1.5,
          transition: { duration: 2, repeat: Infinity },
        }}
      ></motion.div>
  
  );
}

export default Breathcircle