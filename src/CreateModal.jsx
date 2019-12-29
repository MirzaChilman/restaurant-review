import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import localRestaurant from "./localRestaurant";

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
  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");

  const onRestaurantNameChange = event => {
    const { value } = event.target;
    setRestaurantName(value);
  };

  const onAddressChange = event => {
    const { value } = event.target;
    setAddress(value);
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
            <p>Add new Restaurants</p>
            <InputLabel htmlFor="restaurantName">Restaurant Name</InputLabel>
            <Input
              value={restaurantName}
              onChange={onRestaurantNameChange}
              placeholder="Restaurant Name"
              id="restaurantName"
              className={classes.input}
            />
            <InputLabel htmlFor="address">Address </InputLabel>
            <Input
              value={address}
              onChange={onAddressChange}
              placeholder="Address"
              id="address"
              className={classes.input}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => props.onButtonClick(restaurantName, address)}
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
