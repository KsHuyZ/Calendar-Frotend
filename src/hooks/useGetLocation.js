import axios from "axios";
import { useState } from "react";
import MapGL from "@goongmaps/goong-map-react";

const API_KEY = "8qzxZAuxcsctSlmOszInchP1A5GrmRBHJwCBCjO6";
const API_ENDPOINT = `https://api.goong.io/location/v1/cities?limit=10&api_key=${API_KEY}`;

async function useGetLocations() {
  const [viewport, setViewport] = useState({
    latitude: 37.8,
    longitude: -122.4,
    zoom: 14,
    bearing: 0,
    pitch: 0,
  });
  const GOONG_MAPTILES_KEY = "8qzxZAuxcsctSlmOszInchP1A5GrmRBHJwCBCjO6";
  try {
    const response = await axios.get(API_ENDPOINT);
    const locations = response.data;
    console.log(locations);
  } catch (error) {
    console.error(error);
  }
  return (
    <MapGL
      {...viewport}
      width="100vw"
      height="100vh"
      mapStyle="https://tiles.goong.io/assets/goong_map_dark.json"
      onViewportChange={setViewport}
      goongApiAccessToken={GOONG_MAPTILES_KEY}
    />
  );
}
export default useGetLocations;
