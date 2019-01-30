import React, { Component } from 'react';

import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {
    state = {
        loginMode: true
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.nameElement = React.createRef();
        this.emailElement = React.createRef();
        this.passwordElement = React.createRef();
    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return {loginMode: !prevState.loginMode};
        })
    }

    submitHandler = (event) => {
        event.preventDefault();

        let requestBody

        if (!this.state.loginMode) {
            const name = this.nameElement.current.value;
            const email = this.emailElement.current.value;
            const password = this.passwordElement.current.value;
    
            if (name.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0 ) {
                console.log("Podaj wartości!");
                return;
            }

            requestBody = {
                query:`
                    mutation {
                        createUser(userInput: {name: "${name}", email: "${email}", password: "${password}"}) {
                            _id
                            email
                            signUpDate
                            role
                        }
                    }
                `
            };
        } else {
            const email = this.emailElement.current.value;
            const password = this.passwordElement.current.value;

            if (email.trim().length === 0 || password.trim().length === 0 ) {
                console.log("Podaj wartości!");
                return;
            }

            requestBody = {
                query:`
                    query {
                        login(email: "${email}", password: "${password}") {
                            userId
                            userToken
                            userTokenExp
                        }
                    }
                `
            };
        }

        fetch('http://localhost:8140/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            if (resData.data.login.userToken) {
                this.context.login(
                    resData.data.login.userToken, 
                    resData.data.login.userId, 
                    resData.data.login.userTokenExp
                );
            }
        })
        .catch(err => {
            console.log(err);
        });
    };

    render() {
        if (this.state.loginMode) {
            return <form className="auth-form" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" ref={this.emailElement}></input>
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordElement}></input>
                </div>
                <div className="form-action">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.switchModeHandler}>
                        {this.state.loginMode ? 'SignUp' : 'Login'}
                    </button>
                </div>
        </form>
        }
        return <form className="auth-form" onSubmit={this.submitHandler}>
            <div className="form-control">
                <label htmlFor="name">Name</label>
                <input type="name" id="name" ref={this.nameElement}></input>
            </div>
            <div className="form-control">
                <label htmlFor="email">E-mail</label>
                <input type="email" id="email" ref={this.emailElement}></input>
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={this.passwordElement}></input>
            </div>
            <div className="form-action">
                <button type="submit">Submit</button>
                <button type="button" onClick={this.switchModeHandler}>
                    {this.state.loginMode ? 'SignUp' : 'Login'}
                </button>
            </div>
        </form>
    }
}

export default AuthPage;