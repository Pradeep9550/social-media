import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaHeart, FaComment, FaMusic } from 'react-icons/fa';

const Reels = ({ user }) => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const videoRefs = useRef([]);
  const scrollTimeout = useRef(null);
  const [activeCommentReel, setActiveCommentReel] = useState(null);
  const [commentInput, setCommentInput] = useState('');

  // ✅ New: Touch scroll tracking
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get('https://social-media-3qeu.onrender.com/api/reels', {
          headers: {
            Authorization: user.token,
          },
        });
        setReels(res.data);
      } catch (err) {
        console.error('Failed to fetch reels:', err);
        setError('Something went wrong loading reels.');
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, [user.token]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      index === currentReelIndex ? video.play().catch(() => {}) : video.pause();
    });
  }, [currentReelIndex]);

  const handleLike = async (reelId) => {
    try {
      await axios.post(
        `https://social-media-3qeu.onrender.com/api/reels/${reelId}/like`,
        {},
        {
          headers: {
            Authorization: user.token,
          },
        }
      );
      setReels((prev) =>
        prev.map((reel) =>
          reel._id === reelId
            ? {
                ...reel,
                likes: reel.likes.includes(user._id)
                  ? reel.likes.filter((id) => id !== user._id)
                  : [...reel.likes, user._id],
              }
            : reel
        )
      );
    } catch (err) {
      console.error('Error liking reel:', err);
    }
  };

  const handleScroll = (e) => {
    if (scrollTimeout.current) return;

    const threshold = 30;
    if (Math.abs(e.deltaY) < threshold) return;

    const direction = e.deltaY > 0 ? 1 : -1;
    setCurrentReelIndex((prev) => {
      const next = prev + direction;
      return next >= 0 && next < reels.length ? next : prev;
    });

    scrollTimeout.current = setTimeout(() => {
      scrollTimeout.current = null;
    }, 500);
  };

  // ✅ New: Touch swipe handlers
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    touchEndY.current = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY.current;

    if (Math.abs(diff) < 50) return;

    const direction = diff > 0 ? 1 : -1;
    setCurrentReelIndex((prev) => {
      const next = prev + direction;
      return next >= 0 && next < reels.length ? next : prev;
    });
  };

  const handleCommentSubmit = async (reelId) => {
    if (!commentInput.trim()) return;
    try {
      const res = await axios.post(
        `https://social-media-3qeu.onrender.com/api/reels/${reelId}/comment`,
        { text: commentInput },
        {
          headers: {
            Authorization: user.token,
          },
        }
      );
      setReels((prev) =>
        prev.map((reel) => (reel._id === reelId ? { ...reel, comments: res.data } : reel))
      );
      setCommentInput('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
    );
  }

  return (
    <div
      className="h-screen w-full overflow-hidden"
      onWheel={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="h-full w-full md:w-3/5 lg:w-2/5 mx-auto relative"
        style={{
          transform: `translateY(-${currentReelIndex * 100}%)`,
          transition: 'transform 0.3s ease-in-out',
          touchAction: 'none', // Prevent default scroll on touch devices
        }}
      >
        {reels.map((reel, index) => (
          <div key={reel._id} className="h-full w-full relative">
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={reel.mediaUrl}
              className="h-full w-full object-cover"
              loop
              playsInline
              preload="metadata"
            />

            {/* Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white sm:p-5">
              <div className="flex items-center mb-2 text-sm sm:mb-4">
                <img
                  src={
                    reel.user.profilePicture ||
                    'https://dummyimage.com/40x40/ccc/fff.png&text=U'
                  }
                  alt={reel.user.username}
                  className="w-8 h-8 rounded-full sm:w-10 sm:h-10 sm:mr-3"
                />
                <span className="font-medium sm:text-lg">{reel.user.username}</span>
              </div>
              <p className="mb-1 text-xs sm:text-sm">{reel.caption}</p>
              {reel.audio && (
                <div className="flex items-center text-xs sm:text-sm">
                  <FaMusic className="mr-2" />
                  <p className="truncate">{reel.audio}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="absolute right-2 bottom-20 sm:bottom-24 flex flex-col items-center space-y-4">
              <button
                onClick={() => handleLike(reel._id)}
                className="flex flex-col items-center"
              >
                <FaHeart
                  className={`text-xl sm:text-2xl ${
                    reel.likes.includes(user._id) ? 'text-red-500' : 'text-white'
                  }`}
                />
                <span className="text-xs text-white">{reel.likes.length}</span>
              </button>

              <button
                onClick={() =>
                  setActiveCommentReel(activeCommentReel === reel._id ? null : reel._id)
                }
                className="flex flex-col items-center"
              >
                <FaComment className="text-xl sm:text-2xl text-white" />
                <span className="text-xs text-white">{reel.comments.length}</span>
              </button>
            </div>

            {/* Comments Section */}
            {activeCommentReel === reel._id && (
              <div className="absolute bottom-0 left-5 right-8 backdrop-blur-md rounded-lg bg-black/70 text-white px-4 py-3 space-y-2 max-h-[40%] overflow-y-auto mb-7">
                {reel.comments.map((comment) => (
                  <div key={comment._id} className="text-sm border-b border-gray-200 pb-1">
                    <span className="font-semibold">{comment.user.username}</span>: {comment.text}
                  </div>
                ))}

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    className="flex-1 p-1 bg-gray-200 text-black text-sm rounded"
                    placeholder="Add a comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handleCommentSubmit(reel._id)
                    }
                  />
                  <button
                    className="text-sm text-pink-500 font-medium disabled:opacity-50"
                    onClick={() => handleCommentSubmit(reel._id)}
                    disabled={!commentInput.trim()}
                  >
                    Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reels;
