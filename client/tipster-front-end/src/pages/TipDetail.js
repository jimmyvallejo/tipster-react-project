import { baseUrl } from "../services/baseUrl";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { get } from "../services/authService";
import Comment from "../components/Comments";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoadingContext } from "../context/loading.context";
import { Link } from "react-router-dom";
import { post } from "../services/authService";
import { GoogleMap, useLoadScript, } from "@react-google-maps/api";
import { Marker } from "@react-google-maps/api";


const TipDetail = () => {
  

   const navigate = useNavigate();

   const { id } = useParams();

  const { authUser, setTips, getTips } = useContext(LoadingContext);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_NEXT_GOOGLE_MAPS_KEY,
  });

  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [tip, setTip] = useState({});
  const [comments, setComments] = useState([]);

      const createdAt = tip.createdAt;
      const createdDate = new Date(createdAt);
      const currentDate = new Date();
      const timeDiff = currentDate.getTime() - createdDate.getTime();
      const hoursAgo = Math.round(timeDiff / 3600000);

  
const [newLike, setNewLike] = useState({
  userId: authUser?._id,
  tipId: id
});
  const [edit, setEdit] = useState(null);



  useEffect(() => {
    getTip(id);
  }, []);

  



  

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
      
      setLat(response.data.results[0].geometry.location.lat)
      setLong(response.data.results[0].geometry.location.lng);
      
    }

      const getTip = () => {
        axios
          .get(`${baseUrl}/tips/tip-detail/${id}`)
          .then((response) => {
            setTip(response.data);
            setComments(response.data.comments);
            console.log("Tip:", response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      };

  const handleDelete = () => {
    get(`/tips/tip/delete/${id}`)
      .then(() => {
        console.log("Tip deleted");
        setTips((prevTip) => prevTip.filter((t) => t._id !== id));
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [editTip, setEditTip] = useState({
    text: "",
    category: "",
    picture: "",
    location: ""
  });

  const handleChange = (e) => {
    setEditTip((recent) => ({ ...recent, [e.target.name]: e.target.value }));
    console.log("Editing Tip", editTip);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    post(`/tips/tip-detail/${id}`, editTip)
      .then((results) => {
        console.log("Tip", results.data);
        setTip(results.data);
        getTips();
        handleEditButton();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFileSubmit = (e) => {
    let fileUpload = new FormData();
    fileUpload.append("picture", e.target.files[0]);
    post("/tips/add-picture", fileUpload)
      .then((result) => {
        setEditTip((recent) => ({ ...recent, picture: result.data }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditButton = () => {
    setEdit((edit) => !edit);
  };

  const handleLocationBlur = (e) => {
    const { name, value } = e.target;
    const formattedValue = `${value} USA`;
    setEditTip((prev) => ({ ...prev, [name]: formattedValue }));
    console.log(setTip);
  };

  const addLike = () => {
    axios.post(`${baseUrl}/tips/add-like`, newLike).then((results) => {
      console.log("like++", results.data);
      getTip();
    });
  };

  return (
    <div>
      {!edit && (
        <div className="tipContainer">
          <div className="tipbox tipDetail" key={tip._id}>
            <div className="tipImgName">
              <div className="tipImgBox">
                <img className="profilepic" src={tip.ownerpicture}></img>
              </div>
              <p className="tipOwner">{tip.owner}</p>
              <p className="timeDate">{hoursAgo}h</p>
            </div>

            <p className="tipText" id="tipDetailText">
              {tip.text}
            </p>
            {tip.picture && (
              <div className="tipImgDiv">
                <img className="tipImgPosted" src={tip.picture}></img>
              </div>
            )}

            {!isLoaded && <p>...Loading</p>}
            {tip.location !== "" && isLoaded && (
              <GoogleMap
                zoom={16}
                center={{ lat: lat, lng: long }}
                mapContainerClassName="map-container"
              >
                {lat && long && <Marker position={{ lat: lat, lng: long }} />}
              </GoogleMap>
            )}

            <div className="tipExtras">
              <p className="category">Category: {tip.category}</p>
              {tip.likes && (
                <Link className="likes" onClick={addLike}>
                  <p>
                    <img
                      class="heart"
                      src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
                    ></img>
                    <span>{tip.likes.length}</span>
                  </p>
                </Link>
              )}
              {tip.comments && (
                <Link id="commentLink" to={"/"}>
                  <p>
                    <img
                      class="heart"
                      src="https://cdn-icons-png.flaticon.com/512/3193/3193015.png"
                    ></img>
                    <span>{tip.comments.length}</span>
                  </p>
                </Link>
              )}

              <div>
                {authUser?.username === tip.owner && (
                  <div className="editDelete">
                    <Link className="edit" onClick={handleEditButton}>
                      Edit
                    </Link>
                    <Link className="edit" onClick={handleDelete}>
                      Delete
                    </Link>{" "}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {edit && (
        <div className="tipContainer">
          <div className="tipbox tipDetail tipEdit" key={tip._id}>
            <div className="tipImgName">
              <div className="tipImgBox">
                <img className="profilepic" src={tip.ownerpicture}></img>
              </div>
              <p className="tipOwner">{tip.owner}</p>
              <p className="timeDate">{hoursAgo}h</p>
            </div>
            <div className="editBox">
              <form
                id="profileForm"
                encType="multipart/form-data"
                onSubmit={handleSubmit}
              >
                <div>
                  <label id="locationLabel" for="category">
                    Location:{" "}
                  </label>
                  <input
                    className="locationInput"
                    type="text"
                    name="location"
                    onChange={handleChange}
                    onBlur={handleLocationBlur}
                    value={editTip.location}
                    placeholder="Let us Know!"
                  />
                </div>
                <div className="textDetailEdit">
                  <label htmlFor="username">Text: </label>
                  <input
                    type="text"
                    id="text"
                    name="text"
                    onChange={handleChange}
                    placeholder={tip.text}
                  />
                </div>
                <div>
                  <input
                    type="file"
                    id="profile_Edit"
                    name="profile_image"
                    className="form-control-file"
                    onChange={handleFileSubmit}
                  />
                </div>
                <div></div>
                <div>
                  <label id="labelEdit" for="category">
                    Category:{" "}
                  </label>
                  <select
                    id="categoryEdit"
                    name="category"
                    onChange={handleChange}
                    value={editTip.category}
                  >
                    <option value="Food">Food</option>
                    <option value="Traffic">Traffic</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>

                <button className="detailEditBtn" type="submit">
                  Edit
                </button>
              </form>
            </div>

            <div className="tipEditBack">
              <div>
                {" "}
                <Link className="edit" onClick={handleEditButton}>
                  Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <h3>Comments:</h3>
      <div className="countries-container">
        {comments && comments.length > 0 ? (
          <>
            {comments.map((comment) => {
              return (
                <Comment
                  key={comment._id}
                  comment={comment}
                  setComments={setComments}
                  commentLikes={comment.likes.length}
                />
              );
            })}
          </>
        ) : (
          <h4 className="noTips">No Comments found</h4>
        )}
      </div>
    </div>
  );
};

export default TipDetail;
