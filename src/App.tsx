
import './App.css'
import { motion } from "motion/react";
import Breathcircle from './components/Breathcircle';

function App() {

  return (
    <>
      <div className="w-full h-screen bg-amber-100 flex justify-center items-center">
        <motion.div className="w-2xl h-1/2 border-2 border-red-300 flex items-center">
          <Breathcircle/>
        </motion.div>
      </div>
    </>
  );
}

export default App
