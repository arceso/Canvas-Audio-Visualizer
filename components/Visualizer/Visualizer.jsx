import "./Visualizer.styl";
import Visualizer from './Visualizer.js';
import React from "react";

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.canvasRef = React.createRef();
    this.audioRef = React.createRef();
    this.coverRef = React.createRef();

    this.visualizer = new Visualizer(
      this.audioRef,
      this.canvasRef,
      this.coverRef,
      ["#1A1A1A", "#ff0050"],
      100,
      5,
      null,
      true
    );
  }

  canvasRef;
  audioRef;

  componentDidMount() {
    this.visualizer.init();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    this.visualizer.onResize();
  }

  onCanvasClick() {
    const audio = this.audioRef.current;
    audio.paused ? audio.play() : audio.pause();
  }

  render() {
    return (
      <div className="visualizer">
        <div className="visualizer__cover" ref={this.coverRef}>
          <img
            className="visualizer__img"
            src="/static/Media/Images/logo.png"
            onClick={this.onCanvasClick.bind(this)}
          />
          {this.props.children}
        </div>
        <canvas
          className="visualizer__canvas"
          ref={this.canvasRef}
          onClick={this.onCanvasClick.bind(this)}
        />
        <audio className="visualizer__audio" controls ref={this.audioRef} src="/static/Media/Sounds/song2.mp3" />

      </div>
    );
  }
}

