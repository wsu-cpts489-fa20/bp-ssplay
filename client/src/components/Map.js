import React from 'react';
import ReactDOM from 'react-dom';

const mapStyles = {
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
};

let pos;
let map;
let bounds;
let infoWindow;
let currentInfoWindow;
let service;
let infoPane;

export class CurrentLocation extends React.Component {
    constructor(props) {
        super(props);
    
        const { lat, lng } = this.props.initialCenter;
    
        this.state = {
          currentLocation: {
            lat: lat,
            lng: lng
          }
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.google !== this.props.google) {
          this.loadMap();
        }
        if (prevState.currentLocation !== this.state.currentLocation) {
          this.recenterMap();
        }
    }

    recenterMap() {
        const map = this.map;
        const current = this.state.currentLocation;
        const google = this.props.google;
        const maps = google.maps;
    
        if (map) {
          let center = new maps.LatLng(current.lat, current.lng);
          map.panTo(center);
        }
    }

    componentDidMount() {
      const { google } = this.props;
      const maps = google.maps;
      bounds = new maps.LatLngBounds();
      infoWindow = new maps.InfoWindow;
      currentInfoWindow = infoWindow;
      infoPane = document.getElementById('panel');

        if (this.props.centerAroundCurrentLocation) {
          if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
              const coords = pos.coords;
              this.setState({
                currentLocation: {
                  lat: coords.latitude,
                  lng: coords.longitude
                }
              });
              bounds.extend(this.state.currentLocation);
              infoWindow.setPosition(this.state.currentLocation);
              infoWindow.setContent('Location found.');
              infoWindow.open(this.map);
              this.map.setCenter(this.state.currentLocation);
            });
          }
        }
        this.loadMap();
        this.getNearbyPlaces(this.state.currentLocation);
    }

    loadMap() {
        if (this.props && this.props.google) {
          // checks if google is available
          const { google } = this.props;
          const maps = google.maps;
    
          const mapRef = this.refs.map;
    
          // reference to the actual DOM element
          const node = ReactDOM.findDOMNode(mapRef);
    
          let { zoom } = this.props;
          const { lat, lng } = this.state.currentLocation;
          const center = new maps.LatLng(lat, lng);
    
          const mapConfig = Object.assign(
            {},
            {
              center: center,
              zoom: zoom
            }
          );
    
          // maps.Map() is constructor that instantiates the map
          this.map = new maps.Map(node, mapConfig);
        }
    }

  getNearbyPlaces = (position) => {
    const { google } = this.props;
    const maps = google.maps;
    let request = {
      location: position,
      rankBy: maps.places.RankBy.DISTANCE,
      keyword: 'golf'
    };

    service = new maps.places.PlacesService(this.map);
    service.nearbySearch(request, this.nearbyCallback);
  }

    // Handle the results (up to 20) of the Nearby Search
    nearbyCallback = (results, status) => {
      const { google } = this.props;
      const maps = google.maps;
      if (status == maps.places.PlacesServiceStatus.OK) {
        this.createMarkers(results);
      }
    }

    createMarkers = (places) => {
      const { google } = this.props;
      const maps = google.maps;
      places.forEach(place => {
        let marker = new maps.Marker({
          position: place.geometry.location,
          map: this.map,
          title: place.name
        });
  
        /* TODO: Step 4B: Add click listeners to the markers */
        // Add click listener to each marker
        maps.event.addListener(marker, 'click', () => {
          let request = {
            placeId: place.place_id,
            fields: ['name', 'formatted_address', 'geometry', 'rating',
              'website', 'photos']
          };
  
          /* Only fetch the details of a place when the user clicks on a marker.
           * If we fetch the details for all place results as soon as we get
           * the search response, we will hit API rate limits. */
          service.getDetails(request, (placeResult, status) => {
            this.showDetails(placeResult, marker, status)
          });
        });
  
        // Adjust the map bounds to include the location of this marker
        bounds.extend(place.geometry.location);
      });
      /* Once all the markers have been placed, adjust the bounds of the map to
       * show all the markers within the visible area. */
      this.map.fitBounds(bounds);
    }

    showDetails = (placeResult, marker, status) => {
      const { google } = this.props;
      const maps = google.maps;
      if (status == maps.places.PlacesServiceStatus.OK) {
        let placeInfowindow = new maps.InfoWindow();
        let rating = "None";
        if (placeResult.rating) rating = placeResult.rating;
        placeInfowindow.setContent('<div><strong>' + placeResult.name +
          '</strong><br>' + 'Rating: ' + rating + '</div>');
        placeInfowindow.open(marker.map, marker);
        currentInfoWindow.close();
        currentInfoWindow = placeInfowindow;
        this.showPanel(placeResult);
      } else {
        console.log('showDetails failed: ' + status);
      }
    }

    showPanel = (placeResult) => {
      // If infoPane is already open, close it
      if (infoPane.classList.contains("open")) {
        infoPane.classList.remove("open");
      }
  
      // Clear the previous details
      while (infoPane.lastChild) {
        infoPane.removeChild(infoPane.lastChild);
      }
  
      /* TODO: Step 4E: Display a Place Photo with the Place Details */
      // Add the primary photo, if there is one
      if (placeResult.photos) {
        let firstPhoto = placeResult.photos[0];
        let photo = document.createElement('img');
        photo.classList.add('hero');
        photo.src = firstPhoto.getUrl();
        infoPane.appendChild(photo);
      }
  
      // Add place details with text formatting
      let name = document.createElement('h1');
      name.classList.add('place');
      name.textContent = placeResult.name;
      infoPane.appendChild(name);
      if (placeResult.rating) {
        let rating = document.createElement('p');
        rating.classList.add('details');
        rating.textContent = `Rating: ${placeResult.rating} \u272e`;
        infoPane.appendChild(rating);
      }
      let address = document.createElement('p');
      address.classList.add('details');
      address.textContent = placeResult.formatted_address;
      infoPane.appendChild(address);
      if (placeResult.website) {
        let websitePara = document.createElement('p');
        let websiteLink = document.createElement('a');
        let websiteUrl = document.createTextNode(placeResult.website);
        websiteLink.appendChild(websiteUrl);
        websiteLink.title = placeResult.website;
        websiteLink.href = placeResult.website;
        websitePara.appendChild(websiteLink);
        infoPane.appendChild(websitePara);
      }
  
      // Open the infoPane
      infoPane.classList.add("open");
    }

    renderChildren() {
        const { children } = this.props;
    
        if (!children) return;
    
        return React.Children.map(children, c => {
          if (!c) return;
    
          return React.cloneElement(c, {
            map: this.map,
            google: this.props.google,
            mapCenter: this.state.currentLocation
          });
        });
    }

    render() {
        const style = Object.assign({}, mapStyles.map);
    
        return (
          <div id="Map">
            <div style={style} ref="map">
              Loading map...
            </div>
            {/* <!-- The slide-out panel for showing place details --> */}
            <div id="panel"></div>
            {/* <!-- Map appears here --> */}
            <div id="map"></div>

            {this.renderChildren()}
          </div>
        );
    }
}


CurrentLocation.defaultProps = {
    zoom: 14,
    initialCenter: {
      lat: 46.7482916,
      lng: -117.153158
    },
    centerAroundCurrentLocation: false,
    visible: true
  };

export default CurrentLocation;