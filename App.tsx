
import React from 'react';
import Scanner from './components/Scanner';

const App: React.FC = () => {
  return (
    <div className="min-h-screen pb-12">
      {/* Navigation / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-none">PhishLens</h1>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">CharGRU Detector v1.0</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-sm font-semibold text-indigo-600">Dashboard</a>
              <a href="#" className="text-sm font-semibold text-slate-500 hover:text-slate-900">Research Paper</a>
              <a href="#" className="text-sm font-semibold text-slate-500 hover:text-slate-900">API Docs</a>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-400">STATUS</span>
                <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  MODEL ONLINE
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-indigo-900 text-white pt-16 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Every Character Counts.
          </h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
            Advanced character-level deep learning (CharGRU) with Grad-CAM explainability to defeat even the most subtle phishing attempts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 bg-indigo-800/50 backdrop-blur rounded-full border border-indigo-700 text-sm font-medium">
              ⚡ Efficient CharGRU Model
            </div>
            <div className="px-4 py-2 bg-indigo-800/50 backdrop-blur rounded-full border border-indigo-700 text-sm font-medium">
              🔍 Grad-CAM Heatmaps
            </div>
            <div className="px-4 py-2 bg-indigo-800/50 backdrop-blur rounded-full border border-indigo-700 text-sm font-medium">
              🛡️ Adversarial Robustness
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <Scanner />
      </main>

      {/* Footer Info */}
      <footer className="mt-20 border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm mb-2">Based on the research paper</p>
          <h4 className="text-slate-600 font-semibold mb-6">"Every Character Counts: From Vulnerability to Defense in Phishing Detection"</h4>
          <div className="flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="flex items-center gap-2 font-bold text-slate-800">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
               OpenSource
             </div>
             <div className="flex items-center gap-2 font-bold text-slate-800">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
               ResearchLabs
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
