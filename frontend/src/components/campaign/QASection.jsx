import React, { useState, useEffect } from 'react';
import { questionApi } from '../../api/questionApi';
import Avatar from '../common/Avatar';
import { HelpCircle, MessageSquare, Trash2, Send, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const QASection = ({ campaignId, user, isAuthenticated, isCreator }) => {
  const [questions, setQuestions] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [answeringId, setAnsweringId] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await questionApi.getQuestions(campaignId, 0, 50);
      if (data.success) {
        setQuestions(data.data.content || []);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [campaignId]);

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    if (!isAuthenticated) {
      toast.error('Please log in to ask a question');
      return;
    }

    try {
      const { data } = await questionApi.postQuestion(campaignId, newTitle.trim(), newContent.trim());
      if (data.success) {
        setQuestions(prev => [data.data, ...prev]);
        setNewTitle('');
        setNewContent('');
        toast.success('Question submitted');
      }
    } catch (err) {
      toast.error('Failed to submit question');
    }
  };

  const handlePostAnswer = async (e, questionId) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    try {
      const { data } = await questionApi.answerQuestion(questionId, answerText.trim());
      if (data.success) {
        setQuestions(prev =>
          prev.map(q => q.id === questionId ? { ...q, answer: data.data.answer, answeredAt: data.data.answeredAt } : q)
        );
        setAnsweringId(null);
        setAnswerText('');
        toast.success('Answer posted');
      }
    } catch (err) {
      toast.error('Failed to post answer');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      const { data } = await questionApi.deleteQuestion(questionId);
      if (data.success) {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
        toast.success('Question deleted');
      }
    } catch (err) {
      toast.error('Failed to delete question');
    }
  };

  return (
    <div className="space-y-6">
      {/* Ask question form - hide from creator */}
      {isAuthenticated && !isCreator && (
        <form onSubmit={handlePostQuestion} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
            <HelpCircle className="w-5 h-5 text-primary" /> Ask a Question to Organizer
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Summary of your question (e.g. Delivery date, Shipping cost)"
              className="w-full rounded-lg border border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 text-sm px-3 py-2"
              required
            />
            <textarea
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Elaborate details of your question..."
              className="w-full rounded-lg border border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 text-sm px-3 py-2 resize-none"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" /> Ask Question
            </button>
          </div>
        </form>
      )}

      {!isAuthenticated && (
        <div className="text-center py-4 bg-gray-50 border border-dashed rounded-xl text-sm text-gray-500">
          Please <a href="/login" className="text-primary hover:underline font-semibold">log in</a> to ask questions to the creator.
        </div>
      )}

      {/* List */}
      {loading && questions.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          <HelpCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          No questions asked yet.
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-3">
                  <Avatar name={q.questionerName} url={q.questionerAvatar} size="md" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{q.title}</h4>
                    <p className="text-xs text-gray-500">
                      Asked by {q.questionerName} • {new Date(q.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{q.content}</p>
                  </div>
                </div>
                {(user?.id === q.questionerId || user?.roles?.includes('ROLE_ADMIN')) && (
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Answer section */}
              {q.answer ? (
                <div className="pl-4 border-l-4 border-primary bg-indigo-50/20 p-3 rounded-r-xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="bg-primary text-white text-xxs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Organizer Response
                    </span>
                    {q.answeredAt && (
                      <span className="text-xxs text-gray-400">
                        {new Date(q.answeredAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{q.answer}</p>
                </div>
              ) : isCreator ? (
                /* Creator answer form */
                <div className="pl-4 border-l-4 border-dashed border-gray-300">
                  {answeringId === q.id ? (
                    <form onSubmit={(e) => handlePostAnswer(e, q.id)} className="space-y-3">
                      <textarea
                        rows={2}
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Write your answer..."
                        className="w-full rounded-lg border border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 text-xs px-3 py-2 resize-none bg-gray-50"
                        required
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAnsweringId(null);
                            setAnswerText('');
                          }}
                          className="px-3 py-1.5 text-xxs text-gray-500 hover:bg-gray-150 rounded font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-primary hover:bg-indigo-700 text-white text-xxs font-semibold px-3 py-1.5 rounded transition-colors"
                        >
                          Post Answer
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setAnsweringId(q.id)}
                      className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Answer this question
                    </button>
                  )}
                </div>
              ) : (
                <div className="pl-4 border-l-4 border-dashed border-gray-200">
                  <span className="text-xs text-gray-400 italic">Awaiting answer from creator</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QASection;
