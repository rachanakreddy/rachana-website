import React, { useState, useEffect, useRef } from 'react';
import {useNavigate} from "react-router-dom";
import '../App.css';
import {motion} from"framer-motion";

// TypeScript: Declare canBlob for conditional Blob creation
let canBlob: boolean = false;
if (window.webkitURL && window.Blob) {
  try {
    new Blob();
    canBlob = true;
  } catch (e) {}
}

// Helper functions
function asBytes(value: number, bytes: number): string {
  let result: string[] = [];
  for (; bytes > 0; bytes--) {
    result.push(String.fromCharCode(value & 255));
    value >>= 8;
  }
  return result.join('');
}

function attack(i: number): number {
  return i < 200 ? i / 200 : 1;
}

interface DataGeneratorConfig {
  freq?: number;
  volume?: number;
  sampleRate?: number;
  seconds?: number;
  channels?: number;
  bitDepth?: number;
  styleFn?: typeof DataGenerator.style;
  volumeFn?: typeof DataGenerator.volume;
}

function DataGenerator(
  styleFn: (freq: number, volume: number, i: number, sampleRate: number, seconds: number, maxI: number) => number,
  volumeFn: (data: number, freq: number, volume: number, i: number, sampleRate: number, seconds: number, maxI: number) => number,
  cfg: DataGeneratorConfig
): string[] {
  cfg = {
    freq: 440,
    volume: 32767,
    sampleRate: 11025, // Hz
    seconds: 0.5,
    channels: 1,
    ...cfg,
  };

  const data: string[] = [];
  const maxI = cfg.sampleRate! * cfg.seconds!;

  for (let i = 0; i < maxI; i++) {
    for (let j = 0; j < cfg.channels!; j++) {
      data.push(
        asBytes(
          volumeFn(
            styleFn(cfg.freq!, cfg.volume!, i, cfg.sampleRate!, cfg.seconds!, maxI),
            cfg.freq!,
            cfg.volume!,
            i,
            cfg.sampleRate!,
            cfg.seconds!,
            maxI
          ) * attack(i),
          2
        )
      );
    }
  }

  return data;
}

DataGenerator.style = function (
  freq: number,
  volume: number,
  i: number,
  sampleRate: number,
  seconds: number
): number {
  return Math.sin((2 * Math.PI * (i / sampleRate)) * freq);
};

DataGenerator.volume = function (
  data: number,
  freq: number,
  volume: number,
  i: number,
  sampleRate: number,
  seconds: number,
  maxI: number
): number {
  return volume * ((maxI - i) / maxI) * data;
};

// Function to generate data URI for the audio
function toDataURI(cfg: DataGeneratorConfig): string {
  cfg = {
    channels: 1,
    sampleRate: 11025,
    bitDepth: 16,
    seconds: 0.5,
    volume: 20000,
    freq: 440,
    ...cfg,
  };

  const fmtChunk = [
    'fmt ',
    asBytes(16, 4),
    asBytes(1, 2),
    asBytes(cfg.channels!, 2),
    asBytes(cfg.sampleRate!, 4),
    asBytes((cfg.sampleRate! * cfg.channels! * cfg.bitDepth!) / 8, 4), // byte rate
    asBytes((cfg.channels! * cfg.bitDepth!) / 8, 2),
    asBytes(cfg.bitDepth!, 2),
  ].join('');

  const sampleData = DataGenerator(
    cfg.styleFn || DataGenerator.style,
    cfg.volumeFn || DataGenerator.volume,
    cfg
  );
  const samples = sampleData.length;

  const dataChunk = [
    'data',
    asBytes((samples * cfg.channels! * cfg.bitDepth!) / 8, 4),
    sampleData.join(''),
  ].join('');

  const data = [
    'RIFF',
    asBytes(4 + (8 + fmtChunk.length) + (8 + dataChunk.length), 4),
    'WAVE',
    fmtChunk,
    dataChunk,
  ].join('');

  if (canBlob) {
    const view = new Uint8Array(data.length);
    for (let i = 0; i < view.length; i++) {
      view[i] = data.charCodeAt(i);
    }
    const blob = new Blob([view], { type: 'audio/wav' });
    return window.webkitURL.createObjectURL(blob);
  } else {
    return 'data:audio/wav;base64,' + btoa(data);
  }
}

// convert note to frequency
function noteToFreq(stepsFromMiddleC: number): number {
  return 440 * Math.pow(2, (stepsFromMiddleC + 3) / 12);
}
const blackKeys: { [key: number]: string } = {
  1: 'black black1',
  3: 'black black3',
  6: 'black black1',
  8: 'black black2',
  10: 'black black3',
};

function blackKeyClass(i: number): string {
  const adjusted = (i % 12) + (i < 0 ? 12 : 0);
  return blackKeys[adjusted] || '';
}


// piano component
interface PianoKey {
  id: number;
  freq: number;
}

const Piano: React.FC = () => {
  const navigate = useNavigate();
  const [keys, setKeys] = useState<PianoKey[]>([]);
  const [pressedKeys, setPressedKeys] = useState<{ [key: number]: boolean }>({});
  const [playedNotes, setPlayedNotes] = useState<number[]>([]);
  const keyNotes = useRef<{ [key: number]: number }>({
    65: 0, 87: 1, 83: 2, 69: 3, 68: 4, 70: 5, 84: 6, 71: 7, 89: 8, 72: 9, 85: 10, 74: 11, 75: 12,
    79: 13, 76: 14, 80: 15, 186: 16, 59: 16, 222: 17, 221: 18, 13: 19,
  });

  useEffect(() => {
    // Generate piano keys
    const keysArray = Array.from({ length: 26 }, (_, i) => ({
      id: i,
      freq: noteToFreq(i-12),
    }));
    setKeys(keysArray);

    // Key event handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = keyNotes.current[e.keyCode];
      if (key !== undefined && !pressedKeys[key]) {
        playKey(key);
        console.log("key being passed to playKey" + key);
        setPressedKeys((prev) => ({ ...prev, [key]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = keyNotes.current[e.keyCode];
      if (key !== undefined) {
        setPressedKeys((prev) => {
          const newKeys = { ...prev };
          delete newKeys[key];
          return newKeys;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressedKeys]);

  const playKey = (key: number) => {
    const audio = new Audio(toDataURI({ freq: noteToFreq(key-12) }));
    audio.currentTime = 0.001;
    audio.play();
    setPlayedNotes((prevNotes) => [...prevNotes, key]);
    console.log(key)
    console.log(playedNotes);
  };

  const handleMouseDown = (key: number) => {
    playKey(key);
    setPressedKeys((prev) => ({ ...prev, [key]: true }));
  };

  const handleMouseUp = (key: number) => {
    setPressedKeys((prev) => {
      const newKeys = { ...prev };
      delete newKeys[key];
      return newKeys;
    });
  };

  return (
    <div className="keys">
      {keys.map((key) => (
        <div
          key={key.id}
          className={`key ${blackKeyClass(key.id)} ${pressedKeys[key.id] ? 'pressed' : ''}`}
          onMouseDown={() => handleMouseDown(key.id)}
          onMouseUp={() => handleMouseUp(key.id)}
        />
      ))}
    </div>
  );
};

const GoToHome = () => {
  const navigate = useNavigate();

  return (
      <button className = "home-back" onClick = {() => {navigate('/home')}}>
          Take me back home..
      </button>
  )
}

const PianoHome: React.FC = () => {
  return (
    <>
      <div id="content">
        <div id="content-inner">
          <div id = "piano">
            <Piano />
          </div>
        </div>
      <GoToHome />
      </div>
      <motion.div
            className = "slide-in"
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
};

export default PianoHome;
