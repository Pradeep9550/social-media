import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { FaUserEdit, FaCheck, FaCamera } from 'react-icons/fa'
import { CgProfile } from 'react-icons/cg'
import { MdDelete } from 'react-icons/md'



const Profile = ({ user }) => {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ fullName: '', bio: '' })

  const profileInputRef = useRef()

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await axios.get(`/api/users/profile/${username}`)
        setProfile(res.data)
        setEditForm({
          fullName: res.data.fullName || '',
          bio: res.data.bio || '',
        })

        const postsRes = await axios.get(`/api/posts/user/${res.data._id}`, {
          headers: { Authorization: user.token } 
        })
        setPosts(postsRes.data)
      } catch (err) {
        console.error('Error loading profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [username, user._id, user.token])

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put('/api/users/profile', editForm, {
        headers: { Authorization: user.token } 
      })
      setProfile({ ...profile, ...res.data })
      setIsEditing(false)
    } catch (err) {
      console.error('Profile update failed:', err)
    }
  }

  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('image/')) {
    return alert('Please upload an image.');
  }

  try {
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET);

const cloudRes = await axios.post(
  `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
  formData
);


    const profilePictureUrl = cloudRes.data.secure_url;

   
    const res = await axios.put(
      '/api/users/profile/picture',
      { profilePicture: profilePictureUrl },
      {
        headers: {
          Authorization: user.token,
        },
      }
    );

    setProfile(prev => ({ ...prev, profilePicture: res.data.profilePicture }));
  } catch (err) {
    console.error('Uploading profile picture failed:', err);
    alert('Failed to upload profile picture.');
  }
};



  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?")
    if (!confirmDelete) return

    try {
      await axios.delete(`/api/posts/${postId}`, {
        headers: { Authorization: user.token }, 
      })
      setPosts((prev) => prev.filter((p) => p._id !== postId))
    } catch (err) {
      console.error('Failed to delete post:', err)
      alert('Could not delete post. Please try again.')
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>
  }

  if (!profile) {
    return <div className="text-center text-red-500 py-10">Profile not found.</div>
  }

  const isCurrentUser = user._id === profile._id

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 mt-12 gap-24">
        {/* Profile Picture */}
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white bg-gray-200">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <CgProfile className="w-3/4 h-3/4" />
            </div>
          )}

          {isCurrentUser && (
            <>
              <input
                type="file"
                hidden
                ref={profileInputRef}
                onChange={(e) => handleImageUpload(e, 'profilePicture')}
                accept="image/*"
              />
              <button
                onClick={() => profileInputRef.current.click()}
                className="absolute bottom-7 right-5 bg-white p-1 rounded-full shadow"
                title="Change profile picture"
              >
                <FaCamera size={14} />
              </button>
            </>
          )}
        </div>

        {/* User Info */}
        <div className="text-center md:text-left mt-4">
          <h2 className="text-xl font-bold">@{profile.username}</h2>

          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="mt-3 flex flex-col items-center md:items-start">
              <input
                type="text"
                name="fullName"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                className="border px-2 py-1 mb-2 w-full max-w-xs"
                placeholder="Full Name"
              />
              <textarea
                name="bio"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                rows="2"
                className="border w-full px-2 py-1 max-w-xs"
                placeholder="Your bio..."
              />
              <button className="bg-pink-500 text-white px-3 py-1 rounded mt-2 w-24">
                Save
              </button>
            </form>
          ) : (
            <>
              <p className="font-semibold mt-2">{profile.fullName}</p>
              <p className="text-gray-600 mt-2">{profile.bio}</p>
            </>
          )}

          <div className="mt-6 flex justify-center md:justify-start space-x-4 text-sm text-gray-600">
            <span>{posts.length} Posts</span>
            <span>{profile.followers?.length || 0} Followers</span>
            <span>{profile.following?.length || 0} following</span>
          </div>

          {isCurrentUser && (
            <div className="mt-6">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-gray-200 px-4 py-1 rounded inline-flex items-center space-x-2"
              >
                {isEditing ? <FaCheck /> : <FaUserEdit />}
                <span>{isEditing ? 'Done' : 'Edit'}</span>
              </button>
            </div>
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
            {isCurrentUser && (
              <button
                onClick={() => handleDeletePost(post._id)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-80 transition"
                title="Delete Post"
              >
                <MdDelete />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Profile
