import "./Visualizer.styl";
import AudioToCanvas from "./AudioToCanvas.js";
import React from "react";

export default class Visualizer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.canvasRef = React.createRef();
    this.audioRef = React.createRef();
    this.coverRef = React.createRef();

    this.visualizer = new AudioToCanvas(
      this.audioRef,
      this.canvasRef,
      this.coverRef,
      this.parentRef,
      this.props.colors || ["black", "white"],
      this.props.circleRadius || 100,
      this.props.shake || 5,
      this.props.normalizer || null,
      this.props.coverVibrates || true
    );
  }

  canvasRef;
  audioRef;

  componentDidMount() {
    this.visualizer.init();
    window.addEventListener("resize", this.onResize.bind(this));
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
        <div
          className="visualizer__cover"
          ref={this.coverRef}
          onClick={this.onCanvasClick.bind(this)}
        >
          {this.props.children}
        </div>
        <canvas
          className="visualizer__canvas"
          ref={this.canvasRef}
          onClick={this.onCanvasClick.bind(this)}
        />
        <audio
          className="visualizer__audio"
          controls
          ref={this.audioRef}
          src="/static/Media/Sounds/song3.mp3"
        />
      </div>
    );
  }
}
