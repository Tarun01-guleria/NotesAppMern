import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ onLogout, userInfo }) => {
  console.log(userInfo);
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-900 font-medium bg-slate-100 ">
        {getInitials(userInfo && userInfo)}
      </div>
      <div>
        <p className="text-sm font-medium">{userInfo}</p>
      </div>
      <button
        className="text-sm bg-red-500 rounded-md p-1 text-white hover:opacity-80 cursor-pointer"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileInfo;
