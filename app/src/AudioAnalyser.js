/*
References:

https://www.twilio.com/en-us/blog/audio-visualisation-web-audio-api--react
*/

import React, { Component } from 'react';

class AudioAnalyser extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {audioData: new Uint8Array(0)};
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();  // Second for Safari compatibility
        this.analyser = this.audioContext.createAnalyser();
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.source = this.audioContext.createMediaStreamSource(this.props.audio);
        this.source.connect(this.analyser);
        this.rafID = requestAnimationFrame(this.tick);
    }

    tick() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        this.setState({audioData: this.dataArray});
        this.rafID = requestAnimationFrame(this.tick);
    }

    render() {
        return <textarea value={this.state.audioData} />;
    }
}

export default AudioAnalyser;