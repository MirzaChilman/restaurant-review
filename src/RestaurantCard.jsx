import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
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
import MoreVertIcon from "@material-ui/icons/MoreVert";
import StarRatingComponent from "react-star-rating-component";
import Paper from "@material-ui/core/Paper";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";

const defaultImage = "http://alcantarastone.com/media/img/no_image.png";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: "100%",
    margin: "0 0 5px 0",
    background: "white",
    // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  },
  media: {
    height: 0,
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
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
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
}));
export default function RecipeReviewCard(props) {
  const classes = useStyles();
  const { name, formatted_address, reviews } = props;
  const [reviewer, setReviewer] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [addedReview, setAddedReview] = useState([]);

  const restaurantImage =
    (props.image && props.image) ||
    (props.photos && props.photos.length > 0 && props.photos[0].getUrl());

  const [expanded, setExpanded] = useState(false);

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  const onSubmitReview = () => {
    setAddedReview(prevState => [
      ...prevState,
      { reviewer, description, rating },
    ]);
    setIsReviewOpen(false);
  };

  const renderReviewInput = () => {
    return (
      <Card className={classes.reviewCard}>
        <InputLabel htmlFor="reviewer">Name Reviewer</InputLabel>
        <Input
          value={reviewer}
          onChange={event => {
            const { value } = event.target;
            setReviewer(value);
          }}
          placeholder="Reviewer Name"
          id="reviewer"
          className={classes.input}
        />
        <InputLabel htmlFor="description">Description</InputLabel>
        <Input
          value={description}
          onChange={event => {
            const { value } = event.target;
            setDescription(value);
          }}
          placeholder="Description"
          id="description"
          className={classes.input}
        />
        <InputLabel htmlFor="rating">Rating</InputLabel>
        <Input
          type="number"
          inputProps={{ min: "0", max: "5", step: "1" }}
          value={rating}
          onChange={event => {
            const { value } = event.target;
            setRating(value);
          }}
          placeholder="Rating"
          id="rating"
          className={classes.input}
        />
        <div>
          <Button variant="contained" color="primary" onClick={onSubmitReview}>
            Submit Review
          </Button>
        </div>
      </Card>
    );
  };

  const renderReviewButton = () => {
    return !isReviewOpen ? (
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setIsReviewOpen(true);
        }}
      >
        Add Review
      </Button>
    ) : (
      ""
    );
  };
  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {name ? name.substring(0, 2) : "RT"}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={name && name}
        subheader={
          formatted_address
            ? formatted_address
            : "This restaurant does not have exact address"
        }
      />
      <CardMedia
        className={classes.media}
        image={restaurantImage || defaultImage}
        title={name && name}
      />
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
          {renderReviewButton()}
          {isReviewOpen && renderReviewInput()}
          {reviews &&
            reviews.map(rating => {
              return (
                <Paper className={classes.paper} elevation={5}>
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
  );
}
