import { useState } from 'react';

interface StudyBuddyProps {
  courseTitle: string;
  moduleTitle: string;
}

export default function StudyBuddy({ courseTitle, moduleTitle }: StudyBuddyProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setLoading(true);
    
    // Add user question to chat history
    const updatedHistory = [
      ...chatHistory,
      { role: 'user', content: question }
    ];
    setChatHistory(updatedHistory);
    
    try {
      const response = await fetch('/api/ai/study-buddy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          courseTitle,
          moduleTitle,
          history: updatedHistory
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAnswer(data.answer);
        setChatHistory([
          ...updatedHistory,
          { role: 'assistant', content: data.answer }
        ]);
      } else {
        setAnswer('Sorry, I encountered an error. Please try again.');
      }
    } catch (error) {
      console.error('Error getting answer:', error);
      setAnswer('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
      setQuestion('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
        AI Study Buddy
      </h3>
      
      <div className="mb-4 h-64 overflow-y-auto bg-gray-50 rounded-lg p-3">
        {chatHistory.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>Ask me anything about this module!</p>
            <p className="text-sm mt-2">I can explain concepts, provide examples, or help with exercises.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((message, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-indigo-100 ml-6' 
                    : 'bg-gray-200 mr-6'
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about this module..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 disabled:bg-indigo-400"
          disabled={loading || !question.trim()}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Ask'
          )}
        </button>
      </form>
    </div>
  );
} 