import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Search = ({user}) => {

    const [searchUsers, setSearchUsers] = useState([]);
    // console.log(searchUsers)

    const handleSearchChanger =async (e) =>{
        const value = e.target.value
        const res = await axios.get(`/api/users/search?query=${value}`);
        const data = res.data;
        setSearchUsers(data)
    }

    const handleLinkClick = () => {
    setSearchUsers([])
  } 

  return (
    <div>
     


     
<form className="max-w-md lg:mx-auto mt-6 mx-3 ">   
  <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
  <div className="relative">
    <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none">
      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
      </svg>
    </div>
    <input onChange={handleSearchChanger} type="search" id="default-search" className="block w-full p-4 ps-14  border border-pink-400 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search..." required />

     {searchUsers.length > 0 && (
                  <div className="absolute top-full mt-2 lg:ml-4 w-72 bg-white text-black z-40 rounded-lg shadow dark:bg-gray-700">
                    {searchUsers.map((ele) =>
                      ele._id !== user?._id ? (
                        <Link
                          key={ele._id}
                          onClick={handleLinkClick}
                          state={ele._id}
                          to={`/friendProfile/${ele.username}`}
                          className="flex items-center gap-3 p-2 hover:bg-gray-100 hover:rounded-lg dark:hover:bg-gray-600"
                        >
                          <img 
                            className="w-8 h-8 rounded-full" 
                            src={ele.profilePicture  || `https://dummyimage.com/40x40/ccc/fff.png&text=${ele.username[0]?.toUpperCase()}`}  
                            alt={ele.name} />
                          <p className="text-sm dark:text-white">{ele.username}</p>
                        </Link>
                      ) : null
                    )}
                  </div>
                )}
  </div>
</form>


    </div>
  )
}

export default Search

