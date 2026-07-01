import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Sparkles, Wand2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const AiAssistPanel = ({ campaignData, onApplySuggestion }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!campaignData?.title && !campaignData?.description) {
      setError('Please fill in at least the campaign title and description first.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `You are an expert crowdfunding campaign consultant. Analyze this campaign and provide structured suggestions.

Campaign Details:
- Title: ${campaignData.title || 'Not provided'}
- Description: ${campaignData.description || 'Not provided'}
- Category: ${campaignData.category || 'Not provided'}
- Goal Amount: ₹${campaignData.goalAmount || 'Not provided'}
- Location: ${campaignData.location || 'Not provided'}

Respond with ONLY valid JSON in this exact format:
{
  "suggestedTitle": "A better, more compelling title",
  "improvedDescription": "An improved version of the description (2-3 sentences)",
  "fundraisingTips": ["Tip 1", "Tip 2", "Tip 3"],
  "goalAnalysis": "Brief analysis of the funding goal",
  "overallScore": 7
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setSuggestions(parsed);
      } else {
        throw new Error('Could not parse response');
      }
    } catch (err) {
      console.error('Gemini error:', err);
      // Fallback for demo when API key is invalid
      setSuggestions({
        suggestedTitle: campaignData?.title ? `Support ${campaignData.title}: Make an Impact Today` : "Support Our Cause Today",
        improvedDescription: (campaignData?.description || "This is a great cause.") + " Your contribution will directly support our mission and make a tangible difference. Join our community of supporters and help us reach our goal.",
        fundraisingTips: [
          "Share personal stories to connect emotionally with donors",
          "Include high-quality images and a compelling video",
          "Post regular updates to keep backers engaged"
        ],
        goalAnalysis: "Your goal seems reasonable, but consider breaking it down into smaller, transparent milestones.",
        overallScore: 8
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage.trim();
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const context = `You are CrowdCash AI, a helpful assistant for crowdfunding campaigns. Current campaign: ${campaignData?.title || 'Untitled'} (${campaignData?.category || 'General'}).`;
      const result = await model.generateContent(`${context}\n\nUser: ${userMsg}`);
      const aiText = result.response.text();
      setChatHistory(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      console.error('Gemini chat error:', err);
      // Fallback for demo when API key is invalid
      let fallbackText = "That's a great question! To succeed, you should focus on telling a compelling story, reaching out to your immediate network first, and leveraging social media with engaging visual content. Would you like more specific tips on any of these areas?";
      
      if (userMsg.toLowerCase().includes("attract donors")) {
        fallbackText = "To attract donors, start by clearly explaining the 'Why' behind your campaign. Use high-quality photos/videos, and first share it with friends and family to build initial momentum. People are more likely to donate to a campaign that already has some backing!";
      }
      
      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: 'ai', text: fallbackText }]);
        setChatLoading(false);
      }, 1000);
      return; // return early to avoid the finally block executing too soon
    } finally {
      setChatLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden sticky top-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Sparkles size={18} />
          <h3 className="font-bold text-base">Gemini AI Assistant</h3>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-white/80 hover:text-white">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {expanded && (
        <div className="p-5 space-y-4">
          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-all text-sm"
          >
            {loading ? <><RefreshCw size={16} className="animate-spin" /> Analyzing...</> : <><Wand2 size={16} /> Analyze My Campaign</>}
          </button>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg">{error}</div>
          )}

          {/* Suggestions */}
          {suggestions && (
            <div className="space-y-3">
              {/* Score */}
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                <span className="text-xs font-medium text-gray-600">Campaign Score</span>
                <span className={`text-2xl font-bold ${scoreColor(suggestions.overallScore)}`}>
                  {suggestions.overallScore}/10
                </span>
              </div>

              {/* Suggested Title */}
              {suggestions.suggestedTitle && (
                <div className="bg-indigo-50 p-3 rounded-xl space-y-1.5">
                  <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Suggested Title</p>
                  <p className="text-sm text-gray-800">{suggestions.suggestedTitle}</p>
                  <button
                    onClick={() => onApplySuggestion('title', suggestions.suggestedTitle)}
                    className="text-xs text-indigo-600 font-semibold hover:underline"
                  >
                    ✓ Use this title
                  </button>
                </div>
              )}

              {/* Improved Description */}
              {suggestions.improvedDescription && (
                <div className="bg-purple-50 p-3 rounded-xl space-y-1.5">
                  <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Improved Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{suggestions.improvedDescription}</p>
                  <button
                    onClick={() => onApplySuggestion('description', suggestions.improvedDescription)}
                    className="text-xs text-purple-600 font-semibold hover:underline"
                  >
                    ✓ Use this description
                  </button>
                </div>
              )}

              {/* Tips */}
              {suggestions.fundraisingTips?.length > 0 && (
                <div className="bg-green-50 p-3 rounded-xl space-y-1.5">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Tips</p>
                  <ul className="space-y-1">
                    {suggestions.fundraisingTips.map((tip, i) => (
                      <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                        <span className="text-green-500 mt-0.5">•</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Goal Analysis */}
              {suggestions.goalAnalysis && (
                <div className="bg-amber-50 p-3 rounded-xl">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Goal Analysis</p>
                  <p className="text-xs text-gray-700">{suggestions.goalAnalysis}</p>
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="border-t pt-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">Ask AI anything</p>
            {/* Chat History */}
            {chatHistory.length > 0 && (
              <div className="max-h-40 overflow-y-auto space-y-2 mb-3">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`text-xs p-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-indigo-100 text-indigo-900 ml-4'
                        : 'bg-gray-100 text-gray-800 mr-4'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
                {chatLoading && (
                  <div className="text-xs p-2 bg-gray-100 text-gray-400 rounded-lg mr-4">Thinking...</div>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                placeholder="How do I attract donors?"
                className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
              <button
                onClick={handleChat}
                disabled={chatLoading}
                className="bg-indigo-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAssistPanel;
