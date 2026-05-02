import React, { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('daily');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => { if (res.ok) return res.json(); throw new Error('Not logged in'); })
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!user && window.google) {
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
        callback: handleCredentialResponse
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" }
      );
    }
  }, [user]);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });
      const data = await res.json();
      if (res.ok) setUser(data.user);
    } catch (err) {
      console.error('Login error', err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  // Feature Handlers
  const handlePostMeeting = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const notes = e.target.notes.value;
    try {
      const res = await fetch('/api/meetings/post-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Failed to process notes' });
    }
    setLoading(false);
  };

  const handleSmartHelp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const requestText = e.target.requestText.value;
    try {
      const res = await fetch('/api/scheduler/smart-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestText })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Failed to schedule help' });
    }
    setLoading(false);
  };

  const handleDailyOffload = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/scheduler/daily-offload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: [{ id: 1, title: 'Write API spec', due: 'Today' }] })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Failed to generate schedule' });
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg shadow-blue-200">CP</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">ClearPath</h1>
          <p className="text-slate-500 mb-8 font-medium">You think. We coordinate.</p>
          <div className="flex flex-col items-center space-y-4">
            <div id="google-signin-button"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">CP</div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">ClearPath</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-slate-600">{user.name}</span>
          {user.picture && <img src={user.picture} alt="Profile" className="w-8 h-8 rounded-full ring-2 ring-slate-100" />}
          <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Sign out</button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 mt-8">
        <div className="flex space-x-2 mb-8 bg-slate-200/50 p-1 rounded-xl w-fit">
          <button onClick={() => setActiveTab('daily')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'daily' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Daily Offload</button>
          <button onClick={() => setActiveTab('post_meeting')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'post_meeting' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Post-Meeting Notes</button>
          <button onClick={() => setActiveTab('help')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'help' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Smart Help</button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
          {activeTab === 'daily' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Daily Cognitive Offload</h2>
              <p className="text-slate-500 mb-6">Let Gemini recommend your optimal day based on tasks and calendar blocks.</p>
              <button onClick={handleDailyOffload} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors disabled:opacity-50 shadow-sm shadow-blue-200">
                {loading ? 'Generating...' : 'Generate My Schedule'}
              </button>
            </div>
          )}

          {activeTab === 'post_meeting' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Post-Meeting Intelligence</h2>
              <p className="text-slate-500 mb-6">Paste raw notes. Gemini extracts action items and pushes them to Sheets.</p>
              <form onSubmit={handlePostMeeting}>
                <textarea name="notes" className="w-full h-48 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700 mb-4 resize-none transition-all" placeholder="Paste your messy meeting notes here..."></textarea>
                <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors disabled:opacity-50 shadow-sm shadow-blue-200">
                  {loading ? 'Extracting...' : 'Extract Action Items'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Smart Help Scheduler</h2>
              <p className="text-slate-500 mb-6">Need help? Tell us who and what, and we'll find the perfect slot.</p>
              <form onSubmit={handleSmartHelp}>
                <input name="requestText" type="text" className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700 mb-4 transition-all" placeholder="E.g., I need 30 mins with Priya about the API design" />
                <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors disabled:opacity-50 shadow-sm shadow-blue-200">
                  {loading ? 'Scheduling...' : 'Find & Book Slot'}
                </button>
              </form>
            </div>
          )}

          {result && (
            <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-100 animate-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Result</h3>
              <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono overflow-x-auto bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
