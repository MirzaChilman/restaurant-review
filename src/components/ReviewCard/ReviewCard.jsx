import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  card: {
    padding: theme.spacing(2.5, 2.5),
    boxShadow: "0px 3px 0px 5px rgba(0,0,0,0.75)",
  },

  input: {
    margin: theme.spacing(2.5, 0),
  },
}));

const ReviewCard = props => {
  const [reviewer, setReviewer] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const classes = useStyles();

  const openReviewForm = () => {
    setIsReviewOpen(true);
  };

  const closeReviewForm = () => {
    setIsReviewOpen(false);
  };

  return isReviewOpen ? (
    <Card className={classes.card}>
      <div>
        <TextField
          required
          fullWidth
          label={"Reviewer Name"}
          value={reviewer}
          onChange={event => {
            const { value } = event.target;
            setReviewer(value);
          }}
          placeholder="Reviewer Name"
          id="reviewer"
          className={classes.input}
          variant="outlined"
        />
      </div>
      <div>
        <TextField
          required
          fullWidth
          label={"Description"}
          value={description}
          onChange={event => {
            const { value } = event.target;
            setDescription(value);
          }}
          placeholder="Description"
          id="description"
          className={classes.input}
          variant="outlined"
        />
      </div>
      <div>
        <TextField
          required
          fullWidth
          label={"Rating"}
          type="number"
          inputProps={{ min: "0", max: "5", step: "1" }}
          value={rating}
          onChange={event => {
            const { value } = event.target;
            if (value > 5) {
              return setRating(5);
            }
            return setRating(value);
          }}
          placeholder="Rating"
          id="rating"
          className={classes.input}
          variant="outlined"
        />
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            props.onSubmitReview({ reviewer, description, rating });
            setReviewer("");
            setDescription("");
            setRating(0);
            closeReviewForm();
          }}
          disabled={!reviewer || !description || !rating}
        >
          Submit Review
        </Button>
      </div>
    </Card>
  ) : (
    <Button variant="contained" color="primary" onClick={openReviewForm}>
      Add Review
    </Button>
  );
};

export default ReviewCard;
