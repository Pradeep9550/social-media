import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaImage, FaTimes, FaVideo } from 'react-icons/fa'
import axios from 'axios'



const CreatePost = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [caption, setCaption] = useState('')
  const [mediaType, setMediaType] = useState('')
  const [media, setMedia] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type.match('image.*')) {
      setMediaType('image')
    } else if (file.type.match('video.*')) {
      setMediaType('video')
    } else {
      setError('Please select an image or video file')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setMediaPreview(reader.result)
      setMedia(file)
      setError('')
    }
    reader.readAsDataURL(file)
  }

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!media) {
    setError('Please select an image or video');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const formData = new FormData();
    formData.append('file', media);
    formData.append('upload_preset', mediaType === 'image' ? 'image_preset' : 'video_preset');

    const resourceType = mediaType === 'image' ? 'image' : 'video';
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/${resourceType}/upload`;


    const cloudRes = await axios.post(cloudinaryUrl, formData);
    const mediaUrl = cloudRes.data.secure_url;

    const postData = {
      caption,
      mediaType,
      mediaUrl,
    };

    const backendRes = await axios.post(
  '/api/posts', 
  postData,
  {
    headers: {
      Authorization: user.token,  
    },
  }
);


    // console.log('Post created:', backendRes.data);
    onClose();
    navigate(mediaType === 'video' ? '/reels' : '/');
  } catch (error) {
    setError(
      error.response?.data?.message ||
      `Error creating ${mediaType === 'video' ? 'reel' : 'post'}`
    );
  } finally {
    setLoading(false);
  }
};


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Create New Post
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="bg-red-50 text-red-500 px-4 py-2 rounded-md mb-4">
              {error}
            </div>
          )}

          {!mediaPreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center">
              <input
                type="file"
                ref={fileInputRef}
                id="media-upload"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <div className="flex space-x-4 mb-4">
                  <FaImage className="text-gray-400 text-5xl" />
                  <FaVideo className="text-gray-400 text-5xl" />
                </div>
                <p className="text-gray-500 mb-2">Drag photos and videos here</p>
                <div className="flex space-x-4">
                  <span className="bg-pink-500 text-white px-4 py-2 rounded-md font-medium">
                    Select from computer
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4 relative">
              {mediaType === 'image' ? (
                <img 
                  src={mediaPreview} 
                  alt="Preview" 
                  className="w-full rounded-lg max-h-[50vh] object-contain"
                />
              ) : (
                <video 
                  src={mediaPreview} 
                  className="w-full rounded-lg max-h-[50vh] object-contain"
                  controls
                  autoPlay
                  loop
                  muted
                />
              )}
              <button
                type="button"
                onClick={() => {
                  setMedia(null)
                  setMediaPreview(null)
                  setMediaType('')
                }}
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white p-2 rounded-full"
              >
                <FaTimes />
              </button>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
              Caption
            </label>
            <textarea
              id="caption"
              rows="3"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-2 px-4 rounded-md font-medium disabled:bg-pink-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                Posting...
              </span>
            ) : (
              mediaType === 'video' ? 'Share to Reels' : 'Share'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePost