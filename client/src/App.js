import React, { Component } from 'react';
import Footer from './Components/layout/Footer';
import Landing from './Components/layout/Landing';
import Navbar from './Components/layout/Navbar';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Register from './Components/auth/Register';
import Login from './Components/auth/Login';
import Profiles from './Components/auth/Profiles';

class App extends Component {
  
  render() {
    return (
      // <div>
      //   <Navbar />
      //   <Landing />
      //   <Footer />
      // </div>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path='/' component={Landing} />
          <div className="container">
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/profiles' component={Profiles} />
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
