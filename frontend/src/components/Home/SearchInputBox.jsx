import React from "react";
import { FaSearch } from "react-icons/fa";
const SearchInputBox = ({ openSearchModal }) => {
  return (
    <div
      className="w-80"
      style={{
        zIndex: 10,
      }}
      onClick={openSearchModal}
    >
      <div className="border border-skyblue m-2 p-3 bg-white rounded-lg cursor-pointer text-gray-500">
        <h3>What are you looking for? </h3>
      </div>
      <FaSearch
        size={20}
        color="black"
        className="relative bottom-10 left-[17.5rem] cursor-pointer"
      />
    </div>
  );
};

export default SearchInputBox;
