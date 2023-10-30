import React, { useEffect, useState } from "react";
// import { useValue } from "../../context/ContextProvider";
// import { getRooms } from "../../actions/room";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import Supercluster from "supercluster";

import { Avatar, Paper, Tooltip } from "@mui/material";
import GeocoderInput from "../sidebar/GeoCoderInput";
import PopupHome from "./PopupHome";

import { getProjects } from "@/redux/actions/projectsActions";
import { useValue } from "@/context/ContextProvider";
import { useDispatch, useSelector } from "react-redux";
import "mapbox-gl/dist/mapbox-gl.css";
import PlaceCard from "@/components/mapbox/PlaceCard";
import { getAllProjects } from "@/context/function";
import Geocoder from "../add/addLocation/GeoCoder";
import { useRouter } from "next/router";
import { LocationCity } from "@mui/icons-material";
import { MdLocationPin } from "react-icons/md";
const supercluster = new Supercluster({
  radius: 75,
  maxZoom: 20,
});

const ClusterMap = () => {
  const router = useRouter();
  const [isCardModalVisible, setCardIsModalVisible] = useState(false);
  const {
    state: { filteredRooms,location },
    dispatch,
    mapRef,
  } = useValue();
  const [points, setPoints] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [bounds, setBounds] = useState([-180, -85, 180, 85]);
  const [zoom, setZoom] = useState(12);
  const [popupInfo, setPopupInfo] = useState(null);
  useEffect(() => {
    // dispatchRedux(getProjects(dispatch))
    getAllProjects(dispatch);
  }, []);

  useEffect(() => {
    const points = filteredRooms?.map((project) => ({
      type: "Feature",
      properties: {
        cluster: false,
        projectId: project._id,
        price: project.price,
        title: project.title,
        description: project.description,
        lng: project.lng,
        lat: project.lat,
        images: project.images,
        uPhoto: project.uPhoto,
        uName: project.uName,
        address: project.address,
        acress: project.acress,
      },
      geometry: {
        type: "Point",
        coordinates: [parseFloat(project.lng), parseFloat(project.lat)],
      },
    }));
    setPoints(points);
  }, [filteredRooms]);

  useEffect(() => {
    supercluster.load(points);
    setClusters(supercluster.getClusters(bounds, zoom));
  }, [points, zoom, bounds]);

  useEffect(() => {
    if (mapRef.current) {
      setBounds(mapRef.current.getMap().getBounds().toArray().flat());
    }
  }, [mapRef?.current]);

  //converted price
  function formatPrice(price) {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(1)} K`;
    } else {
      return `${price}`;
    }
  }
  //  isMobile
  

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the width as per your mobile threshold
    };

    // Initial call to set isMobile based on window width
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ReactMapGL
      initialViewState={{ latitude: 40.7128, longitude: -74.006, zoom: 6 }}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      //mapbox://styles/mapbox/streets-v11
      ref={mapRef}
      onZoomEnd={(e) => setZoom(Math.round(e.viewState.zoom))}
      style={{
        minHeight: "100vh",
        width: isMobile ? "100vw" : "93vw",
      }}
      containerStyle={{
        minHeight: "100vh",
        width: isMobile ? "100vw" : "93vw",
      }}
    >
      {clusters.map((cluster) => {
        const { cluster: isCluster, point_count } = cluster.properties;
        const [longitude, latitude] = cluster.geometry.coordinates;
        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              longitude={longitude}
              latitude={latitude}
            >
              <div
                className="cluster-marker"
                style={{
                  width: `${10 + (point_count / points.length) * 20}px`,
                  height: `${10 + (point_count / points.length) * 20}px`,
                }}
                onClick={() => {
                  const zoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  );
                  mapRef.current.flyTo({
                    center: [longitude, latitude],
                    zoom,
                    speed: 1,
                  });
                }}
              >
                {point_count}
              </div>
            </Marker>
          );
        }

        return (
          <Marker
            key={`room-${cluster.properties?.projectId}`}
            longitude={longitude}
            latitude={latitude}
          >
            <Tooltip
              title={cluster.properties?.address}
              placement="top"
              classes={{ tooltip: "custom-tooltip" }}
            >
              {/* <Avatar
                src={formatPrice(cluster.properties?.price)}
                component={Paper}
                elevation={2}
                onClick={() => setPopupInfo(cluster.properties)}
                onMouseOver={() => {
                  setCardIsModalVisible(true);
                  setPopupInfo(cluster.properties);
                }}
                // onMouseDown={() => {
                //   setCardIsModalVisible(false);
                //   setPopupInfo({});
                // }}
                style={{
                  backgroundColor: "black",
                  color:"white",
                  fontSize: "8px",
                  
                  marginTop: zoom === 12 || zoom > 12 ? "-50px" : "0px",
                  position: "relative",
                  
                }}
              >
                {formatPrice(cluster.properties?.price)}
              </Avatar> */}
              <MdLocationPin
                style={{ marginTop: zoom === 12 || zoom > 12 ? "-50px" : "0px" }}
                className="text-slate-900 text-xl updown-anim"
                onClick={() => setPopupInfo(cluster.properties)}
                onMouseOver={() => {
                  setCardIsModalVisible(true);
                  setPopupInfo(cluster.properties);
                }}
              />
            </Tooltip>
          </Marker>
        );
      })}
      <GeocoderInput />
      <Geocoder />
      {popupInfo && (
        // <PopupHome
        //   longitude={popupInfo.lng}
        //   latitude={popupInfo.lat}
        //   maxWidth="auto"
        //   closeOnClick={false}
        //   focusAfterOpen={false}
        //   onClose={() => setPopupInfo(null)}
        //   popupInfo={popupInfo}
        // />
        <PlaceCard
          id={popupInfo.projectId}
          placeName={popupInfo.title}
          price={popupInfo.price}
          location={popupInfo.address}
          isVisible={isCardModalVisible}
          onClose={() => setCardIsModalVisible(false)}
          coordinates={popupInfo?.coordinates}
          images={popupInfo.images}
          desc={popupInfo.description}
          acress={popupInfo.acress}
        />
      )}
    </ReactMapGL>
  );
};

export default ClusterMap;
