import React, { Component } from "react";
import Center from 'react-center';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';
import Soundfont from 'soundfont-player';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import { Button } from '@material-ui/core';

class SoundfontProvider extends Component {
  
    static defaultProps = {
      format: 'mp3',
      soundfont: 'MusyngKite',
      instrumentName: 'acoustic_grand_piano',
    };
  
    constructor(props) {
      super(props);
      this.state = {
        activeAudioNodes: {},
        instrument: null,
      };
    }
  
    componentDidMount() {
      this.loadInstrument(this.props.instrumentName);
    }
  
    componentDidUpdate(prevProps, prevState) {
      if (prevProps.instrumentName !== this.props.instrumentName) {
        this.loadInstrument(this.props.instrumentName);
      }
    }
  
    loadInstrument = instrumentName => {
      // Re-trigger loading state
      this.setState({
        instrument: null,
      });
      Soundfont.instrument(this.props.audioContext, instrumentName, {
        format: this.props.format,
        soundfont: this.props.soundfont,
        nameToUrl: (name, soundfont, format) => {
          return `${this.props.hostname}/${soundfont}/${name}-${format}.js`;
        },
      }).then(instrument => {
        this.setState({
          instrument,
        });
      });
    };
  
    playNote = midiNumber => {
      this.props.audioContext.resume().then(() => {
        const audioNode = this.state.instrument.play(midiNumber);
        this.setState({
          activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
            [midiNumber]: audioNode,
          }),
        });
      });
    };
  
    stopNote = midiNumber => {
      this.props.audioContext.resume().then(() => {
        if (!this.state.activeAudioNodes[midiNumber]) {
          return;
        }
        const audioNode = this.state.activeAudioNodes[midiNumber];
        audioNode.stop();
        this.setState({
          activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
            [midiNumber]: null,
          }),
        });
      });
    };
  
    // Clear any residual notes that don't get called with stopNote
    stopAllNotes = () => {
      this.props.audioContext.resume().then(() => {
        const activeAudioNodes = Object.values(this.state.activeAudioNodes);
        activeAudioNodes.forEach(node => {
          if (node) {
            node.stop();
          }
        });
        this.setState({
          activeAudioNodes: {},
        });
      });
    };
  
    render() {
      return this.props.render({
        isLoading: !this.state.instrument,
        playNote: this.playNote,
        stopNote: this.stopNote,
        stopAllNotes: this.stopAllNotes,
      });
    }
}

export default class Keyboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstNote: 'c3',
      lastNote: 'f5',
      // firstNote: 'A0',   // lowest
      // lastNote: 'c8',    // highest
      currentOctive: 0,
      audioContext: new (window.AudioContext || window.webkitAudioContext)(),
      soundfontHostname: "https://d1pzp51pvbm36p.cloudfront.net",
      w: window.innerWidth*0.6,
      soundlist: require("./component/soundList.json"),
      currentSound: "",
      currentSoundIndex: 0
    }

    // init currentSound
    this.state.currentSound = this.state.soundlist[this.state.currentSoundIndex];

    // function binding
    this.handleSoundChangeToPrevious = this.handleSoundChange.bind(this, 'p');
    this.handleSoundChangeToNext = this.handleSoundChange.bind(this, 'n');
    this.handleKeyboardShortcutsChangeToPrevious = this.handleKeyboardShortcutsChange.bind(this, 'p');
    this.handleKeyboardShortcutsChangeToNext = this.handleKeyboardShortcutsChange.bind(this, 'n');
    this.handleOctiveChangeToPrevious = this.handleOctiveChange.bind(this, 'p');
    this.handleOctiveChangeToNext = this.handleOctiveChange.bind(this, 'n');
    this.handleReset = this.handleReset.bind(this);
  }

  handleSoundChange(value) {
    switch (value) {
      case 'p':
        if (this.state.currentSoundIndex > 0) {
          let tempOfCurrentSoundIndex = this.state.currentSoundIndex - 1;
          this.setState({
            currentSoundIndex: tempOfCurrentSoundIndex,
            currentSound: this.state.soundlist[tempOfCurrentSoundIndex]
          });
        }

        // For debugging
        // console.log("current Sound Index is: " + this.state.currentSoundIndex);
        // console.log("previous button clicked");
        break;
      case 'n':
        if (this.state.currentSoundIndex + 1 < this.state.soundlist.length) {
          let tempOfCurrentSoundIndex = this.state.currentSoundIndex + 1;
          this.setState({
            currentSoundIndex: tempOfCurrentSoundIndex,
            currentSound: this.state.soundlist[tempOfCurrentSoundIndex]
          });
        }

        // For debugging
        // console.log("current Sound Index is: " + this.state.currentSoundIndex);
        // console.log("next button clicked");
        break;
      default:
    }
  }

  handleKeyboardShortcutsChange(value) {

    let currentFirstNoteName = this.state.firstNote.substring(0, 1);
    let currenFirstNoteOctive = parseInt(this.state.firstNote.substr(1));
    let currentLastNoteName = this.state.lastNote.substring(0, 1);
    let currenLastNoteOctive = parseInt(this.state.lastNote.substr(1));
    let tempOfCurrentOctive = this.state.currentOctive;
    const noteNameArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

    const findNoteIndex = (noteName) => {
      for (let i = 0; i < noteNameArr.length; i++) {
        if (noteName === noteNameArr[i]) {
          if (value === 'p') {
            if (i === 0) {
              return 6;
            } else {
              return (i - 1);
            }
          } else if (value === 'n') {
            if (i === 6) {
              return 0;
            } else {
              return (i + 1);
            }
          }
        }
      }
    }

    switch (value) {
      case 'p':
        if (this.state.firstNote === 'a0') {
          // do nothing
        } else if (currentFirstNoteName === 'c') {
          currenFirstNoteOctive -= 1;
          let tempOfFirstNote = 'b' + currenFirstNoteOctive.toString();
          let tempOfLastNote = 'e' + currenLastNoteOctive.toString();
          this.setState({firstNote: tempOfFirstNote, lastNote: tempOfLastNote});
        } else if (currentLastNoteName === 'c') {
          currenLastNoteOctive -= 1;
          let tempOfLastNote = 'b' + currenLastNoteOctive.toString();
          let tempOfFirstNote = 'f' + currenFirstNoteOctive.toString();
          this.setState({firstNote: tempOfFirstNote, lastNote: tempOfLastNote});
        } else {
          let tempOfFirstNoteIndex = findNoteIndex(currentFirstNoteName);
          let tempOfLastNoteIndex = findNoteIndex(currentLastNoteName);
          let tempOfFirstNote = noteNameArr[tempOfFirstNoteIndex] + currenFirstNoteOctive.toString();
          let tempOfLastNote = noteNameArr[tempOfLastNoteIndex] + currenLastNoteOctive.toString();
          this.setState({firstNote: tempOfFirstNote, lastNote: tempOfLastNote});
        }
        break;
      case 'n':
        if (this.state.lastNote === 'c8') {
          // do nothing
        } else if (currentFirstNoteName === 'b') {
          currenFirstNoteOctive += 1;
          let tempOfFirstNote = 'c' + currenFirstNoteOctive.toString();
          let tempOfLastNote = 'f' + currenLastNoteOctive.toString();
          this.setState({firstNote: tempOfFirstNote, lastNote: tempOfLastNote});
        } else if (currentLastNoteName === 'b') {
          currenLastNoteOctive += 1;
          let tempOfLastNote = 'c' + currenLastNoteOctive.toString();
          let tempOfFirstNote = 'g' + currenFirstNoteOctive.toString();
          this.setState({firstNote: tempOfFirstNote, lastNote: tempOfLastNote});
        } else {
          let tempOfFirstNoteIndex = findNoteIndex(currentFirstNoteName);
          let tempOfLastNoteIndex = findNoteIndex(currentLastNoteName);
          let tempOfFirstNote = noteNameArr[tempOfFirstNoteIndex] + currenFirstNoteOctive.toString();
          let tempOfLastNote = noteNameArr[tempOfLastNoteIndex] + currenLastNoteOctive.toString();
          this.setState({firstNote: tempOfFirstNote, lastNote: tempOfLastNote});
        }
        break;
      default:
    }

    // update current octive
    tempOfCurrentOctive = - (3 - currenFirstNoteOctive);
    this.setState({currentOctive: tempOfCurrentOctive});
  }

  handleOctiveChange(value) {

    let currentFirstNoteName = this.state.firstNote.substring(0, 1);
    let currenFirstNoteOctive = parseInt(this.state.firstNote.substr(1));
    let currentLastNoteName = this.state.lastNote.substring(0, 1);
    let currenLastNoteOctive = parseInt(this.state.lastNote.substr(1));
    let tempOfCurrentOctive = this.state.currentOctive;

    switch (value) {
      // For decreasing octive function
      case 'p':
        if (currenFirstNoteOctive - 1 === 0) {
          switch (currentFirstNoteName) {
            case 'a':
              this.setState({firstNote: 'a0', lastNote: 'd3'});
              break;
            case 'b':
              this.setState({firstNote: 'b0', lastNote: 'e3'});
              break;
            default:
              this.setState({firstNote: 'a0', lastNote: 'd3'});
          }
          currenFirstNoteOctive = 0;
        } else if (currenFirstNoteOctive - 1 < 0) {
          if (this.state.firstNote === 'b0') {
            this.setState({firstNote: 'a0', lastNote: 'd3'});
          }
        } else {
          currenFirstNoteOctive -= 1;
          currenLastNoteOctive -= 1;
          let tempOfFirstNote = currentFirstNoteName + currenFirstNoteOctive.toString();
          let tempOfLastNote = currentLastNoteName + currenLastNoteOctive.toString();
          this.setState({firstNote: tempOfFirstNote, lastNote: tempOfLastNote});
        }
        // For debugging
        // console.log("Now first changed to: " + this.state.firstNote);
        // console.log("previous button clicked");
        break;
      
      // For adding octive function
      case 'n':
        if (currenLastNoteOctive + 1 > 8) {
          // do nothing
        } else if (currenLastNoteOctive + 1 === 8) {
          this.setState({firstNote: 'g5', lastNote: 'c8'});
          currenFirstNoteOctive = 5;
        } else {
          currenFirstNoteOctive += 1;
          currenLastNoteOctive += 1;
          let tempOfFirstNote = currentFirstNoteName + currenFirstNoteOctive.toString();
          let tempOfLastNote = currentLastNoteName + currenLastNoteOctive.toString();
          this.setState({firstNote: tempOfFirstNote,lastNote: tempOfLastNote});
        }
        // For debugging
        // console.log("Now first changed to: " + this.state.firstNote);
        // console.log("Now last changed to: " + this.state.lastNote);
        // console.log("next button clicked");
        break;
      default:
    }

    // update current octive
    tempOfCurrentOctive = - (3 - currenFirstNoteOctive);
    this.setState({currentOctive: tempOfCurrentOctive});
  }

  handleReset() {
    this.setState({
      firstNote: 'c3',
      lastNote: 'f5',
      currentOctive: 0,
      currentSoundIndex: 0,
      currentSound: "acoustic_grand_piano",
    })
  }

  render() {

    let keyboardShortcuts = KeyboardShortcuts.create({
      firstNote: MidiNumbers.fromNote(this.state.firstNote),
      lastNote: MidiNumbers.fromNote(this.state.lastNote),
      keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });

    return (
        <div className="keyboard">
            <Center>
                <h1>Keyboard</h1>
            </Center>
            <hr/>
            <br/>
            <br/>
            <Center>
                <div>
                    <SoundfontProvider
                        instrumentName={this.state.currentSound}
                        audioContext={this.state.audioContext}
                        hostname={this.state.soundfontHostname}
                        render={({ isLoading, playNote, stopNote }) => (
                            <Piano
                              noteRange={{ first: MidiNumbers.fromNote(this.state.firstNote), last: MidiNumbers.fromNote(this.state.lastNote) }}
                              width={this.state.w}
                              playNote={playNote}
                              stopNote={stopNote}
                              disabled={isLoading}
                              keyboardShortcuts={keyboardShortcuts}
                            />
                        )}
                    />
                </div>
            </Center>
            <br/>
            <br/>
            <div className="control-group">
              <Center>
                <div className="control-sound-group">
                  <IconButton className="previous-sound-button" onClick={this.handleSoundChangeToPrevious}>
                    <ChevronLeftRoundedIcon/>
                  </IconButton>
                  {this.state.currentSound}
                  <IconButton className="next-sound-button" onClick={this.handleSoundChangeToNext}>
                    <ChevronRightRoundedIcon/>
                  </IconButton>
                </div>
              </Center>
              <Center>
                <div className="control-keyboardShortcuts-group">
                  <IconButton className="previous-sound-button" onClick={this.handleKeyboardShortcutsChangeToPrevious}>
                    <ChevronLeftRoundedIcon/>
                  </IconButton>
                  {this.state.firstNote}
                  <IconButton className="next-sound-button" onClick={this.handleKeyboardShortcutsChangeToNext}>
                    <ChevronRightRoundedIcon/>
                  </IconButton>
                </div>
              </Center>
              <Center>
                <div className="control-octive-group">
                  <IconButton className="previous-sound-button" onClick={this.handleOctiveChangeToPrevious}>
                    <ChevronLeftRoundedIcon/>
                  </IconButton>
                  {this.state.currentOctive}
                  <IconButton className="next-sound-button" onClick={this.handleOctiveChangeToNext}>
                    <ChevronRightRoundedIcon/>
                  </IconButton>
                </div>
              </Center>
            </div>
            <br/>
            <div className="reset-button">
              <Center>
                  <Button id="reset-button" variant="contained" color="default" onClick={this.handleReset}> RESET</Button>
              </Center>
            </div>
        </div>
    );
  }
}