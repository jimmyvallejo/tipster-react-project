import { Link } from "react-router-dom"
import { useContext } from "react"
import { LoadingContext } from "../context/loading.context"
import { AuthContext } from "../context/auth.context"
import Tip from "./tip"
import { loadStripe } from '@stripe/stripe-js';
import { baseUrl } from "../services/baseUrl"


const Navbar = ({handleDimNav}) => {

    
    
    


let stripePromise;
const getStripe = () => {
    if (!stripePromise) {
      stripePromise = loadStripe(process.env.REACT_APP_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    }
    return stripePromise;
  };
  
  async function handleCheckout() {
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: process.env.REACT_APP_NEXT_PUBLIC_STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      successUrl: `http://localhost:3000`,
      cancelUrl: `http://localhost:3000`,
      customerEmail: 'customer@email.com',
    });
    if (error) {
      console.warn(error.message);
    }
  }
    
    
    const getToken = () => {
        return localStorage.getItem("authToken")
    }

    const { authUser, getTips, setComment} = useContext(LoadingContext)

    const { logout } = useContext(AuthContext)
   
    const handlePost = () => {
      window.scrollTo(0, 0);
    }

    return (
        <nav className="nav">
            <div className="nav-links">
                <span className="logo"><img className="logoimg" src="https://cdn-icons-png.flaticon.com/512/9215/9215053.png"></img>ipster</span>
                <Link to={'/'}><img id="homeimg" src="https://cdn-icons-png.flaticon.com/512/25/25694.png"></img><span id="home">Home</span></Link>
                <Link id="premiumlink" onClick={handleCheckout}><img id ="premiumimg" src="https://cdn-icons-png.flaticon.com/512/4148/4148878.png"></img> Premium</Link>
                {
                    getToken() ? 
                    <>
                        {authUser && <Link to={`/users/profile/${authUser.username}`}><img id="profileimg" src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"></img>Profile</Link>}
                        <Link className="postlink" to={'/'} onClick={handlePost}><img id="postimg" src="https://cdn-icons-png.flaticon.com/512/3573/3573196.png"></img> Post</Link>
                        <button className="logout" onClick={logout}>Logout</button>
                    </>
                    : 
                    <>
                        <Link to={'/signup'}> <img id="postimg" src="https://cdn-icons-png.flaticon.com/512/748/748137.png"></img> Signup</Link>
                        <Link className="loginlink" to={'/login'} > <img id="loginimg" src="https://cdn-icons-png.flaticon.com/512/3580/3580168.png"></img> Login</Link>
                    </>
                }
            </div>
        </nav>
    )
}

export default Navbar