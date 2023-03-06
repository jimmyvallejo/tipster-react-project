const SearchBar = ({setSearchTerm, searchTerm}) => {
  return (
    <div className="SearchBar">
      <input
        type="text"
        placeholder="Search tips..."
        value="searchTerm"
        onChange={(event) => setSearchTerm(event.target.value)}
      />
    </div>
  );
};

export default SearchBar;