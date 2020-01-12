/* Credit: https://tobiasahlin.com/spinkit/ */
import React from "react";
import "./Spinner.scss";

const Spinner = () => (
  <div className="lds-ellipsis">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export default Spinner;
