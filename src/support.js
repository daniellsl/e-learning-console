import React from "react";
import Center from 'react-center';
import { TextField, FormHelperText, Button } from '@material-ui/core';
import { GoogleSpreadsheet } from "google-spreadsheet";
import './assets/support.css';
import dotenv from dotenv;

export default function Support() {
    dotenv.config();
    const creds = {
        type: process.env.GOOGLE_TYPE,
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newlines
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI,
        token_uri: process.env.GOOGLE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
    };
    const doc = new GoogleSpreadsheet('1oyfLkTfV2EzqsDn_o5vTu90O1mezhmB8gBQyG3hJNO4');
    const defaultText = "You can ask/tell me anything. \nIncluding music theroy, bug report etc. \n:P";

    const clearFormValue = () => {
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("question").value = "";
    };

    const submitFormValue = async () => {
        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo();

        // check email format
        var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var emailFormatIsValid = false;
        if (document.getElementById("email").value.match(mailformat)) {
            emailFormatIsValid = true;
        }

        if (document.getElementById("name").value !== "" && document.getElementById("email").value !== "" && emailFormatIsValid && document.getElementById("question").value !== "") {
            // then append to google sheet
            const sheet = doc.sheetsByIndex[0];
            await sheet.addRow({
                Name: document.getElementById("name").value,
                Email: document.getElementById("email").value,
                Question: document.getElementById("question").value
            });

            alert("Your question has been uploaded.")

            // clear input after upload the data
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("question").value = "";
        } else {
            if (document.getElementById("name").value === "") {
                alert("There is still something empty!!");
            } else if (document.getElementById("email").value === "") {
                alert("There is still something empty!!");
            } else if (document.getElementById("question").value === "") {
                alert("There is still something empty!!");
            } else if (!emailFormatIsValid) {
                alert("Email format is invalid.")
            }
        }
    }

    return (
        <div className="support">
            <Center>
                <h1>Support</h1>
            </Center>
            <hr />
            <br />
            <form id="support-form">
                <Center>
                    <div className="input">
                        <TextField required autoFocus={true} id="name" label="Name:" />
                        <br />
                        <TextField required id="email" label="Email:" />
                        <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                    </div>
                </Center>
                <br />
                <Center>
                    <textarea id="question" name="question" rows="8" cols="50" placeholder={defaultText} required></textarea>
                </Center>
                <br />
                <Center>
                    <Button variant="contained" color="default" onClick={submitFormValue}>Send</Button>
                    {/* <Button variant="contained" color="default" type="submit" onClick={submitFormValue}>Send</Button> */}
                    &nbsp;	&nbsp;
                    <Button variant="contained" color="default" onClick={clearFormValue}>Clear</Button>
                </Center>
            </form>
        </div>
    );
}