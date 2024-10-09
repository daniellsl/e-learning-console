import React, { Component, useRef, useEffect, useCallback } from "react";
import Center from 'react-center';
import Button from '@material-ui/core/Button';
import getUserMedia from "get-user-media-promise";
import MicrophoneStream from "microphone-stream";
import Pitchfinder from "pitchfinder";

// create a canvas for the output drawing
const Canvas = props => {

    const canvasRef = useRef(null);
    const freq = props.freq;
    const notename = props.notename;
    const msg = props.msg;

    const draw = useCallback(ctx => {
        ctx.fillStyle = 'white';

        if(msg === "In Tune") {
            ctx.fillStyle = '#66ff33';
        } else if (msg === "Not Yet Start" || msg === "Stop Tuning" || msg === "Listening" ) {
            ctx.fillStyle = '#6699ff';
        } else if (msg === "Little High" || msg === "Little Low") {
            ctx.fillStyle = '#ffff66';
        }

        ctx.textAlign = "center";
        ctx.font = "32px Arial";
        ctx.fillText(freq.toFixed(2), ctx.canvas.width/2, ctx.canvas.height - 150);
        
        ctx.font = "64px Arial";
        ctx.fillText(notename, ctx.canvas.width/2, ctx.canvas.height - 50);

        ctx.font = "64px Arial";
        ctx.fillText(msg, ctx.canvas.width/2, ctx.canvas.height - 250);

        ctx.fill();
    }, [freq, notename, msg]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.canvas.width = 400;
        context.canvas.height = 400;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        // DARW HERE
        draw(context);
      }, [draw]);

    return <canvas ref={canvasRef} {...props}/>
}

export default class Tuner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            micStream: new MicrophoneStream(),
            A: 440,
            SEMITONE: 69,
            freq: 440,
            notename: "A",
            msg: "Not Yet Start",
            isStartButtonClicked: false,
            noteStrings: [
                "C",
                "C♯/Db",
                "D",
                "D♯/Eb",
                "E",
                "F",
                "F♯/Gb",
                "G",
                "G♯/Ab",
                "A",
                "A♯/Bb",
                "B"
            ],
            guitar: [
                {note: "E4", freq: 329.63},
                {note: "B3", freq: 246.94},
                {note: "G3", freq: 196.00},
                {note: "D3", freq: 146.83},
                {note: "A2", freq: 110.00},
                {note: "E2", freq: 82.41}
            ]
        };

        // functions binding
        this.startListening = this.startListening.bind(this);
        this.stopListening = this.stopListening.bind(this);
        this.getNote = this.getNote.bind(this);
        this.getNearNoteMsg = this.getNearNoteMsg.bind(this);
    }

    // componentDidMount() {

    // }

    startListening() {
        if(!this.state.isStartButtonClicked) {
            // console.log("start tuning");
            this.setState({isStartButtonClicked: true});
            this.setState({msg: "Listening"});
            getUserMedia({video: false, audio: true})
                .then(stream => {
                    const tempStream = new MicrophoneStream(stream, {bufferSize: 2048});
                    this.setState(state => ({
                        micStream: tempStream
                    }));
    
                    this.state.micStream.on('data', chunk => {
    
                        // console.log("listening");
                        
                        const detectPitch = new Pitchfinder.AMDF({
                            maxFrequency: 800,
                            minFrequency: 50
                        });
            
                        var pitch = detectPitch(MicrophoneStream.toRaw(chunk));
                        if (pitch) {
                            const freq = pitch;
                            // const note = this.getNote(freq);
                            // const notename = this.state.noteStrings[note % 12];
                            const msg = this.getNearNoteMsg(freq);
    
                            this.setState({freq: freq});
                            this.setState({msg: msg});
                        }
                    });
    
                }).catch(error => {
                    console.log(error);
                });
        }
    }
    
    stopListening() {
        // console.log("stop tuning");
        this.state.micStream.stop();
        this.setState({isStartButtonClicked: false});
        this.setState({msg: "Stop Tuning"});
    }

    getNote = freq => {
        const note = 12 * (Math.log(freq / this.state.A) / Math.log(2));
        return Math.round(note) + this.state.SEMITONE;
    };

    getNearNoteMsg = freq => {
        let closestNote = -1;
        let recordDiff = Infinity;
        let msg = "In Tune";
        for(let i = 0; i < this.state.guitar.length; i++) {
            let diff = freq - this.state.guitar[i].freq;
            if(Math.abs(diff) < Math.abs(recordDiff)) {
                closestNote = this.state.guitar[i].note;
                recordDiff = diff;
                this.setState({notename: closestNote});
            }
        }

        // console.log(`diff is ${recordDiff}`);

        if(Math.abs(recordDiff) <= 0.5) {
            msg = "In Tune";
        } else if(recordDiff > 0.5 && recordDiff <= 1) {
            msg = "Little High";
        } else if(recordDiff > 1) {
            msg = "Too High";
        } else if(recordDiff >= -1 && recordDiff < -0.5) {
            msg = "Little Low";
        } else if(recordDiff < -1) {
            msg = "Too Low";
        }

        return msg;
    };

    render() {
        return(
            <div id="tuner" ref={this.myRef}>
                <Center>
                    <h1>Tuner</h1>
                </Center>
                <hr/>
                <br/>
                <br/>
                <Center>
                    <Canvas freq={this.state.freq} notename={this.state.notename} msg={this.state.msg}/>
                </Center>
                <Center>
                    <div>
                        <br/>
                        <Button id="tuner-start" onClick={this.startListening}>Start Tuning</Button>
                        <Button id="tuner-stop" onClick={this.stopListening}>Stop Tuning</Button>
                    </div>
                </Center>
            </div>
        );
    }
}