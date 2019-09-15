import React, { Component } from "react";
import { render } from "react-dom";
import Map from "./components/Map";
import InfoWindow from "./components/InfoWindow";

class App extends Component {
  state = {
    locations: [
      ["Bondi Beach", -33.890542, 151.274856, 4],
      ["Coogee Beach", -33.923036, 151.259052, 5],
      ["Cronulla Beach", -34.028249, 151.157507, 3],
      ["Manly Beach", -33.80010128657071, 151.28747820854187, 2],
      ["Maroubra Beach", -33.950198, 151.259302, 1],
    ],
  };
  createInfoWindow = (e, map) => {
    const infoWindow = new window.google.maps.InfoWindow({
      content: '<div id="infoWindow" />',
      position: { lat: e.latLng.lat(), lng: e.latLng.lng() },
    });
    infoWindow.addListener("domready", e => {
      render(<InfoWindow />, document.getElementById("infoWindow"));
    });
    infoWindow.open(map);
  };

  createMarkers = map => {
    const { locations } = this.state;
    locations.map((location, i) => {
      const marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          locations[i][1],
          locations[i][2]
        ),
        map: map,
      });

      marker.addListener("click", marker => {
        this.createInfoWindow(marker, map);
      });
    });
  };

  render() {
    return (
      <>
        <Map
          id="myMap"
          options={{
            center: { lat: -33.890542, lng: 151.274856 },
            zoom: 8,
          }}
          onMapLoad={map => this.createMarkers(map)}
        />
      </>
    );
  }
}

export default App;
