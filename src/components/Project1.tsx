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
        <button className = "back home-back" onClick = {onClick}>
            take me back home.
        </button>
    )
}

const Project1: React.FC = () => {
    const navigate = useNavigate();
    const handleHome = () => { navigate('/home'); };

     //frog
     const [frogSpreadPosition, setFrogSpreadPosition] = useState({ x: 0, y: 0 });
     const [showFrogSpread, setShowFrogSpread] = useState(false);
     const frogRef = useRef<HTMLDivElement>(null);
 
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

    const handleLbHover = () => {
        const position = calculatePosition(isseyRef);
        setLbSpreadPosition(position);
        setShowLbSpread(true);
    };

    const handleLbExit = () => { setShowLbSpread(false); };
    const handleSpreadComplete = (path: string) => {navigate(path);};

    const sentence = {hidden: { opacity: 1 }, visible: {opacity: 1, transition: { staggerChildren: 0.08 }}};
    const letter = {hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 }}};
    return (
        <>
        <div style = {{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100vh', overflow: 'hidden', backgroundColor: '#b5ced4' }}>
            <motion.div id="project1-content">
                <div className="words">
                    <motion.div className="title project1-title" variants = {sentence} initial = "hidden" animate="visible">
                        {"Project: Keyboard Warrior".split("").map((char, index) => (<motion.span id = "project1-title" key={index} variants={letter}>{char}</motion.span>))}
                    </motion.div>
                    <motion.div 
                        className="description project1-description" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3 }}
                    >
                    <p>
                        Keyboard Warrior is a web application that helps users find piano compositions of their favorite songs by searching through Spotify and YouTube. 
                        Users can input a song title into the search bar, and the app fetches the relevant track from Spotify, along with an embedded YouTube piano tutorial. 
                        <br/><br/>
                        The random track feature lets users explore new songs, and the app ensures all returned videos are piano compositions by parsing the YouTube video titles. 
                        For more advanced use, users can save their favorite songs and track their learning progress using simple CRUD operations connected to a MongoDB database.
                        <br/><br/>
                        The application communicates with external services via REST APIs, fetching data from Spotify to find song tracks and YouTube to locate piano tutorials.
                        <br/><br/>
                        <span style = {{color: "#2D80A7"}}>Tech Stack: HTML, CSS, JavaScript, Node.js, Bootstrap, MongoDB, Spotify API, and YouTube API.</span> 
                        <br/><br/>
                        <a href="https://github.com/rachanakreddy/keyboardWarrior" target="_blank" rel="noopener noreferrer" style={{color: "#D6CFBE", textDecoration: "none"}}>
                           <img src={gitCat} className = "social-icons"></img>
                        </a> 
                    </p>
                    </motion.div>
                </div>
                <div id = "back">
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

                <motion.div  className="icons">
                    <motion.div className='about' ref={frogRef} onClick={()=>navigate('/about')} onMouseEnter={handleFrogHover} onMouseLeave={handleFrogExit}>
                        <img src={frog} className="frog" alt="aboutme" />
                    </motion.div>
                    <motion.div className='kw' onClick={()=>navigate('/project1')}>
                        <img src={butterfly} className="butterfly" alt="project1" />
                    </motion.div>
                    <motion.div className='fyf' ref={isseyRef} onClick={()=>navigate('/project2')} onMouseEnter={handleLbHover} onMouseLeave={handleLbExit}>
                        <img src={issey} className="issey" alt="project2" />
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    </>
  );
}

export default Project1;