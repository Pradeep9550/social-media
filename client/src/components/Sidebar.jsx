import { Link } from 'react-router-dom';
import { SlSocialInstagram } from "react-icons/sl";
import { FaHome, FaSearch, FaPlus, FaUser, FaSignOutAlt, FaVideo } from 'react-icons/fa';

const Sidebar = ({ user, logout, onCreatePost }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-10 flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <Link to="/" className="text-xl font-bold text-pink-500">Social Media</Link>
        </div>

        {/* Menu */}
        <div className="flex-1 py-10">
          <ul>
            <li className="mb-4">
              <Link to="/" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-pink-500">
                <FaHome className="h-6 w-6" />
                <span className="ml-4">Home</span>
              </Link>
            </li>

            <li className="mb-4">
              <Link to="/reels" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-pink-500">
                <FaVideo className="h-6 w-6" />
                <span className="ml-4">Reels</span>
              </Link>
            </li>

            <li className="mb-4">
              <Link to="/search" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-pink-500">
                <FaSearch className="h-6 w-6" />
                <span className="ml-4">Search</span>
              </Link>
            </li>

            <li className="mb-4">
              <button onClick={onCreatePost} className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-pink-500">
                <FaPlus className="h-6 w-6" />
                <span className="ml-4">Create</span>
              </button>
            </li>

            <li className="mb-4">
              <Link to={`/profile/${user?.username}`} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-pink-500">
                <FaUser className="h-6 w-6" />
                <span className="ml-4">Profile</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button onClick={logout} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-pink-500 w-full">
            <FaSignOutAlt className="h-6 w-6" />
            <span className="ml-4">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 z-10 flex justify-around items-center">
        <Link to="/" className="text-gray-700 hover:text-pink-500">
          <FaHome className="h-5 w-5" />
        </Link>

        <Link to="/reels" className="text-gray-700 hover:text-pink-500">
          <FaVideo className="h-5 w-5" />
        </Link>

        <button onClick={onCreatePost} className="text-gray-700 hover:text-pink-500">
          <FaPlus className="h-5 w-5" />
        </button>

        <Link to="/search" className="text-gray-700 hover:text-pink-500">
          <FaSearch className="h-5 w-5" />
        </Link>

        <Link to={`/profile/${user?.username}`} className="text-gray-700 hover:text-pink-500">
          <FaUser className="h-5 w-5" />
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
