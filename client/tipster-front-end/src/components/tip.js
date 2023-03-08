import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { LoadingContext } from "../context/loading.context";
import axios from "axios";
import { baseUrl } from "../services/baseUrl";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const Tip = ({ tip, dimBackground, getTip}) => {
  const { comment, setComment, authUser, getTips } = useContext(LoadingContext);
  const [newLike, setNewLike] = useState({ userId: authUser?._id, tipId: tip._id });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_NEXT_GOOGLE_MAPS_KEY,
  });


  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [expand, setExpand] = useState(false);
  const mapClassName = expand ? "map-container" : "map-container-shrunk";
  
 const handleExpand = () => {
  setExpand(!expand)
 }

  function handleClick() {
    dimBackground(true);
    setComment(tip);
  }



  const createdAt = tip.createdAt;
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - createdDate.getTime();
  const hoursAgo = Math.round(timeDiff / 3600000);

  const addLike = () => {
    axios.post(`${baseUrl}/tips/add-like`, newLike).then((results) => {
      getTips()
      getTip()
    });
  };

  useEffect(() => {
    if (tip.location) {
      geocodeAddress(tip.location);
    }
  }, [tip]);

  async function geocodeAddress(address) {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: String(address),
          key: process.env.REACT_APP_NEXT_GOOGLE_MAPS_KEY,
        },
      }
    );
    setLat(response.data.results[0].geometry.location.lat);
    setLong(response.data.results[0].geometry.location.lng);
  }
   



    return (
      <div className="tipContainer">
        <div className="tipbox" key={tip._id}>
          <div className="tipImgName">
            <div className="tipImgBox">
              <img className="profilepic" src={tip.ownerpicture}></img>
            </div>
            <p className="tipOwner">{tip.owner}</p>
            <p className="timeDate">{hoursAgo}h</p>
          </div>
          <Link className="tipLink" to={`/tips/tip-detail/${tip._id}`}>
            {" "}
            <p className="tipText">{tip.text}</p>
            {tip.picture && (
              <div className="tipImgDiv">
                <img className="tipImgPosted" src={tip.picture}></img>
              </div>
            )}
          </Link>
          <div className="expand">
            <button className="handleExpand" onClick={handleExpand}>Expand Location</button>
          </div>

          <>
            {!isLoaded && <p>...Loading</p>}
            {tip.location !== "" && isLoaded && (
              <GoogleMap
                zoom={16}
                center={{ lat: lat, lng: long }}
                mapContainerClassName={mapClassName}
              >
                {isLoaded && lat && long && isLoaded && tip.location !== "" && (
                  <Marker position={{ lat: lat, lng: long }} />
                )}
              </GoogleMap>
            )}
          </>

          <div className="tipExtras">
            <p className="category">Category: {tip.category}</p>

            <div>
              <Link className="likes" onClick={addLike}>
                <p>
                  <img
                    class="heart"
                    src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
                  ></img>
                  <span>{tip.likes.length}</span>
                </p>
              </Link>
              {authUser ? (
                <Link className="link" onClick={handleClick}>
                  <p>
                    <img
                      class="heart"
                      src="https://cdn-icons-png.flaticon.com/512/3193/3193015.png"
                    ></img>
                    <span>{tip.comments.length}</span>
                  </p>
                </Link>
              ) : (
                <Link className="link" to={"/login"}>
                  <p>
                    <img
                      class="heart"
                      src="https://cdn-icons-png.flaticon.com/512/3193/3193015.png"
                    ></img>
                    <span>{tip.comments.length}</span>
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Tip;