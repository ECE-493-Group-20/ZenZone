/*
References:

https://www.twilio.com/en-us/blog/audio-visualisation-web-audio-api--react
*/

import React, { Component } from 'react';

class AudioAnalyser extends Component {
    componentDidMount() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();  // Second for Safari compatibility
        this.analyser = this.audioContext.createAnalyser();
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.source = this.audioContext.createMediaStreamSource(this.props.audio);
        this.source.connect(this.analyser);
        this.rafID = requestAnimationFrame(this.tick);
    }

}

export default AudioAnalyser;