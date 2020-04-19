import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition.js';
import Navigation from './components/Navigation.js';
import SignIn from './components/SignIn.js';
import Register from './components/Register.js';
import Logo from './components/Logo.js';
import ImageLink from './components/ImageLink.js';
import Rank from './components/Rank.js';
import './App.css';


const app = new Clarifai.App({
  //This is the key value that associate with the account
  apiKey: '8f708c4de98c42a5a2033e703e593509'
});

const parameters = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 200
      }
    },
    size: {
      value: 7,
      random: true
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: true,
        mode: 'repulse'
      },
      onclick: {
        enable: true,
        mode: 'push'
      },
      resize: true
    },
    modes: {
      repulse: {
        distance: 200,
        duration: 0.5
      },
    }
  },
  retina_detect: true
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  diplayFaceBox = (box) => {
    this.setState({ box: box })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.diplayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({route: 'route'});
    console.log(route);
    console.log(this.state.route);
    console.log(this.state.isSignedIn);
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={parameters} />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        <Logo />

        {
          this.state.route === 'signin' ?
            <SignIn onRouteChange={this.onRouteChange}/> :
            this.state.route === 'register' ?
            <Register onRouteChange={this.onRouteChange}/> :
            <div>
              <Rank />
              <ImageLink className='imagelink' onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
            </div>
        }
      </div>
    );
  }
}

export default App;


