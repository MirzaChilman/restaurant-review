import React, { Component } from "react";
import localRestaurant from "./localRestaurant";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import RestaurantCard from "./RestaurantCard";
import InfoWindow from "./InfoWindow";
import CreateModal from './CreateModal'
import "./App.css";
const apiKey = "AIzaSyDp4uinjRq9TTg4OmXPXwILUJGd1Piq2Wg";
// const apiKey = "AIzaSyAUS6L9Avy1Bvz8ERQokJn9Tm8lY_xhZ-0";

class App extends Component {
  state = {
    initialLocation: {
      lat: 0,
      lng: 0,
    },
    googleLocations: [],
    selectedPlace: {},
    activeMarker: {},
    showingInfoWindow: false,
    isCreateModalOpen: false
  };

  async componentDidMount() {
    await this.getInitialLocation();
  }

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

  fetchPlaceStreetView = (location, mapProps) => {
    const { google } = mapProps;
    const request = {
      location
    };
    const service = new google.maps.StreetViewService().getPanorama(request, (result, status) => {
      console.log(result)
      console.log(status)
    });
  };

  fetchPlaceDetails = (service, places, mapProps) => {
    places.map(datum => {
      const request = {
        placeId: datum.place_id,
      };
      service.getDetails(request, (result, status) => {
        console.log(result)
        console.log(status)
        if (status.toLowerCase() === "ok") {
          // console.log(result.geometry.location.lat())
          const location = result.geometry.location
          this.fetchPlaceStreetView(location,mapProps);
          this.setState(prevState => ({
            ...prevState,
            googleLocations: [...prevState.googleLocations, result],
          }));
        }
      });
    });
  };

  fetchPlaces = async (mapProps, map) => {
    const { google } = mapProps;
    const service = new google.maps.places.PlacesService(map);
    const mapLocation = map.center;
    const request = {
      location: mapLocation,
      radius: 50,
      types: ["restaurant"],
    };
    await service.nearbySearch(request, async (result, status) => {
      if (status.toLowerCase() === "ok") {
        console.log(result)
        this.fetchPlaceDetails(service, result, mapProps);
      }
    });
  };

  handleModalOpen = () => {
    this.setState({
      isCreateModal: true
    })
  }

  handleModalClose = () => {
    this.setState({
      isCreateModal: false
    })
  }

  mapClicked = (mapProps, map, clickEvent) => {
    // ...
    console.log(clickEvent);
    console.log(mapProps);
    console.log(map);
    this.handleModalOpen()
  }

  onMarkerClick = (mapProps, marker, e) => {
    console.log(mapProps);
    this.setState({
      selectedPlace: mapProps,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  };

  renderLoading = () => <h1>Loading</h1>;

  renderLocalRestaurant = () => {
    return localRestaurant.map(location => {
      return (
        <Marker
          title={location.restaurantName}
          name={location.restaurantName}
          position={{ lat: location.lat, lng: location.long }}
          onClick={this.onMarkerClick}
        />
      );
    });
  };

  renderGoogleRestaurant = () => {
    const { googleLocations } = this.state;
    return googleLocations.map(location => {
      const lat = location.geometry.location.lat();
      const lng = location.geometry.location.lng();
      return (
        <Marker
          title={location.name}
          name={location.name}
          position={{ lat, lng }}
          onClick={this.onMarkerClick}
        />
      );
    });
  };

  renderMap = () => {
    const { googleLocations } = this.state;
    console.log(this.state.initialLocation)
    return (
      <Map
        google={this.props.google}
        name={"Current Location"}
        initialCenter={{
          // lat: this.state.initialLocation.lat,
          lat: -7.7639612,
          // lng: this.state.initialLocation.lng,
          lng: 110.390341,
        }}
        zoom={15}
        style={{ height: "100vh", width: "100%" }}
        onReady={this.fetchPlaces}
        onClick={this.mapClicked}
      >
        {this.renderLocalRestaurant()}
        {googleLocations &&
          googleLocations.length > 0 &&
          this.renderGoogleRestaurant()}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
        >
          <div>
            <h5>{this.state.selectedPlace.name}</h5>
          </div>
        </InfoWindow>
      </Map>
    );
  };

  renderMenuRightBar = () => {
    const { googleLocations } = this.state;
    return (
      <div className={"right-bar"}>
        {localRestaurant.map(restaurant => {
          return <RestaurantCard {...restaurant} />;
        })}
        {googleLocations &&
          googleLocations.length > 0 &&
          googleLocations.map(location => {
            return <RestaurantCard {...location} />;
          })}
      </div>
    );
  };

  render() {
    const { lat, lng } = this.state.initialLocation;
    console.log(this.state.googleLocations)
    const initialLocationHasNotLoaded = lat === 0 && lng === 0;
    return (
      <div className={"mapContainer"}>
        {initialLocationHasNotLoaded ? this.renderLoading() : this.renderMap()}
        {this.renderMenuRightBar()}
        {this.state.isCreateModal && <CreateModal open={this.handleModalOpen} close={this.handleModalClose}/>}
      </div>
    );
  }
}

const LoadingKeren = () => {
  return (
      <h1>LOADING ANJING</h1>
  )
}

export default GoogleApiWrapper({
  apiKey: apiKey,
  LoadingContainer: LoadingKeren
})(App);
