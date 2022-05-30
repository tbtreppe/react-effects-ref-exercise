import React, { useState } from "react";

function Card({ name, image }) {
  const [draw, setDraw] = useState("");

  return <img className="Card" alt={name} src={image} />;
}

export default Card;
