import Image from "react-image-enlarger";
import React from "react";


export function SingleSource(props) {
  const [zoomed, setZoomed] = React.useState(false);

  return (
    <Image
      style={{ width: "auto", height: "auto" }}
      zoomed={zoomed}
      src={props.src}
      alt="doc image"
      onClick={() => setZoomed(true)}
      onRequestClose={() => setZoomed(false)}
    />
  );
}