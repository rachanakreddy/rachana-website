import '../App.css'
import React, { useState, useEffect, useRef } from 'react';
import Typewriter from 'typewriter-effect';
import frog from '../assets/frog.png';
import butterfly from '../assets/butterfly.png';
import issey from '../assets/issey.png';
import mountain from '../assets/mountain-big.png'
import {motion} from"framer-motion";
import { useNavigate } from 'react-router-dom';

const GoToPiano = ({ onClick }: { onClick: () => void }) => {
    return (
        <button className = "back home-back" onClick = {onClick}>
            take me back to the piano.
        </button>
    )
}

const containerVariants = {visible: {transition: {staggerChildren: 0.5}},};
const childVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "circIn",
        type: "spring",
        damping: 9,
        stiffness: 50,
        restDelta: 0.001,
      },
    },
  };

const message1: string = "rachana reddy"
const message3: string =  "click the creatures to explore more";

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mountainVisible, setMountainVisible] = useState(false);
    const [exitMountains, setExitMountains] = useState(false);

    useEffect(() => {
        setMountainVisible(true);
    }, []);

    
    const handleNavigate = () => {
        setExitMountains(true);
        setTimeout(() => {
            setIsTransitioning(true);
            setTimeout(()=>{
                navigate('/piano'); 
            }, 1000);
        }, 1000); 
    };

    //frog
    const [frogSpreadPosition, setFrogSpreadPosition] = useState({ x: 0, y: 0 });
    const [showFrogSpread, setShowFrogSpread] = useState(false);
    const frogRef = useRef<HTMLDivElement>(null);

    //butterfly
    const [bfSpreadPosition, setBfSpreadPosition] = useState({ x: 0, y: 0 });
    const [showBfSpread, setShowBfSpread] = useState(false);
    const butterflyRef = useRef<HTMLDivElement>(null);

    //ladybug
    const [lbSpreadPosition, setLbSpreadPosition] = useState({ x: 0, y: 0 });
    const [showLbSpread, setShowLbSpread] = useState(false);
    const isseyRef = useRef<HTMLDivElement>(null);

    const calculatePosition = (ref: React.RefObject<HTMLDivElement>) => {
        const rect = ref.current?.getBoundingClientRect();
        return rect
          ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
          : { x: 0, y: 0 };
    };

    const handleFrogHover = () => {
        const position = calculatePosition(frogRef);
        setFrogSpreadPosition(position);
        setShowFrogSpread(true);
    };

    const handleFrogExit = () => { setShowFrogSpread(false); };

    const handleBfHover = () => {
        const position = calculatePosition(butterflyRef);
        setBfSpreadPosition(position);
        setShowBfSpread(true);
    };

    const handleBfExit = () => { setShowBfSpread(false); };

    const handleLbHover = () => {
        const position = calculatePosition(isseyRef);
        setLbSpreadPosition(position);
        setShowLbSpread(true);
    };

    const handleLbExit = () => { setShowLbSpread(false); };

    const handleSpreadComplete = (path: string) => {navigate(path);};

    return (
        <>
        <div style = {{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100vh', overflow: 'hidden', backgroundColor: '#b5ced4' }}>
        <motion.div 
            id="home-content"
            initial={{ y: 0 }} // Initial position
            animate={{ y: isTransitioning ? '100vh' : 0 }} // Move up when transitioning
            transition={{ duration: 1 }}// Transition duration
        >
            <div className="words">
                <Typewriter
                onInit={(typewriter) => {
                    typewriter.typeString('<span id= "name">' + message1 +'</span>')
                    .pauseFor(250)
                    .changeDelay(50)
                    .typeString('<br/><span className = "description" id="userDirect">' + message3 + '</span>')
                    .start();
                }}
                />
            </div>
            {showFrogSpread && (<motion.div className="frog-spread"
              style={{
                position: 'absolute',
                top: frogSpreadPosition.y,
                left: frogSpreadPosition.x,
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: '#16463F',
                zIndex: 2, 
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 35 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              onAnimationComplete={()=> handleSpreadComplete('/about')}
            />)}
            {showBfSpread && (<motion.div className="bf-spread"
              style={{
                position: 'absolute',
                top: bfSpreadPosition.y,
                left: bfSpreadPosition.x,
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: '#533146',
                zIndex: 2, 
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 35}}
              transition={{ duration: 1, ease: 'easeInOut' }}
              onAnimationComplete={()=> handleSpreadComplete('/project1')}
            />)}
            {showLbSpread && (<motion.div className="lb-spread"
              style={{
                position: 'absolute',
                top: lbSpreadPosition.y,
                left: lbSpreadPosition.x,
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: '#C34121',
                zIndex: 2, 
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 35}}
              transition={{ duration: 1, ease: 'easeInOut' }}
              onAnimationComplete={()=> handleSpreadComplete('/project2')}
            />)}
            <div id = "back">
                <GoToPiano onClick={handleNavigate}/>
            </div>
            <motion.div 
                className="icons"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className='about' variants={childVariants} ref={frogRef} onClick={()=>navigate('/about')} onMouseEnter={handleFrogHover} onMouseLeave={handleFrogExit}>
                    <img src={frog} className="frog" alt="aboutme" />
                </motion.div>
                <motion.div className='kw' variants={childVariants} ref={butterflyRef} onClick={()=>navigate('/project1')} onMouseEnter={handleBfHover} onMouseLeave={handleBfExit}>
                    <img src={butterfly} className="butterfly" alt="project1" />
                </motion.div>
                <motion.div className='fyf' variants={childVariants} ref={isseyRef} onClick={()=>navigate('/project2')} onMouseEnter={handleLbHover} onMouseLeave={handleLbExit}>
                    <img src={issey} className="issey" alt="project2" />
                </motion.div>
            </motion.div>
            <div id = "mountainDiv">
                <motion.img
                        src={mountain}
                        className="mountain"
                        initial={{ y: 325 }} // Start position off-screen (below)
                        animate={{ y: exitMountains ? 500:0 }} // End position (normal place)
                        transition={{ duration: 0.75 }} // Duration of the animation
                        style={{ display: mountainVisible ? 'block' : 'none' }} // Only show when the animation starts
                />
            </div>
            </motion.div>
        </div>
    </>
  );
}

export default Home;