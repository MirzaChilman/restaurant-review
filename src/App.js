import React, { Component } from "react";
import localRestaurantJson from "./localRestaurant";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import RestaurantCard from "./RestaurantCard";
import InfoWindow from "./InfoWindow";
import CreateModal from "./CreateModal";
import "./App.css";
// const apiKey = "AIzaSyDp4uinjRq9TTg4OmXPXwILUJGd1Piq2Wg";
const apiKey = "AIzaSyC4f9NH1rhp3dHrj86B1tK3V1TVqb20J68";

class App extends Component {
  state = {
    initialLocation: {
      lat: -7.7833529,
      lng: 110.4343039,
    },
    googleLocations: [],
    localRestaurant: localRestaurantJson,
    selectedPlace: {},
    activeMarker: {},
    showingInfoWindow: false,
    isCreateModalOpen: false,
    newRestaurant: {
      lat: 0,
      lng: 0,
      restaurantName: "",
      image: "",
      address: "",
    },
  };

  async componentDidMount() {
    await this.getInitialLocation();
  }

  getInitialLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          // this.setState({
          //   initialLocation: {
          //     // lat: position.coords.latitude,
          //     // lng: position.coords.longitude,
          //     lat: -7.7833529,
          //     lng: 110.4343039,
          //   },
          // });
          return {
            // lat: position.coords.latitude,
            // lng: position.coords.longitude,
            lat: -7.7833529,
            lng: 110.4343039,
          };
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
      location,
    };
    const service = new google.maps.StreetViewService().getPanorama(
      request,
      (result, status) => {
        // console.log(result)
        // console.log(status)
      }
    );
  };

  fetchPlaceDetails = (service, places, mapProps) => {
    places.map(datum => {
      const request = {
        placeId: datum.place_id,
      };
      service.getDetails(request, (result, status) => {
        if (status.toLowerCase() === "ok") {
          const location = result.geometry.location;
          this.fetchPlaceStreetView(location, mapProps);
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
      console.log(result);
      if (status.toLowerCase() === "ok") {
        this.fetchPlaceDetails(service, result, mapProps);
      }
    });
  };

  handleModalOpen = () => {
    this.setState({
      isCreateModal: true,
    });
  };

  handleModalClose = () => {
    this.setState({
      isCreateModal: false,
    });
  };

  mapClicked = (mapProps, map, clickEvent) => {
    this.setState({
      newRestaurant: {
        lat: mapProps.initialCenter.lat,
        lng: mapProps.initialCenter.lng,
      },
    });
    this.handleModalOpen();
  };

  onMarkerClick = (mapProps, marker, e) => {
    this.setState({
      selectedPlace: mapProps,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  };

  renderLocalRestaurant = () => {
    return this.state.localRestaurant.map(location => {
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

  // {
  //   lat: this.state.initialLocation.lat,
  //   // lat: -7.7639612,
  //   lng: this.state.initialLocation.lng,
  //   // lng: 110.390341,
  // }

  renderMap = () => {
    const { googleLocations, newRestaurant } = this.state;
    console.log(this.state.localRestaurant);

    return (
      <Map
        google={this.props.google}
        name={"Current Location"}
        initialCenter={{
          lat: -7.7833529,
          lng: 110.4343039,
        }}
        zoom={15}
        style={{ height: "100vh", width: "100%" }}
        onReady={this.fetchPlaces}
        onClick={this.mapClicked}
      >
        {/*-122.419416, lat: 37.774929*/}
        {this.renderLocalRestaurant()}
        {/*{googleLocations &&*/}
        {/*  googleLocations.length > 0 &&*/}
        {/*  this.renderGoogleRestaurant()}*/}
        {/*<InfoWindow*/}
        {/*  marker={this.state.activeMarker}*/}
        {/*  visible={this.state.showingInfoWindow}*/}
        {/*>*/}
        {/*  <div>*/}
        {/*    <h5>{this.state.selectedPlace.name}</h5>*/}
        {/*  </div>*/}
        {/*</InfoWindow>*/}
      </Map>
    );
  };

  renderMenuRightBar = () => {
    const { googleLocations, localRestaurant } = this.state;
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

  onAddNewRestaurant = (restaurantName, address) => {
    this.setState(prevState => ({
      ...prevState,
      isCreateModal: false,
      localRestaurant: [
        ...prevState.localRestaurant,
        {
          long: prevState.newRestaurant.lng,
          lat: prevState.newRestaurant.lat,
          name: restaurantName,
          formatted_address: address,
        },
      ],
    }));
  };

  render() {
    return (
      <div className={"mapContainer"}>
        {this.renderMap()}
        {this.renderMenuRightBar()}
        {this.state.isCreateModal && (
          <CreateModal
            open={this.handleModalOpen}
            close={this.handleModalClose}
            onButtonClick={this.onAddNewRestaurant}
          />
        )}
      </div>
    );
  }
}

const LoadingKeren = () => {
  return <h1>LOADING</h1>;
};

export default GoogleApiWrapper({
  apiKey: apiKey,
  LoadingContainer: LoadingKeren,
})(App);
