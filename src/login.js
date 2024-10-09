import React, { Component } from "react";
import Center from 'react-center';
import { TextField, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import './assets/login.css';
import Register from './Register';

const user_api_url="https://e-learning-web-app-api.herokuapp.com/api/user";

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRegister: false,
            userData: {},
            isLoading: false,
            myEventEmitter: this.props.myEventEmitter,
        }

        //functions binding
        this.login = this.login.bind(this);
        this.clearInput = this.clearInput.bind(this);
        this.changeIsRegisterToTrue = this.changeIsRegister.bind(this, true);
        this.changeIsRegisterToFalse = this.changeIsRegister.bind(this, false);
    }

    changeIsRegister(value) {
        this.setState({isRegister: value});
    }

    clearInput() {
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    }

    async login() {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        if (username === "" || password === "") {
            alert("There is still something empty!!");
        } else {

            this.setState({isLoading: true});

            // pack up userdata login for POST method
            let userLoginData = {
                username: username,
                password: password
            };
            
            // fetch api
            let response = await fetch(user_api_url + "/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userLoginData)
            }).catch(e => {
                console.log(e);
            });

            // For debugging
            // console.log(typeof(response));
            // console.log(response);
            // console.log(response.status);

            if (response.status === 200) {
                // alert("You logged in.");
                let data = await response.json();
                let userInfo = {
                    uid: data.uid,
                    username: data.username
                }
                sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                this.setState({isLoading: false});
                // console.log(JSON.parse(sessionStorage.getItem("userInfo")));     // for debug
                this.props.changeisLoggedInToTrue();
                this.state.myEventEmitter.emit('auth', true);
            } else {
                this.setState({isLoading: false});
                alert("Your username or password typed wrongly, please try again.")
            }
        }
    }

    render() {
        return (
            <div>
                {this.state.isRegister ? <Register data={{ changeIsRegisterToFalse: this.changeIsRegisterToFalse}}/> : 
                    <div className="login">
                        <Center>
                            <h1>Login</h1>
                        </Center>
                        <hr/>
                        <br/>
                        <form id="login">
                            <Center>
                                <div id="input-group">
                                    <TextField
                                        required
                                        autoFocus={true}
                                        id="username"
                                        label="Username:"
                                        variant="outlined"
                                    />
                                    <br/><br/>
                                    <TextField
                                        id="password"
                                        label="Password: *"
                                        type="password"
                                        variant="outlined"
                                    />
                                </div>
                            </Center>
                            <br/>
                            <br/>
                            <Center>
                                <Button id="login-button" variant="contained" color="default" onClick={this.login}>
                                    LOGIN
                                </Button>
                                &nbsp;	&nbsp;
                                <Button id="clear-button" variant="contained" color="default" onClick={this.clearInput}>
                                    CLEAR
                                </Button>
                                &nbsp;	&nbsp;
                                <Button id="register-button" variant="contained" color="default" onClick={this.changeIsRegisterToTrue}>
                                    REGISTER
                                </Button>
                            </Center>
                        </form>
                        <br/>
                        <Center>
                            {this.state.isLoading ? <CircularProgress/> : null}
                        </Center>
                    </div>
                }
            </div>
        );
    }
}

function LogoutPage(props) {

    const userData = JSON.parse(sessionStorage.getItem("userInfo"));
    let myEventEmitter = props.myEventEmitter;

    const logout = () => {
        sessionStorage.removeItem("userInfo");
        props.changeisLoggedInToFalse();
        myEventEmitter.emit('auth', false);
    }

    return(
        <div className="logout">
            <Center>
                <h1>Welcome {userData.username}, have a nice day and get ready to learn music!!!</h1>
            </Center>
            <hr/>
            <br/>
            <Center>
                <Button id="logout-button" variant="contained" color="secondary" onClick={logout}>LOG OUT</Button>
            </Center>
        </div>
    );
}

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            myEventEmitter: this.props.myEventEmitter
        };

        // check user login status
        if (sessionStorage.getItem('userInfo') === null) {
            this.state.isLoggedIn = false;
        } else {
            this.state.isLoggedIn = true;
        }

        this.changeisLoggedInToTrue = this.changeisLoggedIn.bind(this, true);
        this.changeisLoggedInToFalse = this.changeisLoggedIn.bind(this, false);
    }

    changeisLoggedIn(value) {
        this.setState({isLoggedIn: value});
    }

    render() {
        return (
            <div>
                {this.state.isLoggedIn ? 
                    <LogoutPage myEventEmitter={this.state.myEventEmitter} changeisLoggedInToFalse={this.changeisLoggedInToFalse} /> 
                    : <LoginPage myEventEmitter={this.state.myEventEmitter} changeisLoggedInToTrue={this.changeisLoggedInToTrue} />}
            </div>
        );
    }
}