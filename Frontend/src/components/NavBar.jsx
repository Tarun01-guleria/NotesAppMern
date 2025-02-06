import SearchBar from "./SearchBar/SearchBar";
import ProfileInfo from "./Cards/ProfileInfo";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  signoutFailure,
  signoutStart,
  signoutSuccess,
} from "../../redux/userSlice";
import axios from "axios";
const NavBar = ({ userInfo, handleClearSearch, onSearchNote }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };
  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  const onLogout = async () => {
    try {
      dispatch(signoutStart());

      const res = await axios.get("http://localhost:8001/api/auth/signout", {
        withCredentials: true,
      });

      if (res.data.success === false) {
        dispatch(signoutFailure(res.data.message));
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);

      dispatch(signoutSuccess());
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      dispatch(signoutFailure(error.message));
    }
  };
  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <Link to="/">
        <h2 className="text-xl font-medium text-black py-2">
          <span className="text-slate-500">AI </span>
          <span className="text-slate-900">Notes</span>
        </h2>
      </Link>

      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      <ProfileInfo onLogout={onLogout} userInfo={userInfo} />
    </div>
  );
};

export default NavBar;
