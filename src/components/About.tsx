import '../App.css'
import React, { useState, useEffect, useRef } from 'react';
import Typewriter from 'typewriter-effect';
import frog from '../assets/frog.png';
import butterfly from '../assets/butterfly.png';
import issey from '../assets/issey.png';
import {motion} from"framer-motion";
import gitCat from '../assets/gitCat.png';
import linkedIn from '../assets/linkedin.png';
import { useNavigate } from 'react-router-dom';

const GoToHome= ({ onClick }: { onClick: () => void }) => {
    return (
        <button className = "back home-back" onClick = {onClick}>
            take me back home.
        </button>
    )
}

const message1: string = "About Me"

const About: React.FC = () => {
    const navigate = useNavigate();
    const handleHome = () => { navigate('/home'); };

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

    const sentence = {hidden: { opacity: 1 }, visible: {opacity: 1, transition: { staggerChildren: 0.08 }}};
    const letter = {hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 }}};

    return (
        <>
        <div style = {{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100vh', overflow: 'hidden', backgroundColor: '#b5ced4' }}>
            <motion.div id="about-content">
                <div className="words">
                    <motion.div className="title about-title" variants = {sentence} initial = "hidden" animate="visible">
                        {"About Me".split("").map((char, index) => (<motion.span id = "title" key={index} variants={letter}>{char}</motion.span>))}
                    </motion.div>
                    <motion.div 
                        className="description about-description" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3 }}
                    >
                        <p>
                            Hi! I’m Rachana, a post-grad Computer Science major interested in full-stack development. 
                            I love using my creativity to develop applications and will do whatever it takes to bring my ideas to life! 
                            Recently, I've been diving deep into the world of web development, exploring new languages and libraries 
                            to enhance my projects with cool features—like learning TypeScript and React to build this website. 
                            <br/> <br/>
                            Outside of all the tech stuff, I usually listen to a lot of music or go on hikes and bike rides. 
                            I also love keeping up with the latest fashion trends and playing the piano in my free time (if it wasn’t made obvious by the keyboard feature).
                            <br/><br/>
                            <div id = "social">
                                <a href="https://www.linkedin.com/in/rachanakreddy/" target="_blank" rel="noopener noreferrer" style={{color: "#D6CFBE", textDecoration: "none"}}>
                                    <img src={linkedIn} className = "social-icons"></img>
                                </a> 
                                <a href="https://github.com/rachanakreddy/findYourFit" target="_blank" rel="noopener noreferrer" style={{color: "#D6CFBE", textDecoration: "none"}}>
                                    <img src={gitCat} className = "social-icons"></img>
                                </a> 
                            </div>
                        </p>
                    </motion.div>
                </div>
                <div id = "back">
                    <GoToHome onClick={handleHome}/>
                </div>

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


                <motion.div  className="icons">
                    <motion.div className='about' onClick={()=>navigate('/about')}>
                        <img src={frog} className="frog" alt="aboutme" />
                    </motion.div>
                    <motion.div className='kw' ref={butterflyRef} onClick={()=>navigate('/project1')} onMouseEnter={handleBfHover} onMouseLeave={handleBfExit}>
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

export default About;