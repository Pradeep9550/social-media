import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CgProfile } from 'react-icons/cg';

const FriendProfile = ({ user }) => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);


  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get(`https://social-media-3qeu.onrender.com/api/users/profile/${username}`);
        setUserProfile(res.data);

        setPosts(res.data.posts || []);
        setIsFollowing(res.data.followers?.some(f => f._id === user._id));
      } catch (error) {
        console.log('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username && user._id) getUserDetails();
  }, [username, user._id]);

 
  const handleFollowToggle = async () => {
    try {
      const url = isFollowing
        ? `https://social-media-3qeu.onrender.com/api/users/unfollow/${userProfile._id}`
        : `https://social-media-3qeu.onrender.com/api/users/follow/${userProfile._id}`;

      const res = await axios.put(url, {}, {
        headers: {
          Authorization: user.token 
        }
      });

      setIsFollowing(!isFollowing);

      setUserProfile((prev) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter((f) => f._id !== user._id)
          : [...prev.followers, { _id: user._id }]
      }));

    //   console.log(res.data.message);
    } catch (error) {
      console.error('Error toggling follow:', error.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (!userProfile) {
    return <div className="text-center text-red-500 py-10">Profile not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 mt-12 gap-24">
        {/* Profile Picture */}
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white bg-gray-200">
          {userProfile.profilePicture ? (
            <img
              src={userProfile.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <CgProfile className="w-3/4 h-3/4" />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="text-center md:text-left mt-4">
          <h2 className="text-xl font-bold">@{userProfile.username}</h2>
          <p className="font-semibold mt-2">{userProfile.fullName}</p>
          <p className="text-gray-600 mt-2">{userProfile.bio || 'No bio available.'}</p>

          <div className="mt-6 flex justify-center md:justify-start space-x-4 text-sm text-gray-600">
            <span>{posts.length} Posts</span>
            <span>{userProfile.followers?.length || 0} Followers</span>
            <span>{userProfile.following?.length || 0} Following</span>
          </div>

          {/* Follow/Unfollow Button */}
          {user._id !== userProfile._id && (
            <button
              onClick={handleFollowToggle}
              className="mt-4 px-6 py-2 rounded text-white bg-pink-500"
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      {/* User Posts */}
      <div className="mt-20 grid grid-cols-3 gap-1">
        {posts.length === 0 && (
          <p className="col-span-3 text-center text-gray-500">No posts yet.</p>
        )}
        {posts.map((post) => (
          <div key={post._id} className="aspect-square overflow-hidden relative rounded group">
            {post.mediaType === 'image' ? (
              <img
                src={post.mediaUrl}
                alt={post.caption || 'Post image'}
                className="w-full h-full object-cover"
              />
            ) : post.mediaType === 'video' ? (
              <video
                src={post.mediaUrl}
                className="w-full h-full object-cover"
                controls
                muted
                loop
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                Unsupported media
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendProfile;
