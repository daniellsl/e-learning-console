import React, { Component, useEffect} from 'react';
import Center from 'react-center';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Replay5Icon from '@material-ui/icons/Replay5';
import Forward5Icon from '@material-ui/icons/Forward5';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import PublishIcon from '@material-ui/icons/Publish';
// import Grid from '@material-ui/core/Grid';
import './assets/interact.css';

const music_api_url = "https://e-learning-web-app-api.herokuapp.com/api/music";

// component for card
function MusicCard(props) {

    const classes = useStyles();
    const [progress, setProgress] = React.useState(0);
    const [isCurrentSongPlaying, setIsCurrentSongPlaying] = React.useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(() => {
                let status = (props.audioEl.duration - props.audioEl.currentTime) / props.audioEl.duration;
                status =  (1 - status) * 100;
                return status;
            });
        }, 650);
        return () => {
            clearInterval(timer);
        };
        
    // eslint-disable-next-line
    }, []);

    const stopAudio = () => {
        props.audioEl.pause();
        props.audioEl.currentTime = 0;
        setIsCurrentSongPlaying(false);
        props.changeIsMusicPlayingToFalse();
    }

    const playAudio = () => {
        if (!props.isMusicPlaying) {
            props.audioEl.play();
            setIsCurrentSongPlaying(true);
            props.changeIsMusicPlayingToTrue();
        }
    }

    const pauseAudio = () => {
        props.audioEl.pause();
        setIsCurrentSongPlaying(false);
        props.changeIsMusicPlayingToFalse();
    }

    const PlayIconButton = () => {
        return(
            <div>
                <IconButton aria-label="play-button" onClick={playAudio}>
                    <PlayArrowIcon className={classes.playIcon} />
                </IconButton>
            </div>
        );
    }

    const PauseIconButton = () => {
        return(
            <div>
                <IconButton aria-label="pause-button" onClick={pauseAudio}>
                    <PauseIcon className={classes.pauseIcon} />
                </IconButton>
            </div>
        );
    }

    const StopIconButton = () => {
        return(
            <div>
                <IconButton aria-label="stop-button" onClick={stopAudio}>
                    <StopIcon className={classes.stopIcon} />
                </IconButton>
            </div>
        );
    }

    const replayFiveSeconds = () => {
        props.audioEl.currentTime -= 5;
    }

    const forwardFiveSeconds = () => {
        if(props.audioEl.currentTime === props.audioEl.duration || (props.audioEl.currentTime + 5) > props.audioEl.duration) {
            props.audioEl.currentTime = props.audioEl.duration;
        } else {
            props.audioEl.currentTime += 5;
        }
    }

    return(
        <div className="interact-card">
            <Card className={classes.root}>
                <div>
                    <CardContent className={classes.content}>
                        <Typography component="h5" variant="h5">
                            {props.musicname}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {props.auth}
                        </Typography>
                    </CardContent>

                    <LinearProgress variant="determinate" value={progress} />

                    {/* controls buttons */}
                    <Center>
                        <div className={classes.controls}>
                            <IconButton aria-label="replay5" onClick={replayFiveSeconds}>
                                <Replay5Icon/>
                            </IconButton>
                            {props.audioEl.currentTime === props.audioEl.duration ? <StopIconButton/> : (isCurrentSongPlaying ? <PauseIconButton/> : <PlayIconButton/>)}
                            <IconButton aria-label="forward5" onClick={forwardFiveSeconds}>
                                <Forward5Icon />
                            </IconButton>
                        </div>
                    </Center>
                </div>
            </Card>
        </div>
    );
}

// component for upload button
function UploadButton(props) {
    return(
        <div className="upload-button-group">
            <IconButton color="primary" size="medium" onClick={props.showModal}>
                <CloudUploadIcon aria-label="upload-button" />
            </IconButton>
        </div>
    );
}

// component when fetching data
function FetchLoading() {
    return(
        <div className="loading-music-circular-progress">
            <Center>
                <CircularProgress/>
            </Center>
        </div>
    );
}

// component 
function InteractContent(props) {
    // const FormRow = () => {
    //     return(
    //         <React.Fragment>

    //         </React.Fragment>
    //     );
    // }

    return(
        
        <div className="interact-content">
            {props.musics === null ? (
                <Center>
                    <h5>There is no music</h5>
                </Center>
            ) : (
                props.musics.map((music, index)=>(
                    <MusicCard
                        key={index}
                        musicname={music.musicname}
                        auth={music.auth}
                        audioEl={music.audioEl}
                        isMusicPlaying={props.isMusicPlaying}
                        changeIsMusicPlayingToTrue={props.changeIsMusicPlayingToTrue}
                        changeIsMusicPlayingToFalse={props.changeIsMusicPlayingToFalse}
                    />
                ))
            )}
        </div>
    );

    // return(
    //     <div className="interact-content">
    //         <Grid container spacing={1}>

    //         </Grid>
    //     </div>
    // );
}

export default class Interact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isMusicPlaying: false,
            isLoggedIn: false,
            isFetching: true,
            musics: [],
            isUploading: false,
        }

        if (sessionStorage.getItem("userInfo") === null) {
            this.state.isLoggedIn = false;
        } else {
            this.state.isLoggedIn = true;
        }

        // Function binding
        this.changeIsMusicPlayingToTrue = this.changeIsMusicPlaying.bind(this, true);
        this.changeIsMusicPlayingToFalse = this.changeIsMusicPlaying.bind(this, false);
        this.handleUpload = this.handleUpload.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    changeIsMusicPlaying(value) {
        this.setState({isMusicPlaying: value});
    }
    
    showModal() {
        document.getElementById("myModal").style.display = "flex";
    }
    
    hideModal() {
        document.getElementById("myModal").style.display = "none";
    }

    async handleUpload() {

        this.setState({isUploading: true});

        if (document.getElementById("myFile").files.length === 0 ){
            alert("no files selected");
        } else {
            let file = document.getElementById("myFile").files[0];
            let fileSize = file.size / Math.pow(1000,2);
            // check file size
            if (fileSize > 5 ) {
                alert("file size is too large, max size is 5MB");
            } else {
                // upload file
                let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
                var formdata = new FormData();
                formdata.append("file", file, file.name);
                formdata.append("uid", userInfo.uid);
                formdata.append("auth", userInfo.username);
                // console.log(userInfo);
                let response = await fetch("https://e-learning-web-app-api.herokuapp.com/api/music/upload", {
                    method: "POST",
                    body: formdata
                }).catch(e => {
                    console.log(e);
                });

                if (response.status === 200) {
                    alert("upload success");
                    sessionStorage.removeItem("musics");
                    window.location.reload();
                } else {
                    alert("file format incorrect, you can only upload mp3");
                }
            }
        }
        this.setState({isUploading: false});
    }

    async componentDidMount() {

        this.setState({isFetching: true});

        if (sessionStorage.getItem("musics") === null) {
            const response = await fetch(music_api_url, {
                method: "GET",
                headers: {
                    'Content-type': 'application/json'
                }
            }).catch(e => {
                console.log(e);
                this.setState({isFetching: false});
            });
            
            if (response.status === 200) {
                // console.log("response success");
                let data = await response.json();
                sessionStorage.setItem("musics", JSON.stringify(data));
                let musicsTemp = [];
                
                for (let i = 0; i < data.length; i++) {
                    musicsTemp.push({
                        musicname: data[i].musicname,
                        auth: data[i].auth,
                        audioEl: new Audio(data[i].musicUrl)
                    });
                }
                this.setState({musics: musicsTemp});
            }
        } else {
            let musicsTemp = [];
            let data = JSON.parse(sessionStorage.getItem("musics"));

            for (let i = 0; i < data.length; i++) {
                musicsTemp.push({
                    musicname: data[i].musicname,
                    auth: data[i].auth,
                    audioEl: new Audio(data[i].musicUrl)
                });
            }
            this.setState({musics: musicsTemp});
        }
        this.setState({isFetching: false});
    }

    render() {
        return (
            <div className="interact">
                <ScopedCssBaseline>
                    <Center>
                        <h1>Interact</h1>
                    </Center>
                    <hr/>
                    <br/>
                    {this.state.isLoggedIn ? <UploadButton showModal={this.showModal} /> : null }
                    {this.state.isFetching ? (
                        <FetchLoading/> 
                    ) : (
                        <InteractContent
                            musics={this.state.musics}
                            isMusicPlaying={this.state.isMusicPlaying} 
                            changeIsMusicPlayingToTrue={this.changeIsMusicPlayingToTrue} 
                            changeIsMusicPlayingToFalse={this.changeIsMusicPlayingToFalse} 
                        />
                    )}

                    <div className="modal" id="myModal">
                        <div className="modal-content">
                            <span className="close" onClick={this.hideModal}>&times;</span>
                            <p>Upload an mp3 file to share with others~~</p>
                            <input type="file" id="myFile" />
                            <div className="upload-button">
                                <IconButton onClick={this.handleUpload}>
                                    <PublishIcon/>
                                </IconButton>
                            </div>
                            {/* upload progress */}
                            {this.state.isUploading ? (
                                <Center>
                                    <CircularProgress/> 
                                </Center>
                            ) : null}
                        </div>
                    </div>
                </ScopedCssBaseline>
            </div>
        );
    }
}

// Style of interact page
const useStyles = makeStyles((theme) => ({
    root: {
        padding: '10px',
    },
    content: {
        flex: '1 0 auto',
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        padding: '5px',
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    pauseIcon: {
        height: 38,
        width: 38,
    },
    stopIcon: {
        height: 38,
        width: 38,
    },
    uploadIcon: {
        height: 50,
        width: 50,
    },
    speedDial: {
        position: "absolute",
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    },
}));