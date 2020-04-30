import React, { Component } from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';

const app = new Clarifai.App({
 apiKey: '10365751e643431cb0cd6cdaf88a69d7'
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false
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
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  // "a403429f2ddf4b49b307e318f00e528b"
  // : 'eeed0b6733a644cea07cf4c60f87ebb7',

  onButonSubmit = () => {
    this.setState({imageURL: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
         this.state.input)
      .then( response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
        // there was an error
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState({isSignedIn: false})

    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
  render() {
    const { isSignedIn, imageURL, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles"/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ? <div> <Logo />
            <Rank />
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButonSubmit}
            />
            <FaceRecognition box={box} imageURL={imageURL} />
            </div>
          : (
            route == 'signin' 
            ? <SignIn onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange}/>
          ) 
      }
      </div>
    );
  }
}

export default App;
