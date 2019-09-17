import React, { Component } from "react";
import localRestaurant from "./localRestaurant";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import RestaurantCard from "./RestaurantCard";
import Axios from "axios";
import "./App.css";

const apiKey = "AIzaSyDFjB3G4gf-SuD7ho1tYDj8nBwCzoDR22I";

class App extends Component {
  state = {
    initialLocation: {
      lat: 0,
      lng: 0,
    },
    locations: [
      { lat: -33.890542, long: 151.274856, zoom: 4, name: "Bondi" },
      { lat: -33.790542, long: 151.274856, zoom: 4, name: "Necha" },
    ],
    googleLocations: [],
  };
  static defaultProps = {
    center: {
      lat: -7.7833528,
      lng: 110.4343039,
    },
    zoom: 14,
  };

  myMapRef = React.createRef();

  getInitialLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            initialLocation: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        error => console.log(error)
      );
    } else {
      console.log("something wrong");
    }
  };

  async componentDidMount() {
    await this.getInitialLocation();
  }

  callback = (result, status) => {
    this.setState({
      googleLocations: result,
    });
    console.log(result);
    console.log(status);
  };

  fetchPlaces = async (mapProps, map) => {
    const { google } = mapProps;
    const service = new google.maps.places.PlacesService(map);
    this.setState({});
    const mapLocation = map.center;
    const request = {
      location: mapLocation,
      radius: 1000,
      types: ["restaurant"],
    };
    return await service.nearbySearch(request, this.callback);
  };

  mapClicked(mapProps, map, clickEvent) {
    // ...
    console.log(clickEvent);
    console.log(mapProps);
    console.log(map);
  }

  onMarkerClick(mapProps, marker, e) {
    // ..
    console.log(mapProps);
    console.log(marker);
    console.log(e);
  }

  onMouseoverMarker(mapProps, marker, e) {
    // ..
    console.log(mapProps);
    console.log(marker);
    console.log(e);
  }

  renderLoading = () => <h1>Loading</h1>;

  renderMap = () => {
    const { googleLocations } = this.state;
    return (
      <Map
        google={this.props.google}
        name={"Current Location"}
        initialCenter={{
          lat: this.state.initialLocation.lat,
          lng: this.state.initialLocation.lng,
        }}
        ref={this.myMapRef}
        style={{ height: "100vh", width: "100%" }}
        onReady={this.fetchPlaces}
        onClick={this.mapClicked}
      >
        {localRestaurant.map(location => {
          return (
            <Marker
              title={location.restaurantName}
              name={location.restaurantName}
              position={{ lat: location.lat, lng: location.long }}
              onClick={this.onMarkerClick}
              onMouseover={this.onMouseoverMarker}
            />
          );
        })}
        {googleLocations &&
          googleLocations.length > 0 &&
          googleLocations.map(location => {
            const lat = location.geometry.location.lat();
            const lng = location.geometry.location.lng();
            return (
              <Marker
                title={location.name}
                name={location.name}
                position={{ lat, lng }}
                onClick={this.onMarkerClick}
                onMouseover={this.onMouseoverMarker}
              />
            );
          })}
      </Map>
    );
  };

  renderMenuRightBar = () => {
    return (
      <div className={"something"}>
        {localRestaurant.map(restaurant => {
          return <RestaurantCard {...restaurant} />;
        })}
      </div>
    );
  };

  render() {
    console.log(this.myMapRef);
    const { lat, lng } = this.state.initialLocation;
    const initialLocationHasNotLoaded = lat === 0 && lng === 0;
    return (
      <div className={"mapContainer"}>
        {initialLocationHasNotLoaded ? this.renderLoading() : this.renderMap()}
        {this.renderMenuRightBar()}
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: apiKey,
})(App);
