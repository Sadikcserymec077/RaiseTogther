import React, { useState, useEffect } from 'react';
import { commentApi } from '../../api/commentApi';
import Avatar from '../common/Avatar';
import { MessageSquare, Reply, Trash2, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const CommentsSection = ({ campaignId, user, isAuthenticated }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // commentId
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await commentApi.getComments(campaignId, 0, 50);
      if (data.success) {
        setComments(data.data.content || []);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [campaignId]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!isAuthenticated) {
      toast.error('Please log in to post comments');
      return;
    }

    try {
      const { data } = await commentApi.postComment(campaignId, newComment.trim());
      if (data.success) {
        setComments(prev => [data.data, ...prev]);
        setNewComment('');
        toast.success('Comment posted');
      }
    } catch (err) {
      toast.error('Failed to post comment');
    }
  };

  const handlePostReply = async (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (!isAuthenticated) {
      toast.error('Please log in to reply');
      return;
    }

    try {
      const { data } = await commentApi.postReply(commentId, replyText.trim());
      if (data.success) {
        setComments(prev =>
          prev.map(c => {
            if (c.id === commentId) {
              return { ...c, replies: [...(c.replies || []), data.data] };
            }
            return c;
          })
        );
        setReplyingTo(null);
        setReplyText('');
        toast.success('Reply posted');
      }
    } catch (err) {
      toast.error('Failed to post reply');
    }
  };

  const handleDeleteComment = async (commentId, isReply, parentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const { data } = await commentApi.deleteComment(commentId);
      if (data.success) {
        if (isReply) {
          setComments(prev =>
            prev.map(c => {
              if (c.id === parentId) {
                return { ...c, replies: c.replies.filter(r => r.id !== commentId) };
              }
              return c;
            })
          );
        } else {
          setComments(prev => prev.filter(c => c.id !== commentId));
        }
        toast.success('Comment deleted');
      }
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return date.toLocaleDateString(undefined, { dateStyle: 'medium' });
  };

  return (
    <div className="space-y-6">
      {/* Post comment form */}
      {isAuthenticated ? (
        <form onSubmit={handlePostComment} className="flex gap-4 items-start">
          <Avatar name={user.name} url={user.profilePicture} size="md" />
          <div className="flex-grow">
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Join the discussion... Share words of support!"
              className="w-full rounded-xl border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 text-sm p-3 shadow-sm placeholder-gray-400 border resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="bg-primary hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" /> Comment
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 bg-gray-50 border border-dashed rounded-xl text-sm text-gray-500">
          Please <a href="/login" className="text-primary hover:underline font-semibold">log in</a> to participate in discussions.
        </div>
      )}

      {/* List */}
      {loading && comments.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          No comments yet. Be the first to start the conversation!
        </div>
      ) : (
        <div className="space-y-6 divide-y divide-gray-100">
          {comments.map((comment) => (
            <div key={comment.id} className="pt-5 first:pt-0">
              <div className="flex gap-3 items-start">
                <Avatar name={comment.authorName} url={comment.authorAvatar} size="md" />
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{comment.authorName}</span>
                      <span className="text-xxs text-gray-400">{getRelativeTime(comment.createdAt)}</span>
                    </div>
                    {/* Delete button */}
                    {(user?.id === comment.authorId || user?.roles?.includes('ROLE_ADMIN')) && (
                      <button
                        onClick={() => handleDeleteComment(comment.id, false, null)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{comment.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-2">
                    {isAuthenticated && (
                      <button
                        onClick={() => {
                          setReplyingTo(replyingTo === comment.id ? null : comment.id);
                          setReplyText('');
                        }}
                        className="text-xs text-gray-500 hover:text-primary font-medium flex items-center gap-1 transition-colors"
                      >
                        <Reply className="w-3.5 h-3.5" /> Reply
                      </button>
                    )}
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <form onSubmit={(e) => handlePostReply(e, comment.id)} className="flex gap-3 items-start mt-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <Avatar name={user.name} url={user.profilePicture} size="sm" />
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${comment.authorName}...`}
                          className="w-full bg-white rounded-lg border border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 text-xs px-3 py-2"
                          autoFocus
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => setReplyingTo(null)}
                            className="px-2.5 py-1 text-xxs text-gray-500 hover:bg-gray-200 rounded font-medium transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-primary hover:bg-indigo-700 text-white text-xxs font-semibold px-3 py-1 rounded transition-colors"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Replies List */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-2 items-start">
                          <Avatar name={reply.authorName} url={reply.authorAvatar} size="sm" />
                          <div className="flex-grow bg-gray-50/50 p-2.5 rounded-xl border border-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-800 text-xs">{reply.authorName}</span>
                                <span className="text-xxs text-gray-400">{getRelativeTime(reply.createdAt)}</span>
                              </div>
                              {(user?.id === reply.authorId || user?.roles?.includes('ROLE_ADMIN')) && (
                                <button
                                  onClick={() => handleDeleteComment(reply.id, true, comment.id)}
                                  className="text-gray-400 hover:text-red-500 p-0.5 rounded transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-gray-700 mt-1 whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
