import React from "react";
import Center from 'react-center';
import { TextField, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const api_url="https://e-learning-web-app-api.herokuapp.com/api/user";

export default function Register(props) {

    const [isLoading, setIsLoading] = React.useState(false);

    const submitRegister = () => {

        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirm-password").value;

        // check if any empty input
        if(username === "" || password === "" || confirmPassword === "") {
            alert("There is still something empty!!");
        } else if(password === confirmPassword) {

            setIsLoading(true);

            // pack up userdata login for POST method
            let userLoginData = {
                username: username,
                password: password
            };
            
            // fetch api
            fetch(api_url + "/reg", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userLoginData)
            }).then(response => {

                // For debugging
                // console.log(typeof(response));
                // console.log(response);
                // console.log(response.status);
    
                if(response.status === 200) {
                    alert("Successful");
                    props.data.changeIsRegisterToFalse();
                } else {
                    alert("Username already exist, please try again.")
                }
                setIsLoading(false);
            }).catch(e => {
                console.log(e);
                setIsLoading(false);
            });
        } else {
            alert("Your password is not the same!!!");
            setIsLoading(false);
        }
    }

    const clearInput = () => {
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        document.getElementById("confirm-password").value = "";
    }

    const ProgressComponent = () => {
        return (
            <div className="register-progress">
                <Center>
                    <CircularProgress/>
                </Center>
            </div>
        );
    }

    return (
        <div className="register">
            <Center>
                <h1>Register</h1>
            </Center>
            <hr/>
            <br/>
            <form id="register">
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
                        <br/><br/>
                        <TextField
                            id="confirm-password"
                            label="Confirm-Password: *"
                            type="password"
                            variant="outlined"
                        />
                    </div>
                </Center>
                <br/>
                <br/>
                <Center>
                    <Button id="submit-button" variant="contained" color="default" onClick={submitRegister}>
                        SUBMIT
                    </Button>
                    &nbsp;	&nbsp;
                    <Button id="clear-button" variant="contained" color="default" onClick={clearInput}>
                        CLEAR
                    </Button>
                    &nbsp;	&nbsp;
                    <Button id="backToLogin-button" variant="contained" color="default" onClick={props.data.changeIsRegisterToFalse}>
                        BACK
                    </Button>
                </Center>
            </form>
            <br/>
            {isLoading ? <ProgressComponent/> : null}
            
        </div>
    );
}