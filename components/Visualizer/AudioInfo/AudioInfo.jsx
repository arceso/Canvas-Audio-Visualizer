import "./AudioInfo.styl";
import React from "react";

export default class AudioInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      track: 0,
      currentTime: 0
    };

    this.audio = null;

    this.timeColorRef = new React.createRef();
    this.timeLineRef = new React.createRef();
    this.timeCurrentRef = new React.createRef();
  }

  componentDidMount() {
    this.audio = this.props.audioRef.current;
    setInterval(this.updateTimeReaders.bind(this), 50);
    this.audio.addEventListener(
      "ended",
      (() => {
        this.setState({ playing: true });
        this.setNext();
      }).bind(this)
    );
  }

  updateTimeReaders() {
    this.updateTimeLine();
    this.setState({ currentTime: this.audio.currentTime });
  }

  updateTimeLine() {
    const POSITION =
      (this.timeLineRef.current.offsetWidth -
        this.timeCurrentRef.current.offsetWidth) *
        (this.audio.currentTime / this.audio.duration) +
      "px";

    this.timeCurrentRef.current.style.transform =
      "translateX(" + POSITION + ") translateY(-50%)";

    this.timeColorRef.current.style.width = POSITION;
  }

  setPrev() {
    this.setState(
      {
        track:
          this.state.track - 1 < 0
            ? this.props.data.length - 1
            : this.state.track - 1
      },
      this.changeSong.bind(this)
    );
  }

  onPlayPauseClick() {
    this.setState({ playing: !this.state.playing });
    if (this.state.playing) this.audio.play();
    else this.audio.pause();
  }

  setNext() {
    this.setState(
      {
        track:
          this.state.track + 1 == this.props.data.length
            ? 0
            : this.state.track + 1
      },
      this.changeSong.bind(this)
    );
  }

  changeSong() {
    const HAVE_TO_RESUME = this.state.playing || !this.audio.paused;
    console.log(HAVE_TO_RESUME);
    this.setTrack();
    if (HAVE_TO_RESUME) this.audio.play();
    this.props.onSongChange(this.state.track);
  }

  setTrack() {
    this.audio.src = this.props.data[this.state.track].src;
  }

  onTimeLineClick(event) {
    this.audio.currentTime =
      ((event.clientX - this.timeLineRef.current.offsetLeft) /
        this.timeLineRef.current.offsetWidth) *
      this.audio.duration;
  }

  formatToMinutes(time) {
    let fTime = Math.floor(time),
      minutes = Math.floor(fTime / 60),
      seconds = fTime - minutes * 60;

    if (seconds < 10) seconds = "0" + seconds;
    seconds = seconds.toString().substring(0, 2);

    return minutes + ":" + seconds || "0:00";
  }

  formatToMonospace(string) {
    return string.split("").map((char, i) => (
      <span className="c-audio-info__time-text-monospace" key={i}>
        {char}
      </span>
    ));
  }

  render() {
    const TIME_STYLE = {
      backgroundColor: this.props.data[this.state.track].colors.accent
    };
    return (
      <div className="c-audio-info">
        <div className="c-audio-info__time-text">
          <p className="c-audio-info__time-text-current">
            {this.formatToMonospace(
              this.formatToMinutes(this.state.currentTime)
            )}
          </p>
          <span className="c-audio-info__time-text-separator">/</span>
          <p className="c-audio-info__time-text-duration">
            {this.formatToMonospace(
              this.formatToMinutes(this.audio && this.audio.duration)
            )}
          </p>
        </div>
        <div className="c-audio-info__controls">
          <i className="material-icons" onClick={this.setPrev.bind(this)}>
            skip_previous
          </i>
          <i
            className="material-icons"
            onClick={this.onPlayPauseClick.bind(this)}
          >
            {this.state.playing ? "play_arrow" : "pause_arrow"}
          </i>
          <i className="material-icons" onClick={this.setNext.bind(this)}>
            skip_next
          </i>
        </div>
        <div className="c-audio-info__labels">
          <p className="c-audio-info__labels-title">
            {this.props.data[this.state.track].title}
          </p>
          <p className="c-audio-info__labels-author">
            {this.props.data[this.state.track].subtitle}
          </p>
        </div>
        <div
          className="c-audio-info__time-line"
          ref={this.timeLineRef}
          onClick={this.onTimeLineClick.bind(this)}
        >
          <div className="c-audio-info__time-line-rail">
            <div
              className="c-audio-info__time-line-color"
              ref={this.timeColorRef}
              style={TIME_STYLE}
            />
            <div
              className="c-audio-info__time-line-current"
              ref={this.timeCurrentRef}
            />
          </div>
        </div>
      </div>
    );
  }
}
