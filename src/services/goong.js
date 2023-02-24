import { useEffect, useRef, useState } from "react";

import MapGL, { Marker, GoongMap } from "@goongmaps/goong-map-react";
import mark from "../assets/images/mark.png";
export function Map({ lat, long }) {
  const GOONG_MAPTILES_KEY = "4dAgWahZ3jW5LsZCiYikMTvVUOYpd2jcmxz3kyLA";
  const mapRef = useRef();

  const [viewport, setViewport] = useState({
    width: "50vw",
    height: "90vh",
    latitude: lat,
    longitude: long,
    zoom: 14,
  });

  useEffect(() => {
    setViewport({ ...viewport, latitude: lat, longitude: long });
  }, [lat, long]);

  const handleViewportChange = (viewport) => {
    setViewport(viewport);
  };

  return (
    <MapGL
      ref={mapRef}
      {...viewport}
      onViewportChange={handleViewportChange}
      goongApiAccessToken={GOONG_MAPTILES_KEY}
    >
      <Marker
        longitude={long}
        latitude={lat}
        offsetTop={-20}
        offsetLeft={-10}
        draggable={true}
        // onDragEnd={handleMarkerDrag}
      >
        <img src={mark} alt="" style={{ width: 20, height: 20 }} />
      </Marker>
    </MapGL>
  );
}
