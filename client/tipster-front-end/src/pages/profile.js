import { LoadingContext } from "../context/loading.context";
import { useContext, useEffect, useState } from "react";
import { Form, useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../services/baseUrl";
import Tip from "../components/tip";
import { Link } from "react-router-dom";
import { post, get } from "../services/authService";
import { AuthContext } from "../context/auth.context";

import Comment from "../components/Comments";

const Profile = ({ setIsBackgroundDimmed, isBackgroundDimmed}) => {
  const { id } = useParams();

  const [user, setUser] = useState("");
  const [userTips, setUserTips] = useState([]);

  const [error, setError] = useState(null);

 const { comment, authUser, getTips}  = useContext(LoadingContext)

  const getUser = () => {
    axios
      .get(`${baseUrl}/users/profile/${id}`)
      .then((response) => {
        setUser(response.data);
        console.log("User:", response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTip = () => {
    axios
      .get(`${baseUrl}/users/profile/tips/${id}`)
      .then((response) => {
        setUserTips(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUser(id);
  }, []);

  useEffect(() => {
    getTip(id);
  }, []);

  const [edit, setEdit] = useState(null);

  const handleEdit = () => {
    setEdit(true);
    setIsBackgroundDimmed(true);
    setError(null);
  };

  const handleFalse = () => {
    setEdit(false);
    setIsBackgroundDimmed(false);
    setError(null);
  };

  const { changeLogout } = useContext(AuthContext);

  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    username: "",
    profile_image: "",
    previous_image: user.profile_image
  });

  const handleChange = (e) => {
    setEditUser((recent) => ({ ...recent, [e.target.name]: e.target.value }));
    console.log("Editing User", editUser);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    post(`/users/profile-edit/${id}`, editUser)
      .then((results) => {
        console.log("Edited User", results.data);
        setIsBackgroundDimmed(false);
        changeLogout();
        getTips()
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data.message);
      });
  };


  const handleFileSubmit = (e) => {
     let fileUpload = new FormData()
     fileUpload.append("profile_image", e.target.files[0])
     post('/users/add-picture', fileUpload)
     .then((result) =>{
      setEditUser((recent) => ({ ...recent, profile_image: result.data }));
     })
     .catch((err) => {
      console.log(err)
     })
  }

  const handleDelete = () => {
    get(`/users/profile/delete/${id}`)
      .then(() => {
        console.log("User deleted");
        handleFalse();
        setIsBackgroundDimmed(false);
        changeLogout();
      })
      .catch((err) => {
        console.log(err);
      });
  };



  return (
    <div className="profile">
      
      {edit && (
        <div className="profileEdit">
          <form
            id="profileForm"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <h2>Edit</h2>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={editUser.username}
              onChange={handleChange}
              required
            />

            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editUser.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editUser.email}
              onChange={handleChange}
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              required
            />

            <label htmlFor="profile_image">Image:</label>
            <input
              type="file"
              id="profile_image"
              name="profile_image"
              className="form-control-file"
              onChange={handleFileSubmit}
             
            />

            <button type="submit">Edit</button>
            {error && <p>Error: {error}</p>}
            <Link className="deleteUser" onClick={handleDelete}>
              <img src="https://cdn-icons-png.flaticon.com/512/1828/1828665.png"></img>
              <span id="home">Delete User</span>
            </Link>
            <Link className="exitEdit" onClick={handleFalse}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/3114/3114883.png"
                alt="Exit"
              />
              Exit
            </Link>
          </form>
        </div>
      )}
      <Link className="settings" onClick={handleEdit}>
        Edit Profile
      </Link>
      <h1>
        Hello <span>{user.name}</span>
      </h1>

      {user ? (
        <>
          {user.profile_image ? (
            <img
              className="profileimg"
              src={user.profile_image}
              alt="profile"
            ></img>
          ) : (
            <img
              src="https://cdn-icons-png.flaticon.com/512/2789/2789871.png"
              alt="default-profile"
            ></img>
          )}
          <p>Name: {user.name}</p>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <h4>Loading...</h4>
      )}
      <div className="userTips">
        <h3>User Tips:</h3>
        {userTips ? (
          <>
            {userTips.map((tip) => {
              return <Tip key={tip._id} tip={tip} getTip={getTip}/>;
            })}
          </>
        ) : (
          <h4>Loading...</h4>
        )}
      </div>
    </div>
  );
};

export default Profile;
