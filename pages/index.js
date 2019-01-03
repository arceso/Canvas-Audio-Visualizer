import "../static/styles.styl";

import Head from "next/head";
import Link from "next/link";
import React from "react";

import Visualizer from "../components/Visualizer/Visualizer";

export default class extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    return { userAgent };
  }

  render() {
    const SRCS = [
      "/static/Media/Sounds/song1.mp3",
      "/static/Media/Sounds/song2.mp3",
      "/static/Media/Sounds/song3.mp3"
    ]


    const dataBundle = 
    [
      {
        src: '/static/Media/Sounds/song1.mp3',
        title: 'shhhreajg',
        subtitle: 'Code: Pandorum',
        colors: {
          accent: '#ff0000',
          secondary: '',
          foreground: '#1A1A1A',
          background: ''
        }
      },
      {
        src: '/static/Media/Sounds/song2.mp3',
        title: 'Fade',
        subtitle: 'Alan Walker',
        colors: {
          accent: '#00ff00',
          secondary: '',
          foreground: '#1A1A1A',
          background: ''
        }
      },
      {
        src: '/static/Media/Sounds/song3.mp3',
        title: 'Creep',
        subtitle: 'Radio Head',
        colors: {
          accent: '#0000ff',
          secondary: '',
          foreground: '#1A1A1A',
          background: ''
        }
      }
    ]



    return (
      <div>
        <Head>
          <title>My page title</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
            key="viewport"
          />
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons"rel="stylesheet" />
        </Head>
        <Visualizer
          circleRadius={100}
          shake={5}
          coverVibrates={true}
          curves={5}
          innerCurves={2}
          curvesOffset={6}
          data={dataBundle}
        >
          <img
            className="visualizer__img"
            src="/static/Media/Images/logo.png"
          />
        </Visualizer>
      </div>
    );
  }
}
