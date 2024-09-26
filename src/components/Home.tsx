import '../App.css'
import React, { useState, useEffect, useRef } from 'react';
import Typewriter from 'typewriter-effect';
import frog from '../assets/frog.png';
import butterfly from '../assets/butterfly.png';
import issey from '../assets/issey.png';
import {motion} from"framer-motion";
import { useNavigate } from 'react-router-dom';

const GoToPiano = () => {
    const navigate = useNavigate();

    return (
        <button className = "piano-back" onClick = {() => {navigate('/piano')}}>
            take me back to the piano...
        </button>
    )
}
const message: string = "BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAH ";
const message2 = "click the creatures to explore more";
const Home: React.FC = () => {
  return (
    <>
        <div id="home-content">
            <div className="words">
                <Typewriter
                onInit={(typewriter) => {
                    typewriter.typeString('<strong style="font-size: 120px; font-weight: 900;"> RACHANA REDDY </strong>')
                    .pauseFor(250)
                    .changeDelay(10)
                    .typeString('<br><span style="color: #62473B; font-size: 50px;">' + message+ '</span>')
                    .pauseFor(250)
                    .changeDelay(50)
                    .typeString('<br><span style = "color: #D6CFBE; font-size: 20px; font-weight: 800;">' + message2 + '</span')
                    .start();
                }}
                />
            </div>
            <div id = "bottom">
                <GoToPiano/>
            </div>
            <div className='about'>
                <a href="https://github.com/rachanakreddy/keyboardWarrior" target="_blank">
                    <img src={frog} className="frog" alt="aboutme" />
                </a>
            </div>
            <div className='kw'>
                <a href="https://github.com/rachanakreddy/keyboardWarrior" target="_blank">
                    <img src={butterfly} className="butterfly" alt="aboutme" />
                </a>
            </div>
            <div className='fyf'>
                <a href="https://github.com/rachanakreddy/keyboardWarrior" target="_blank">
                    <img src={issey} className="issey" alt="aboutme" />
                </a>
            </div>
        </div>
        <motion.div
            className = "slide-in-piano-home"
            initial = {{scaleY: 1}}
            animate = {{scaleY: 0}}
            exit = {{scaleY: 0}}
            transition = {{duration: 3, ease: [0.22, 1, 0.36, 1]}}
        />
        <motion.div
            className = "slide-out"
            initial = {{scaleY: 0}}
            animate = {{scaleY: 0}}
            exit = {{scaleY: 1}}
            transition = {{duration: 3, ease: [0.22, 1, 0.36, 1]}}
        />
    </>
  );
}

export default Home;