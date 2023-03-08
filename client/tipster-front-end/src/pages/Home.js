import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { LoadingContext } from "../context/loading.context";
import Tip from "../components/tip";
import { AuthContext } from "../context/auth.context";
import Comment from "../components/addComment";
import AddTip from "../components/addTip";



const Home = ({ dimBackground, isBackgroundDimmed, setIsBackgroundDimmed }) => {
  const { tips, getTips, comment, authUser, setAuthUser } =
    useContext(LoadingContext);
 

  const {originalTipsContext, filteredTipsContext, setOriginalTipsContext, setFilteredTipsContext} = useContext(LoadingContext)

  useEffect(() => {
    if (!tips) {
      getTips();
    }
  }, []);

  useEffect(() => {
    if (tips) {
      setOriginalTipsContext(tips);
      setFilteredTipsContext(tips);
    }
  }, [tips, comment]);



  
  const [query, setQuery] = useState("");

  const filterTipList = (category) => {
    if (category === "All") {
      setFilteredTipsContext(originalTipsContext);
      
    } else {
      const filtered = originalTipsContext.filter((tip) => tip.category === category);
      setFilteredTipsContext(filtered);
    }
  };



  const searchTipList = filteredTipsContext ? filteredTipsContext.filter((tip) => {
    const searchText = tip.text.toLowerCase();
    const searchCategory = tip.category.toLowerCase();
    const searchQuery = query.toLowerCase();
  
    return searchText.includes(searchQuery) ||
           searchCategory.includes(searchQuery) 
  }) : [];

  return (
    <div>
      <div className="SearchBar">
        <input
          type="text"
          placeholder="Search tips..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {comment ? (
        <Comment
          commentOwner={comment.owner}
          commentText={comment.text}
          commentKey={comment._id}
          authUser={authUser}
          isBackgroundDimmed={isBackgroundDimmed}
          setIsBackgroundDimmed={setIsBackgroundDimmed}
          commentPicture={comment.ownerpicture}
        />
      ) : (
        <p></p>
      )}

      <h2>Home</h2>
      {authUser && <AddTip />}
      <div className="mainButtons">
        <button onClick={() => {filterTipList("Food")}}>Dining</button>
        <button onClick={() => filterTipList("Traffic")}>Traffic</button>
        <button onClick={() => filterTipList("Entertainment")}>
          Entertainment
        </button>
        <button onClick={() => filterTipList("All")}>All</button>
      </div>

      <div className="countries-container">
        {searchTipList.length > 0 ? (
          <>
            {searchTipList.map((tip) => {
              return (
                <Tip key={tip._id} tip={tip} dimBackground={dimBackground} setFilteredTips={setFilteredTipsContext} setOriginalTips={setOriginalTipsContext} />
              );
            })}
          </>
        ) : (
          <h4 className="noTips">No tips found</h4>
        )}
      </div>
    </div>
  );
};

export default Home;
