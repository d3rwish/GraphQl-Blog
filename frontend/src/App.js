import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import PostsPage from './pages/Posts';
import UserPage from './pages/User';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';

class App extends Component {
  state ={
    userToken: null,
    userId: null
  };

  login = (userToken, userId, userTokenExp) => {
    this.setState({ userToken: userToken, userId: userId });
  };

  logout = () => {
    this.setState({ userToken: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{ 
              userToken: this.state.userToken,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {!this.state.userToken && <Redirect from="/" to="/auth" exact />}
                {this.state.userToken && <Redirect from="/" to="/posts" exact />}
                {this.state.userToken && <Redirect from="/auth" to="/posts" exact />}
                {!this.state.userToken && <Redirect from="/posts" to="/" exact />}
                {!this.state.userToken && <Redirect from="/user" to="/" exact />}
                {!this.state.userToken && <Route path="/auth" component={AuthPage} />}
                {this.state.userToken && <Route path="/posts" component={PostsPage} />}
                {this.state.userToken && <Route path="/user" component={UserPage} />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    ); 
  }
}

export default App;
