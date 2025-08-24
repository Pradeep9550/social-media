import { Link } from 'react-router-dom'
import { SlSocialInstagram } from "react-icons/sl";
import { FaHome, FaSearch, FaPlus, FaUser, FaSignOutAlt, FaHeart, FaCompass, FaVideo, FaSignInAlt } from 'react-icons/fa'

const Sidebar = ({ user, logout, onCreatePost }) => {
  return (
    <div className="fixed left-0 top-0 h-full w-16 md:w-64 bg-white border-r border-gray-200 z-10 flex flex-col">
      
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="text-xl font-bold text-pink-500 hidden md:block">Social Media</Link>
        <Link to="/" className="text-3xl font-bold text-pink-500 md:hidden flex justify-center"><SlSocialInstagram /></Link>
      </div>
      
      
      <div className="flex-1 py-10">
        <ul>
          <li className="mb-4">
            <Link 
              to="/" 
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-pink-500"
            >
              <FaHome className="h-6 w-6" />
              <span className="ml-4 hidden md:block">Home</span>
            </Link>
          </li>

          <li className="mb-4">
            <Link 
              to="/reels" 
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-pink-500"
            >
              <FaVideo className="h-6 w-6" />
              <span className="ml-4 hidden md:block">Reels</span>
            </Link>
          </li>

          <li className="mb-4">
            <Link 
              to="/search" 
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-pink-500"
            >
              <FaSearch className="h-6 w-6" />
              <span className="ml-4 hidden md:block">Search</span>
            </Link>
          </li>

          <li className="mb-4">
            <button 
              className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-pink-500"
              onClick={onCreatePost}
            >
              <FaPlus className="h-6 w-6" />
              <span className="ml-4 hidden md:block">Create</span>
            </button>
          </li>
          
          <li className="mb-2">
            <Link 
              to={`/profile/${user?.username}`} 
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-pink-500"
            >
              <FaUser className="h-6 w-6" />
              <span className="ml-4 hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
      </div>
      
      
      <div className="p-4 border">
        <button 
          onClick={logout}
          className="flex items-center text-gray-700 hover:bg-gray-100 hover:text-pink-500"
        >
          <FaSignOutAlt className="h-6 w-6" />
          <span className="ml-4 hidden md:block">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar