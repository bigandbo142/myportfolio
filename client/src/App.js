import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import setAuthToken from './utils/setAuthToken'
import jwt_decode from 'jwt-decode'
import { LOGIN_SUCCESS } from './actions/types'

import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Dashboard from './components/dashboard/Dashboard';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { logoutUser } from './actions/authAction';

// check if token is available
if(localStorage.jwt_token){ 
  // set token to axios request
  setAuthToken(localStorage.jwt_token)

  // decode user's data from token
  const userData = jwt_decode(localStorage.jwt_token)

  // check if token is expired ?

  let currentTime = Date.now() / 1000
  if(currentTime >= userData.exp){

    // do logout user
    store.dispatch(logoutUser())

    // redirect to login screen
    window.location.href = '/login'
  }else{
    // set user data to state
    store.dispatch({
      type: LOGIN_SUCCESS,
      payload: userData
    })
  }

  
}

class App extends Component {
  render() {
    return (
      <Provider store={store} >
        <Router>
          <div className="App">
            <NavBar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Footer />
        </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
