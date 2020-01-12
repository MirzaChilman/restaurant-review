import React, { Component } from "react";
import localRestaurantJson from "./localRestaurant";
import { Map, Marker, GoogleApiWrapper, InfoWindow } from "google-maps-react";
import CreateModal from "./components/Modal/CreateModal";
import Sidebar from "./components/Sidebar/Sidebar";
import "./App.scss";
import Spinner from "./components/Spinner/Spinner";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialLocation: {
        lat: -7.7833529,
        lng: 110.4343039,
      },
      googlePlaces: [],
      localRestaurant: localRestaurantJson,
      isCreateModalOpen: false,
      newRestaurant: [],
      newRestaurantDetail: {},
      fetchingGooglePlaces: false,
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
    };
  }

  mapRef = React.createRef();

  componentDidMount() {
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
        function() {
          throw Error("You need to allow position");
        }
      );
    } else {
      // Browser doesn't support Geolocation
      throw Error(
        "Your browser does not support geolocation, we recommend to switch to chrome "
      );
    }
  }

  handleModalOpen = () => {
    this.setState({
      isCreateModal: true,
    });
  };

  handleModalClose = () => {
    this.setState({
      isCreateModalOpen: false,
    });
  };

  fetchGoogleAddress = async (geocoderService, position) => {
    return await geocoderService.geocode(
      {
        latLng: position,
      },
      (result, status) => {
        if (status.toLowerCase() === "ok") {
          this.setState({
            isCreateModalOpen: true,
            newRestaurantDetail: {
              lat: position.lat(),
              lng: position.lng(),
              formatted_address: result[0].formatted_address,
            },
          });
        }
      }
    );
  };

  mapClicked = async (map, maps, event) => {
    const { google } = map;
    const geocoderService = new google.maps.Geocoder();
    await this.fetchGoogleAddress(geocoderService, event.latLng);
  };

  onAddRestaurant = ({ restaurantName }) => {
    const { lat, lng, formatted_address } = this.state.newRestaurantDetail;
    this.setState(prevState => ({
      newRestaurant: [
        ...prevState.newRestaurant,
        { name: restaurantName, lat, lng, formatted_address },
      ],
      isCreateModalOpen: false,
      newRestaurantDetail: {},
    }));
  };

  fetchGooglePlaces = async (map, maps, event) => {
    const { google } = map;
    const request = {
      location: maps.center,
      radius: 500,
      types: ["restaurant"],
    };
    const placesService = new google.maps.places.PlacesService(maps);
    await placesService.nearbySearch(
      request,
      async (nearbySearchResult, status) => {
        if (status.toLowerCase() === "ok") {
          nearbySearchResult.map(async result => {
            await placesService.getDetails(
              {
                placeId: result.place_id,
              },
              (result, status) => {
                if (status.toLowerCase() === "ok") {
                  this.setState(prevState => ({
                    ...prevState,
                    googlePlaces: [...prevState.googlePlaces, result],
                  }));
                }
              }
            );
          });
        }
      }
    );
  };

  fetchNewPlaces = async (map, maps) => {
    try {
      await this.fetchGooglePlaces(map, maps);
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({
        fetchingGooglePlaces: false,
      });
    }
  };

  clearData = () => {
    this.setState({
      googlePlaces: [],
      fetchingGooglePlaces: true,
    });
  };

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  };

  render() {
    const {
      initialLocation,
      isCreateModalOpen,
      newRestaurant,
      googlePlaces,
      fetchingGooglePlaces,
      localRestaurant,
    } = this.state;
    return (
      <div className="mapContainer">
        <Map
          streetViewControl
          google={this.props.google}
          name={"Current Location"}
          initialCenter={{
            lat: initialLocation.lat,
            lng: initialLocation.lng,
          }}
          ref={this.mapRef}
          id={"myMap"}
          zoom={15}
          style={{ height: "100vh", width: "100%" }}
          onReady={this.fetchGooglePlaces}
          onClick={this.mapClicked}
          onDragend={this.fetchNewPlaces}
          onDragstart={this.clearData}
        >
          {newRestaurant.length > 0 &&
            newRestaurant.map(({ name, formatted_address, lat, lng }) => {
              return (
                <Marker
                  title={`${name}\n${formatted_address}`}
                  name={name}
                  position={{ lat: lat, lng: lng }}
                />
              );
            })}
          {googlePlaces.length > 0 &&
            googlePlaces.map(place => {
              return (
                <Marker
                  title={`${place.name}\n${place.formatted_address}`}
                  name={place.name}
                  position={{
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  }}
                  onClick={this.onMarkerClick}
                />
              );
            })}
          {localRestaurant.length > 0 &&
            localRestaurant.map(restaurant => {
              return (
                <Marker
                  title={`${restaurant.name}\n${restaurant.formatted_address}`}
                  name={restaurant.name}
                  position={{
                    lat: restaurant.lat,
                    lng: restaurant.long,
                  }}
                  onClick={this.onMarkerClick}
                />
              );
            })}
          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
            <div>
              <p>{this.state.selectedPlace.name}</p>
            </div>
          </InfoWindow>
        </Map>
        <Sidebar
          googlePlaces={googlePlaces}
          newRestaurant={newRestaurant}
          fetching={fetchingGooglePlaces}
          googleServices={this.props.google}
        />
        {isCreateModalOpen && (
          <CreateModal
            open={this.handleModalOpen}
            close={this.handleModalClose}
            onAddRestaurant={this.onAddRestaurant}
          />
        )}
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_KEY,
  LoadingContainer: Spinner,
})(App);
