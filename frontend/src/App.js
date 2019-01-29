import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import PostsPage from './pages/Posts';
import UserPage from './pages/User';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Redirect from="/" to="/auth" exact />
          <Route path="/auth" component={AuthPage} />
          <Route path="/posts" component={PostsPage} />
          <Route path="/user" component={UserPage} />
        </Switch>
      </BrowserRouter>
    ); 
  }
}

export default App;
