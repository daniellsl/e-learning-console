import React from "react";
import Center from 'react-center';
import { 
    BrowserRouter as Router, 
    Route, 
    Link, 
    Switch, 
} from 'react-router-dom';
import ReactPlayer from "react-player";

function Course(props) {
    let pianoCourseList = require("./component/pianoCourses.json");
    let guitarCourseList = require("./component/guitarCourses.json");
    let title;
    let videoURL;
    let sheetHTML;
    let sheetProp;

    if (props.courseType === "piano") {
        title = pianoCourseList[props.courseId].title;
        videoURL = pianoCourseList[props.courseId].videoURL;
        sheetHTML = pianoCourseList[props.courseId].sheetHTML;
        sheetProp = {__html: sheetHTML};
    } else if (props.courseType === "guitar") {
        title = guitarCourseList[props.courseId].title;
        videoURL = guitarCourseList[props.courseId].videoURL;
        sheetHTML = guitarCourseList[props.courseId].sheetHTML;
        sheetProp = {__html: sheetHTML};
    }

    return (
        <div className="course">
            <hr/>
            <Center>
                <h1>{title}</h1>
            </Center>
            <Center>
                <ReactPlayer url={videoURL} controls={true} />
            </Center>
            <br/>
            <div dangerouslySetInnerHTML={sheetProp} />
        </div>
    );
}

function MusicSheet(props) {
    let title;
    let videoURL;
    let sheetHTML;
    let sheetProp;

    switch(props.musicSheetName) {
        case "canon_in_d":
            title = "Canon in D";
            videoURL = "https://www.youtube.com/watch?v=1elGqARTb1Q&ab_channel=Jacob%27sPiano";
            sheetHTML = "<iframe width='100%' height='770' src='https://musescore.com/user/28510088/scores/6646054/s/AODcUK/embed' frameborder='0' allowfullscreen allow='autoplay; fullscreen'></iframe>";
            break;
        case "river_flows_in_you":
            title = "River Flows in You";
            videoURL = "https://www.youtube.com/watch?v=P_xFh7XFC_w&ab_channel=SunghaJung";
            sheetHTML = "<iframe width=\"100%\" height=\"770\" src=\"https://musescore.com/user/12292061/scores/4936309/embed\" frameborder=\"0\" allowfullscreen allow=\"autoplay; fullscreen\"></iframe>";
            break;
        default:
    }
    sheetProp = {__html: sheetHTML};

    return (
        <div className="music-sheet">
            <hr/>
            <Center>
                <h1>{title}</h1>
            </Center>
            <Center>
                <ReactPlayer url={videoURL} controls={true} />
            </Center>
            <br/>
            <div dangerouslySetInnerHTML={sheetProp} />
        </div>
    );
}

export default function Lessons() {
    return (
        <div className="lessons">
            <Center>
                <h1>Lessons</h1>
            </Center>
            <hr/>
            <br/>
            <Router>
                <nav>
                    <h3>Music Sheets</h3>
                    <ul>
                        <li>
                            <Link to="/lessons/canon_in_d">Canon in D</Link>
                        </li>
                        <li>
                            <Link to="/lessons/river_flows_in_you">River Flows In You</Link>
                        </li>
                    </ul>
                    <h3>Music Lessons</h3>
                    <ul>
                        <li>
                            <Link to="/lessons/lv1piano">Level 1 Piano Courses</Link>
                        </li>
                        <li>
                            <Link to="/lessons/lv2piano">Level 2 Piano Courses</Link>
                        </li>
                        <li>
                            <Link to="/lessons/lv1guitar">Level 1 Guitar Courses</Link>
                        </li>
                        <li>
                            <Link to="/lessons/lv5guitar">Level 5 Guitar Courses</Link>
                        </li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/lessons/canon_in_d">
                        <MusicSheet musicSheetName="canon_in_d" />
                    </Route>
                    <Route path="/lessons/river_flows_in_you">
                        <MusicSheet musicSheetName="river_flows_in_you" />
                    </Route>
                    <Route path="/lessons/lv1piano">
                        <Course courseId="0" courseType="piano" />
                    </Route>
                    <Route path="/lessons/lv2piano">
                        <Course courseId="1" courseType="piano" />
                    </Route>
                    <Route path="/lessons/lv1guitar">
                        <Course courseId="0" courseType="guitar" />
                    </Route>
                    <Route path="/lessons/lv5guitar">
                        <Course courseId="1" courseType="guitar" />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}