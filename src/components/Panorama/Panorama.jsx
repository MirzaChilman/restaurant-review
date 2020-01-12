import React from "react";
import { withStyles } from "@material-ui/core";

const styles = {
  panorama: {
    height: "200px",
    width: "100%",
  },
};

class Panorama extends React.Component {
  constructor(props) {
    super(props);
    this.panorama = null;
  }

  componentDidMount() {
    this.renderPanorama();
  }
  componentDidUpdate(prevProps) {
    if (this.props.place.place_id !== prevProps.place.place_id) {
      this.renderPanorama();
    }
  }
  render() {
    const classes = this.props.classes;
    return <div ref="panorama" className={classes.panorama} />;
  }
  renderPanorama() {
    this.panorama = new this.props.google.maps.StreetViewPanorama(
      this.refs.panorama,
      {
        position: this.props.place,
        disableDefaultUI: true,
        showRoadLabels: false,
        pov: {
          heading: 160,
          pitch: 0,
        },
        zoom: 1,
      }
    );
  }
}

export default withStyles(styles)(Panorama);
