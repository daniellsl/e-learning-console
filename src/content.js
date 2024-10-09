import React from "react";
import Center from 'react-center';
import { Router, Route, Link, Redirect, Switch } from 'react-router';
import Keyboard from "./keyboard.js";
import Metronome from "./metronome.js";
// import Tuner from "./tuner.js";

export default function Content() {
    
    return (
        <Center>
            <div className="content">
                <Route path="/keyboard">
                    <Keyboard />
                </Route>
                {/* <br/> */}
                <Route path="metronome">
                    <Metronome />
                </Route>
            </div>
        </Center>
    );
}