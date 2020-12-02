import React from 'react';
import { GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import CurrentLocation from './Map';

class NearbyCourses extends React.Component {
    
    state = {
        showingInfoWindow: false,  // Hides or shows the InfoWindow
        activeMarker: {},          // Shows the active marker upon click
        selectedPlace: {}          // Shows the InfoWindow to the selected place upon a marker
      };

    onMarkerClick = (props, marker, e) =>
    this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
    });

    onClose = (props) => {
    if (this.state.showingInfoWindow) {
        this.setState({
        showingInfoWindow: false,
        activeMarker: null
        });
    }
    };

    render () {
        return (
            <CurrentLocation
              centerAroundCurrentLocation
              google={this.props.google}
            >
              <Marker onClick={this.onMarkerClick} name={'Current Location'} />
              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onClose={this.onClose}
              >
                <div>
                  <h4>{this.state.selectedPlace.name}</h4>
                </div>
              </InfoWindow>
            </CurrentLocation>
          );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAb8KZudhikDhC08rfJ_BgBvM0Fxfpvog8'
  })(NearbyCourses);