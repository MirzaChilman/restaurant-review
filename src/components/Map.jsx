import React, { Component } from "react";

class Map extends Component {
  onScriptLoad = () => {
    const map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      this.props.options
    );
    this.props.onMapLoad(map);
  };

  componentDidMount() {
    if (!window.google) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://maps.google.com/maps/api/js?key=AIzaSyDnZHCNVuYH8lZSMZtuHzJ4677eUi6AE8w`;
      const mapDom = document.getElementsByTagName("script")[0];
      mapDom.parentNode.insertBefore(script, mapDom);
      // Below is important.
      //We cannot access google.maps until it's finished loading
      script.addEventListener("load", e => {
        this.onScriptLoad();
      });
    } else {
      this.onScriptLoad();
    }
  }

  render() {
    return (
      <div style={{ width: "70vw", height: "100vh" }} id={this.props.id} />
    );
  }
}

export default Map;
