//import { useState } from 'react'
import $ from 'jquery'; 
import './App.css'

let canBlob = false;
if(window.webkitURL && window.Blob){
  try{
    new Blob();
    canBlob = true;
  } catch(e) {}
}

function asBytes(value: number , bytes: number){
  var result = [];
  for(; bytes>0; bytes--){
    result.push(String.fromCharCode(value & 255));
    value >>= 8;
  }
  return result.join('');
}

function attack(i: number){
  return i < 200 ? (i/200) : 1;
}


 var DataGenerator = $.extend(function(styleFn: any, volumeFn: any, cfg: any ){
  cfg = $.extend({
    freq: 440,
    volume: 32767,
    sampleRate: 11025, // Hz
    seconds: .5,
    channels: 1
  }, cfg);

  var data = [];
  var maxI = cfg.sampleRate * cfg.seconds;
  for (var i=0; i < maxI; i++) {
      for (var j=0; j < cfg.channels; j++) {
          data.push(
              asBytes(
                  volumeFn(
                      styleFn(cfg.freq, cfg.volume, i, cfg.sampleRate, cfg.seconds, maxI),
                      cfg.freq, cfg.volume, i, cfg.sampleRate, cfg.seconds, maxI
                  ) * attack(i), 2
              )
          );
      }
  }
  return data;
}, {
  style: function(freq: number, volume: number, i: number, sampleRate: number, seconds: number) {
        return Math.sin((2 * Math.PI) * (i / sampleRate) * freq);
 },
  volume: function(data: any, freq: number, volume: number, i: number,  sampleRate: number, seconds: number, maxI: number) {
          return volume * ((maxI - i) / maxI) * data;
  }
});

DataGenerator.style = DataGenerator.style
DataGenerator.volume = DataGenerator.volume;

function toDataURI(cfg: any) {
  cfg = $.extend({
      channels: 1,
      sampleRate: 11025, 
      bitDepth: 16, 
      seconds: .5,
      volume: 20000,
      freq: 440
  }, cfg);

  var fmtChunk = [
      'fmt ', 
      asBytes(16, 4), 
      asBytes(1, 2), 
      asBytes(cfg.channels, 2),
      asBytes(cfg.sampleRate, 4),
      asBytes(cfg.sampleRate * cfg.channels * cfg.bitDepth / 8, 4), // byte rate
      asBytes(cfg.channels * cfg.bitDepth / 8, 2),
      asBytes(cfg.bitDepth, 2)
  ].join('');
  var sampleData = DataGenerator(
      cfg.styleFn || DataGenerator.style,
      cfg.volumeFn || DataGenerator.volume,
      cfg);
  var samples = sampleData.length;

  var dataChunk = [
      'data', 
      asBytes(samples * cfg.channels * cfg.bitDepth / 8, 4), 
      sampleData.join('')
  ].join('');

  var data = [
      'RIFF',
      asBytes(4 + (8 + fmtChunk.length) + (8 + dataChunk.length), 4),
      'WAVE',
      fmtChunk,
      dataChunk
  ].join('');

  if (canBlob) {
      var view = new Uint8Array(data.length);
      for (var i = 0; i < view.length; i++) {
          view[i] = data.charCodeAt(i);
      }
      var blob = new Blob([view], {type: 'audio/wav'});
      return  window.webkitURL.createObjectURL(blob);
  } else {
      return 'data:audio/wav;base64,' + btoa(data);
  }
}

function noteToFreq(stepsFromMiddleC: number) {
  return 440 * Math.pow(2, (stepsFromMiddleC+3) / 12);
}

var Notes: any = {
  sounds: {},
  getDataURI: function(n: number, cfg: any) {
      cfg = cfg || {};
      cfg.freq = noteToFreq(n);
      return toDataURI(cfg);
  },
  getCachedSound: function(n: any, data: any) {
      var key = n, cfg;
      if (data && typeof data == "object") {
          cfg = data;
          var l = [];
          for (var attr in data) {
              l.push(attr);
              l.push(data[attr]);
          }
          l.sort();
          key += '-' + l.join('-');
      } else if (typeof data != 'undefined') {
          key = n + '.' + key;
      }

      var sound = this.sounds[key];
      if (!sound) {
          sound = this.sounds[key] = new Audio(this.getDataURI(n, cfg));
      }
      return sound;
  },
  noteToFreq: noteToFreq
};

let blackKeys: {[key: number]: string} = {1: ' black black1', 3: ' black black3', 6: ' black black1', 8: ' black black2', 10: ' black black3'};

function blackKeyClass(i: number){
  return blackKeys[(i % 12) + (i < 0 ? 12 : 0)] || '';
}

let $keys = $('<div>', {'class': 'keys'}).appendTo('#piano');
let pianoBuilt = false;

function buildPiano(){
  if(pianoBuilt) {return;}
  pianoBuilt = true;

  $keys.trigger('build-start.piano');
  $keys.empty().off('.play');

        function buildKey(i: number){
            var dataURI = Notes.getDataURI(i);
            var sounds = new Audio(dataURI);
            var pressedTimeout: number;
            dataURI = null;

            function play(){
                sounds.pause();
                sounds.currentTime = 0.001
                sounds.play();

                var $key = $keys.find('[data-key='+i+']').addClass('pressed');
                $keys.trigger('played-note.piano', [i, $key]);

                window.clearTimeout(pressedTimeout);
                pressedTimeout = window.setTimeout(()=> {
                    $key.removeClass('pressed');
                }, 200);
            }

            $keys.on('note-' + i + '.play', play);
            var $keyDiv = $('<div>', {
                'class': 'key' + blackKeyClass(i),
                'data-key' : i,
                mousedown : function() {$keys.trigger('note-' + i + '.play'); }
            }).appendTo($keys);
        } //end of building key function
        
        var i = -12, max = 14;
        var addDelay = /Chrome/i.test(navigator.userAgent) ? 80 : 0;
        function go(){
            buildKey(i);
            if (++i < max) { window.setTimeout(go, addDelay);}
            else {
                pianoBuilt = false;
                $keys.trigger('build-done.piano');
            }
        }
        go();
}

buildPiano();
var keyNotes: {[key: number]: number}  = {65:0, 87:1, 83:2, 69:3, 68:4, 70:5, 84: 6,
  71:7, 89:8, 72:9, 85:10, 74:11, 75:12, 79:13, 76:14,
  80:15, 186:16, 59:16, 222:17, 221:18, 13:19};
var downKeys: {[key: number]: number} = {};

function isModifierKey(e: any){
  return e.metaKey || e.shiftKey || e.altKey;
}

$(window).keydown( function(e) {
  var keyCode = e.keyCode;
  if(!downKeys[keyCode] && !isModifierKey(e)){
      downKeys[keyCode] = 1;
      var key = keyNotes[keyCode];
      if (typeof key != 'undefined') {
          $keys.trigger('note-'+(key-12)+'.play');
          e.preventDefault();
      }
  }
}).keyup(function(e) {delete downKeys[e.keyCode]});


function App() {
  return (
    <>
      <div id="content">
          <div id="content-inner">
              <div id="piano">
              </div>
          </div>
      </div>
    </>
  )
}

export default App;
