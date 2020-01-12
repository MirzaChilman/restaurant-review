import React, { createRef, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import StarRatingComponent from "react-star-rating-component";
import Paper from "@material-ui/core/Paper";
import ReviewCard from "./components/ReviewCard/ReviewCard";
import Panorama from "./components/Panorama/Panorama";

const defaultImage = "https://static.thenounproject.com/png/340719-200.png";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: "100%",
    margin: "0 0 5px 0",
    background: "white",
  },
  media: {
    paddingTop: "56.25%", // 16:9
  },
  noMedia: {
    backgroundPosition: "center",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  paper: {
    padding: theme.spacing(3, 2),
    margin: theme.spacing(2, 2),
  },
  paperSecondary: {
    padding: theme.spacing(1),
    margin: theme.spacing(2, 2),
    boxShadow: "0px 3px 0px 5px rgba(0,0,0,0.75)",
  },
  typography: {
    color: "black",
  },
  input: {
    margin: theme.spacing(2.5, 0),
  },
  reviewCard: {
    padding: theme.spacing(2.5, 2.5),
    backgroundColor: "#98a7ff",
  },
  streetView: {
    width: "200px",
    height: "200px",
  },
  reviews: {
    color: "gray",
  },
}));

export default function RestaurantCard(props) {
  const classes = useStyles();

  const {
    name,
    formatted_address,
    reviews,
    googleServices,
    rating,
    user_ratings_total,
  } = props;
  console.log(props);
  const [addedReview, setAddedReview] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const restaurantImage =
    props.photos && props.photos.length > 0 && props.photos[0].getUrl();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onSubmitReview = data => {
    const { reviewer, description, rating } = data;
    setAddedReview([
      ...addedReview,
      {
        reviewer,
        description,
        rating,
      },
    ]);
  };
  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {name ? name.substring(0, 2) : "RT"}
            </Avatar>
          }
          title={name && name}
          subheader={
            formatted_address
              ? formatted_address
              : "This restaurant does not have exact address"
          }
        />
        {props.geometry && props.geometry.location && (
          <Panorama place={props.geometry.location} google={googleServices} />
        )}
        {!props.geometry && (
          <CardMedia
            className={restaurantImage ? classes.media : classes.noMedia}
            image={restaurantImage || defaultImage}
            title={name && name}
          />
        )}
        <Paper className={classes.paperSecondary}>
          {rating ? (
            <p>
              Average rating:&nbsp;{rating}{" "}
              <span className={classes.reviews}>
                ({`${user_ratings_total} reviews`})
              </span>{" "}
            </p>
          ) : (
            <p>No rating</p>
          )}
        </Paper>
        <CardActions>
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          <small>Read More</small>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <ReviewCard onSubmitReview={onSubmitReview} />
            {reviews &&
              reviews.map((rating, index) => {
                return (
                  <Paper
                    key={rating.author_name + index}
                    className={classes.paper}
                    elevation={5}
                  >
                    {rating.profile_photo_url && (
                      <Avatar
                        classes={classes.avatar}
                        alt={rating.author_name}
                        src={rating.profile_photo_url}
                      />
                    )}
                    <StarRatingComponent
                      starCount={5}
                      name={"rating"}
                      value={rating.stars || rating.rating}
                    />
                    <Typography className={classes.typography} paragraph>
                      {rating.comment || rating.text}
                    </Typography>
                    <Typography
                      className={classes.typography}
                      variant="subtitle2"
                    >
                      {rating.name || rating.author_name}
                    </Typography>
                  </Paper>
                );
              })}

            {addedReview.length > 0 &&
              addedReview.map(review => {
                return (
                  <Paper className={classes.paper} elevation={5}>
                    <StarRatingComponent
                      starCount={5}
                      name={"rating"}
                      value={review.rating}
                    />
                    <Typography className={classes.typography} paragraph>
                      {review.description}
                    </Typography>
                    <Typography
                      className={classes.typography}
                      variant="subtitle2"
                    >
                      {review.reviewer}
                    </Typography>
                  </Paper>
                );
              })}

            {!reviews && addedReview.length === 0 && <p>There is no review</p>}
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
}
