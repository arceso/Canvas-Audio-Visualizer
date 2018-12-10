import './Visualizer.styl';
import { paper } from 'paper';
import React from 'react'
import { pathToFileURL } from 'url';
import { magentaBright } from 'ansi-colors';

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}

    this.canvasRef = React.createRef();
    this.audioRef = React.createRef();
  }

  canvasRef;
  audioRef;

  componentDidMount() {
    const SONG_PATH = '/static/Media/Sounds/song.mp3',
      COLORS = ['#03A9F4', '#e91e63'];;
    let audio = this.audioRef.current,
      audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
      analyser = audioCtx.createAnalyser(),
      canvas = this.canvasRef.current;


    audio.src = SONG_PATH;
    audio.load();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Sets the source to the media element & adds the analyser.
    audioCtx.createMediaElementSource(audio).connect(analyser);

    // links the analyser output to the speakers.
    analyser.connect(audioCtx.destination);

    //ammount of waveSamples (?)
    analyser.fftSize = 2 ** 5;

    const BUFFER_LENGTH = analyser.frequencyBinCount,
      DATA_ARRAY = new Uint8Array(BUFFER_LENGTH),
      //DEGS_PER_LINE = 180 / BUFFER_LENGTH,
      DEGS_PER_LINE = 180 / 5;

    paper.install(window);
    paper.setup(canvas);

    function renderFrame() {
      requestAnimationFrame(renderFrame);
      analyser.getByteFrequencyData(DATA_ARRAY);
      project.activeLayer.removeChildren();

      let lastBisection = view.center.add([100, 0]),
        actualRotation = -DEGS_PER_LINE / 2,
        arrayCurves = new Array(2).fill().map(() => (new paper.Path())),
        circle = new paper.Shape.Circle(view.center, 100);

      for (let i = 6; i < BUFFER_LENGTH; i++) {
        if (i % 2) actualRotation += DEGS_PER_LINE;
        arrayCurves[i % 2].moveTo(lastBisection);
        arrayCurves[i % 2].quadraticCurveTo(
          getEndOfLine(DATA_ARRAY[i], actualRotation),
          lastBisection = getEndOfCurve(actualRotation)
        );
      }
      for (let i = 0; i < arrayCurves.length; i++) {
        let curvesClone = arrayCurves[i].clone();
        curvesClone.scale(1, -1, view.center.add([100, 0]));
        arrayCurves[i].join(curvesClone);
        arrayCurves[i].closePath();
        arrayCurves[i].rotate(90, view.center);
        arrayCurves[i].sendToBack();
        arrayCurves[i].fillColor = COLORS[i];
      }
      arrayCurves[1].style = {
        shadowColor: 'rgba(21, 21, 21, .3)',
        shadowBlur: 2,
        shadowOffset: [0, 5]
      }

      circle.clone().fillColor = COLORS[0];

      circle.bringToFront();
      circle.style = {
        fillColor: '#fff',
        shadowColor: 'rgba(21, 21, 21, .3)',
        shadowBlur: 2,
        shadowOffset: [0, 5]
      };

      let canAnimate = true;
      if (DATA_ARRAY.every(level => level > 50)) {
        const x = view.center.x,
          y = view.center.y;
        
        circle.position = [getRandomInt(x + 5, x - 5), getRandomInt(y + 5, y - 5)];
      }
    }

    renderFrame();

    function getEndOfLine(size, degrees) {
      return view.center.add([
        (size + 100) * TRIGONOMETRY.cos(degrees),
        (size + 100) * TRIGONOMETRY.sin(degrees)
      ])
    }

    function getEndOfCurve(currentAngle) {
      return view.center.add([
        TRIGONOMETRY.cos(bisection(currentAngle)) * 100,
        TRIGONOMETRY.sin(bisection(currentAngle)) * 100
      ])
    }

    function bisection(currentAngle) { return currentAngle + (DEGS_PER_LINE / 2); }
  }

  onCanvasClick() {
    const audio = this.audioRef.current;
    audio.paused ? audio.play(): audio.pause();
  }

  render() {
    return (
      <div>
        <canvas id="oscilloscope" ref={this.canvasRef} onClick={this.onCanvasClick.bind(this)}/>
        <audio id="audio" controls ref={this.audioRef} />
        <img src="/static/Media/Images/logo.png" onClick={this.onCanvasClick.bind(this)}/>
      </div>
    );
  }
}

// Trigonometry101 for dummies:
function toRadians(degree) { return degree * (Math.PI / 180); }

function roundNumber(number, decimals = 5) { return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals); }

const TRIGONOMETRY = {
  sin: number => roundNumber(Math.sin(toRadians(number))),
  cos: number => roundNumber(Math.cos(toRadians(number)))
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}   