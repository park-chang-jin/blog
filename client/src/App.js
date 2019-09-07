import React, { Component } from 'react';
import Footer from './Components/layout/Footer';
import Landing from './Components/layout/Landing';
import Navbar from './Components/layout/Navbar';

class App extends Component {
  
  render() {
    return (
      <div>
        <Navbar />
        <Landing />
        <Footer />
      </div>
    );
  }
}

export default App;
