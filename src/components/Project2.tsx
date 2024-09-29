import '../App.css'
import React, { useState, useRef } from 'react';
import frog from '../assets/frog.png';
import butterfly from '../assets/butterfly.png';
import issey from '../assets/issey.png';
import gitCat from '../assets/gitCat.png';
import {motion} from"framer-motion";
import { useNavigate } from 'react-router-dom';

const GoToHome= ({ onClick }: { onClick: () => void }) => {
    return (
        <button className = "back piano-back" onClick = {onClick}>
            take me back home.
        </button>
    )
}

const Project2: React.FC = () => {
    const navigate = useNavigate();
    const handleHome = () => { navigate('/home'); };

    //frog
    const [frogSpreadPosition, setFrogSpreadPosition] = useState({ x: 0, y: 0 });
    const [showFrogSpread, setShowFrogSpread] = useState(false);
    const frogRef = useRef<HTMLDivElement>(null);

    //butterfly
    const [bfSpreadPosition, setBfSpreadPosition] = useState({ x: 0, y: 0 });
    const [showBfSpread, setShowBfSpread] = useState(false);
    const butterflyRef = useRef<HTMLDivElement>(null);

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
    const handleSpreadComplete = (path: string) => {navigate(path);};

    const sentence = {hidden: { opacity: 1 }, visible: {opacity: 1, transition: { staggerChildren: 0.08 }}};
    const letter = {hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 }}};

    return (
        <>
        <div style = {{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100vh', overflow: 'hidden', backgroundColor: '#b5ced4' }}>
            <motion.div id="project2-content">
                <div className="words">
                    <motion.div className="title project2-title" variants = {sentence} initial = "hidden" animate="visible">
                        {"Project: Find Your Fit".split("").map((char, index) => (<motion.span id = "project2-title" key={index} variants={letter}>{char}</motion.span>))}
                    </motion.div>
                    <motion.div 
                        className="description project2-description" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3 }}
                    >
                    <p>
                        Find Your Fit is a web application for saving personal outfit ideas, enabling users to curate and store custom clothing combinations. 
                        Users can search for various outfit pieces across the web, categorizing them, and save outfits to a board with customizable descriptions.
                        <br/><br/>
                        The app employs a microservice architecture, separating services for searching fashion pieces and saving outfits.
                        The search service communicates with the Serp API via REST, while the saving outfits service uses MongoDB for data storage.
                        <br/><br/>
                        Svelte is utilized for building dynamic, responsive UI components, providing a smooth user experience. 
                        Docker facilitates containerization, ensuring scalability and efficient handling of multiple user requests.
                        <br/><br/>
                        <span style = {{color: "#16463F"}}>Tech stack: Svelte, JavaScript, Node.js,Docker, MongoDB, and Serp API.</span> 
                        <br/><br/>
                        <a href="https://github.com/rachanakreddy/findYourFit" target="_blank" rel="noopener noreferrer" style={{color: "#D6CFBE", textDecoration: "none"}}>
                           <img src={gitCat} className = "social-icons"></img>
                        </a> 
                    </p>
                    </motion.div>
                </div>
                    <div >
                        <GoToHome onClick={handleHome}/>
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
                <motion.div  className="icons">
                    <motion.div className='about' ref={frogRef} onClick={()=>navigate('/about')} onMouseEnter={handleFrogHover} onMouseLeave={handleFrogExit}>
                        <img src={frog} className="frog" alt="aboutme" />
                    </motion.div>
                    <motion.div className='kw' ref={butterflyRef} onClick={()=>navigate('/project1')} onMouseEnter={handleBfHover} onMouseLeave={handleBfExit}>
                        <img src={butterfly} className="butterfly" alt="project1" />
                    </motion.div>
                    <motion.div className='fyf' onClick={()=>navigate('/project2')}>
                        <img src={issey} className="issey" alt="project2" />
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    </>
  );
}

export default Project2;