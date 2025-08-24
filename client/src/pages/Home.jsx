import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa'

const Home = ({ user }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [activeCommentPost, setActiveCommentPost] = useState(null)

 useEffect(() => {
  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/posts/feed', {
        headers: {
          Authorization: user.token 
        }
      })
      // console.log('API response:', res.data)
      setPosts(res.data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  fetchPosts()
}, [user.token])


  const handleLike = async (postId) => {
    try {
      await axios.put(`/api/posts/${postId}/like`, {}, {
        headers: { Authorization: user.token }
      })

      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? {
                ...post,
                likes: post.likes.includes(user._id)
                  ? post.likes.filter(id => id !== user._id)
                  : [...post.likes, user._id]
              }
            : post
        )
      )
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleComment = async (postId) => {
    if (!comment.trim()) return

    try {
      const res = await axios.post(`/api/posts/${postId}/comment`, { text: comment }, {
        headers: { Authorization: user.token }
      })

      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? { ...post, comments: res.data }
            : post
        )
      )
    } catch (error) {
      console.error('Error commenting on post:', error)
    }

    setComment('')
    setActiveCommentPost(null)
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {posts.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-gray-900">No posts yet</h2>
          <p className="mt-2 text-gray-600">Follow some users to see their posts here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map(post => (
            <div key={post._id} className="bg-white rounded-lg shadow overflow-hidden">
              
              {/* Header */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Link to={`/profile/${post.user.username}`}>
                    <img 
                      src={post.user.profilePicture || `https://dummyimage.com/40x40/ccc/fff.png&text=${post.user.username[0]?.toUpperCase()}`}  
                      alt={post.user.username} 
                      className="h-8 w-8 rounded-full"
                    />
                  </Link>
                  <Link to={`/profile/${post.user.username}`} className="font-medium text-gray-900 hover:underline">
                    {post.user.username}
                  </Link>
                </div>
              </div>

              
              {post.mediaType === 'image' && (
                <img src={post.mediaUrl} alt={post.caption} className="w-full h-96  object-contain" />
              )}

              {post.mediaType === 'video' && (
                <video autoPlay loop muted controls  className="w-full h-[500px]  object-cover">
                <source src={post.mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
               </video>
              )}



              {/* Actions */}
              <div className="px-4 py-2 flex items-center space-x-4">
                <button 
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center space-x-1 ${post.likes.includes(user._id) ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {post.likes.includes(user._id) ? <FaHeart className="h-6 w-6" /> : <FaRegHeart className="h-6 w-6" />}
                  <span>{post.likes.length}</span>
                </button>
                <button 
                  onClick={() => setActiveCommentPost(activeCommentPost === post._id ? null : post._id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                >
                  <FaComment className="h-6 w-6" />
                  <span>{post.comments.length}</span>
                </button>
              </div>

              {/* Caption */}
              <div className="px-4 py-2">
                <p className="text-gray-900">
                  <Link to={`/profile/${post.user.username}`} className="font-medium hover:underline mr-2">
                    {post.user.username}
                  </Link>
                  {post.caption}
                </p>
                <p className="text-xs text-gray-500 mt-1">{formatDate(post.createdAt)}</p>
              </div>

              {/* Comments */}
              {post.comments.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-200">
                  {post.comments.length > 2 && activeCommentPost !== post._id && (
                    <button 
                      onClick={() => setActiveCommentPost(post._id)}
                      className="text-sm text-gray-500 hover:text-gray-700 mb-2"
                    >
                      View all {post.comments.length} comments
                    </button>
                  )}
                  
                  {(activeCommentPost === post._id ? post.comments : post.comments.slice(-2)).map(comment => (
                    <div key={comment._id} className="mb-2">
                      <p className="text-sm">
                        <Link to={`/profile/${comment.user.username}`} className="font-medium hover:underline mr-2">
                          {comment.user.username}
                        </Link>
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add comment */}
              {activeCommentPost === post._id && (
                <div className="px-4 py-3 border-t border-gray-200 flex">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 border-none focus:ring-0 focus:outline-none text-sm"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                  />
                  <button
                    onClick={() => handleComment(post._id)}
                    disabled={!comment.trim()}
                    className="text-pink-500 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home