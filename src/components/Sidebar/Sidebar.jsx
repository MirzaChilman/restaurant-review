import React from "react";
import "./Sidebar.scss";
import LocalData from "../../localRestaurant";
import RestaurantCard from "../../RestaurantCard";
import StarRatingComponent from "react-star-rating-component";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core";
import Spinner from "../Spinner/Spinner";

const styles = theme => ({
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(2, 2),
    boxShadow: "0px 3px 0px 5px rgba(0,0,0,0.75)",
  },
});

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localRestaurant: LocalData,
      rating: 0,
    };
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }

  renderStarRatingComponent = () => {
    const { classes } = this.props;
    const { rating } = this.state;
    return (
      <Paper className={classes.paper}>
        <p>Filter Restaurant Based on Average Rating: </p>
        <StarRatingComponent
          name="rate1"
          starCount={5}
          value={rating}
          onStarClick={value => this.onStarClick(value)}
        />
      </Paper>
    );
  };

  renderNoData = () => {
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
        <h2>There is no data</h2>
      </Paper>
    );
  };

  render() {
    const { localRestaurant, rating } = this.state;
    const {
      googlePlaces,
      newRestaurant,
      fetching,
      googleServices,
    } = this.props;
    const filteredLocalRestaurant = localRestaurant
      .filter(restaurant => {
        return restaurant.rating >= rating;
      })
      .map((restaurant, index) => {
        return restaurant;
      });
    const filteredGoogleRestaurant =
      googlePlaces &&
      googlePlaces.length > 0 &&
      googlePlaces
        .filter(place => {
          return place.rating >= rating;
        })
        .map((place, index) => {
          return place;
        });
    if (fetching) {
      return <Spinner />;
    }
    return (
      <div className={"right-bar"}>
        {this.renderStarRatingComponent()}
        {filteredLocalRestaurant.length > 0 &&
          filteredLocalRestaurant.map((restaurant, index) => {
            return (
              <RestaurantCard
                key={index + restaurant.id}
                {...restaurant}
                googleServices={googleServices}
              />
            );
          })}
        {filteredGoogleRestaurant.length > 0 &&
          filteredGoogleRestaurant.map((restaurant, index) => {
            return (
              <RestaurantCard
                key={index + restaurant.id}
                {...restaurant}
                googleServices={googleServices}
              />
            );
          })}
        {filteredLocalRestaurant.length < 1 &&
          (filteredGoogleRestaurant.length < 1 || !filteredGoogleRestaurant) &&
          this.renderNoData()}
        {newRestaurant.length > 0 &&
          newRestaurant.map((restaurant, index) => {
            return (
              <RestaurantCard key={index + restaurant.id} {...restaurant} />
            );
          })}
      </div>
    );
  }
}

export default withStyles(styles)(Sidebar);
