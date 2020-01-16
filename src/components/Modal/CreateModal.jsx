import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    width: "500px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  input: {
    margin: theme.spacing(2.5, 0),
  },
}));

export default function CreateModal(props) {
  const classes = useStyles();
  const { onAddRestaurant } = props;
  const [restaurantName, setRestaurantName] = useState("");
  // const [address, setAddress] = useState("");

  const onRestaurantNameChange = event => {
    const { value } = event.target;
    setRestaurantName(value);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={props.close}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <div className={classes.paper}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p>Add new Restaurants</p>
              <CancelRoundedIcon
                onClick={props.close}
                style={{ marginTop: "5px" }}
              />
            </div>
            <div>
              <TextField
                label="Restaurant Name"
                value={restaurantName}
                onChange={onRestaurantNameChange}
                placeholder="Restaurant Name"
                id="restaurantName"
                className={classes.input}
                fullWidth
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onAddRestaurant({ restaurantName })}
              disabled={!restaurantName}
            >
              Add Restaurant
            </Button>
            {/*<Input className={classes.input} />*/}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
