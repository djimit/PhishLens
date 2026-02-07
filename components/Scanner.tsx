
import React, { useState, useEffect } from 'react';
import { scanEmailContent } from '../services/geminiService';
import { ScanResult, ScanState, SimulationConfig, HistoryItem } from '../types';
import HeatmapView from './HeatmapView';

const MAX_CHARS = 5000;
const HISTORY_KEY = 'phishlens_scan_history';

const Scanner: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [state, setState] = useState<ScanState>(ScanState.IDLE);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [config, setConfig] = useState<SimulationConfig>({ adversarialEnabled: true });
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const isOverLimit = content.length > MAX_CHARS;
  const isEmpty = !content.trim();
  const isInvalid = isOverLimit || isEmpty;

  const handleScan = async () => {
    if (isInvalid) return;
    
    setState(ScanState.SCANNING);
    setError(null);
    try {
      const data = await scanEmailContent(content, config);
      setResult(data);
      setState(ScanState.COMPLETED);

      // Add to history
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        content,
        config: { ...config },
        result: data,
      };
      setHistory(prev => [newItem, ...prev].slice(0, 10)); // Keep last 10
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setState(ScanState.ERROR);
    }
  };

  const loadExample = (type: 'safe' | 'phish' | 'adv') => {
    const examples = {
      safe: "Subject: Team Weekly Sync\n\nHi everyone,\n\nJust a reminder for our weekly meeting on Wednesday at 10:00 AM. We'll be discussing the Q4 roadmap and budget updates. Please update your status slides before the call.\n\nBest,\nSarah",
      phish: "Subject: URGENT: Security Breach Detected!\n\nDear User,\n\nWe detected a suspicious login attempt from Russia. Your account has been temporarily locked for your protection. To restore access immediately, please visit our secure portal: http://security-verify-bank-login.com and confirm your identity.\n\nFailure to act within 24 hours will result in permanent deletion.",
      adv: "Subject: N0tice: Your pay-pa1 account status\n\nDe@r customer, \n\nWe've found irregularities in your last transacti0n. P1ease update your info at http://secure-pay-pals.net to prevent 1oss of fund$. \n\nOur system d3tected a r1sk in your b@nk-account."
    };
    setContent(examples[type]);
    setResult(null);
    setState(ScanState.IDLE);
    setError(null);
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setContent(item.content);
    setConfig(item.config);
    setResult(item.result);
    setState(ScanState.COMPLETED);
    setIsHistoryOpen(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const handleReset = () => {
    setState(ScanState.IDLE);
    setResult(null);
    setError(null);
  };

  const charPercentage = (content.length / MAX_CHARS) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Analysis Terminal Container */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl shadow-slate-200/50 transition-all duration-500 flex flex-col md:flex-row">
        
        {/* Sidebar History (Desktop) or Toggleable Panel */}
        <div className={`bg-slate-50 border-r border-slate-200 transition-all duration-300 ${isHistoryOpen ? 'w-full md:w-64 opacity-100' : 'w-0 md:w-12 opacity-100 overflow-hidden'}`}>
           <div className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-500"
                  title="Toggle History"
                >
                  <svg className={`w-5 h-5 transform transition-transform ${isHistoryOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
                {isHistoryOpen && <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Activity</h3>}
                {isHistoryOpen && history.length > 0 && (
                  <button onClick={clearHistory} className="text-[10px] text-red-500 font-bold hover:underline">Clear</button>
                )}
              </div>

              {isHistoryOpen ? (
                <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
                  {history.length === 0 ? (
                    <p className="text-[10px] text-slate-400 italic text-center py-8">No recent scans</p>
                  ) : (
                    history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => loadHistoryItem(item)}
                        className="w-full text-left p-2 rounded border border-slate-200 bg-white hover:border-indigo-300 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[8px] font-black uppercase px-1 rounded ${item.result.isPhishing ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {item.result.isPhishing ? 'Phish' : 'Safe'}
                          </span>
                          <span className="text-[8px] text-slate-400">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[10px] text-slate-600 line-clamp-2 leading-tight">
                          {item.content.substring(0, 50)}...
                        </p>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 mt-4 opacity-50">
                   <div className="[writing-mode:vertical-lr] text-[10px] font-black text-slate-400 uppercase tracking-widest">History</div>
                </div>
              )}
           </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="px-6 py-4 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="h-4 w-[1px] bg-slate-600 mx-1"></div>
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                {state === ScanState.COMPLETED ? 'Grad-CAM Visualization' : 'Analysis Input Terminal'}
              </h2>
            </div>
            
            <div className="flex gap-2">
              {state !== ScanState.COMPLETED ? (
                <>
                  <button onClick={() => loadExample('safe')} className="px-3 py-1 text-[10px] font-bold text-green-400 border border-green-500/30 rounded hover:bg-green-500/10 transition-colors uppercase">Safe</button>
                  <button onClick={() => loadExample('phish')} className="px-3 py-1 text-[10px] font-bold text-red-400 border border-red-500/30 rounded hover:bg-red-500/10 transition-colors uppercase">Phish</button>
                  <button onClick={() => loadExample('adv')} className="px-3 py-1 text-[10px] font-bold text-orange-400 border border-orange-500/30 rounded hover:bg-orange-500/10 transition-colors uppercase">Adversarial</button>
                </>
              ) : (
                <button onClick={handleReset} className="px-3 py-1 text-[10px] font-bold text-indigo-400 border border-indigo-500/30 rounded hover:bg-indigo-500/10 transition-colors uppercase flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" /></svg>
                  New Scan
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6 bg-slate-50/50 flex-1">
            <div className="relative">
              {state === ScanState.COMPLETED && result ? (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <HeatmapView heatmap={result.heatmap} />
                  
                  {/* Heatmap Legend */}
                  <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Impact:</span>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-transparent border border-slate-300 rounded-sm"></div>
                        <span className="text-[10px] text-slate-500">None</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-rose-500/20 rounded-sm"></div>
                        <span className="text-[10px] text-slate-500">Low</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-rose-500/50 rounded-sm"></div>
                        <span className="text-[10px] text-slate-500">Med</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-rose-500/90 rounded-sm"></div>
                        <span className="text-[10px] text-slate-500">Critical</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-medium text-slate-400 italic">
                      * Highlights show character contributions to malicious classification.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    className={`w-full h-56 p-4 bg-[#1e293b] text-slate-300 border rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all font-mono text-sm resize-none shadow-inner border-slate-700 ${
                      isOverLimit ? 'ring-2 ring-red-500/50 border-red-500/50' : ''
                    }`}
                    placeholder="Paste email headers or message body here..."
                    value={content}
                    disabled={state === ScanState.SCANNING}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-8">
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${isOverLimit ? 'bg-red-500' : 'bg-indigo-500'}`}
                          style={{ width: `${Math.min(charPercentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <p className={`text-[10px] font-bold uppercase tracking-tight ${isOverLimit ? 'text-red-500' : 'text-slate-400'}`}>
                            {content.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
                          </p>
                          {isOverLimit && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-red-600 uppercase animate-pulse">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                              Limit Exceeded
                            </span>
                          )}
                        </div>
                        
                        {/* Dynamic Validation Message */}
                        <div className="flex items-center min-h-[1.5rem] transition-all duration-300">
                          {isOverLimit ? (
                            <div className="px-2 py-0.5 bg-red-50 border border-red-100 rounded flex items-center gap-1.5 animate-in fade-in slide-in-from-left-1">
                              <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <span className="text-[10px] font-bold text-red-600 uppercase">Analysis Disabled: Content exceeds the {MAX_CHARS.toLocaleString()} character limit. Please shorten your input.</span>
                            </div>
                          ) : isEmpty ? (
                            <div className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded flex items-center gap-1.5 opacity-80">
                              <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Analysis Disabled: Input is currently empty. Paste content to begin analysis.</span>
                            </div>
                          ) : (
                            <div className="px-2 py-0.5 bg-green-50 border border-green-100 rounded flex items-center gap-1.5 animate-in fade-in">
                              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              <span className="text-[10px] font-bold text-green-600 uppercase">System Ready: Input validated. Ready for CharGRU analysis.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={config.adversarialEnabled}
                          disabled={state === ScanState.SCANNING}
                          onChange={(e) => setConfig({ ...config, adversarialEnabled: e.target.checked })}
                        />
                        <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 relative transition-colors"></div>
                        <span className="text-xs font-bold text-slate-500 uppercase group-hover:text-slate-700 transition-colors">Adversarial Robustness</span>
                      </label>

                      <button
                        onClick={handleScan}
                        disabled={state === ScanState.SCANNING || isInvalid}
                        className={`px-6 py-2 rounded-lg font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
                          state === ScanState.SCANNING || isInvalid
                          ? 'bg-slate-300 cursor-not-allowed shadow-none opacity-60' 
                          : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200'
                        }`}
                        title={isOverLimit ? "Shorten text to analyze" : isEmpty ? "Enter text to analyze" : "Run Analysis"}
                      >
                        {state === ScanState.SCANNING ? (
                          <div className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Processing...
                          </div>
                        ) : 'Run Analysis'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Error Display */}
      {state === ScanState.ERROR && error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-800 uppercase tracking-wide mb-1">Analysis Interface Error</h4>
              <p className="text-xs text-red-700 font-medium mb-3">
                {error}
              </p>
              <div className="space-y-1">
                <p className="text-[10px] text-red-600/70 font-bold uppercase tracking-tight italic">Troubleshooting steps:</p>
                <ul className="text-[10px] text-red-600/60 font-medium list-disc list-inside">
                  <li>Verify that your API key is correctly configured.</li>
                  <li>Ensure your network connection is stable.</li>
                  <li>Try reducing the complexity of the input content.</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <button 
              onClick={handleReset}
              className="px-4 py-2 text-[10px] font-black text-red-700 hover:bg-red-100 rounded transition-colors uppercase border border-red-200"
            >
              Clear
            </button>
            <button 
              onClick={handleScan}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black rounded shadow-lg shadow-red-200 transition-all active:scale-95 uppercase flex items-center gap-2"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry Scan
            </button>
          </div>
        </div>
      )}

      {/* Analysis Results Cards */}
      {state === ScanState.COMPLETED && result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Inference Report</h3>
                  <div className="h-1 w-12 bg-indigo-500 rounded-full mb-4"></div>
                </div>
                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${result.isPhishing ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                  {result.isPhishing ? 'Malicious Vector Detected' : 'No Threat Identified'}
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium italic bg-slate-50 p-4 rounded-lg border-l-4 border-indigo-400">
                "{result.reasoning}"
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Detection Vectors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.summary.criticalFindings.map((finding, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:border-indigo-200 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-125 transition-transform"></div>
                    <span className="text-xs font-semibold text-slate-700">{finding}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Risk Probability</h3>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                  <circle 
                    cx="64" cy="64" r="58" 
                    stroke={result.isPhishing ? '#f43f5e' : '#10b981'} 
                    strokeWidth="10" 
                    fill="transparent" 
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * result.probability)}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-black leading-none ${result.isPhishing ? 'text-rose-600' : 'text-emerald-600'}`}>{Math.round(result.probability * 100)}%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">Confidence</span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl border flex flex-col items-center gap-4 text-center transition-all duration-500 ${
              result.summary.adversarialDetected 
              ? 'bg-amber-50 border-amber-200 shadow-lg shadow-amber-100/50' 
              : 'bg-slate-50 border-slate-200 opacity-60'
            }`}>
              <div className={`p-3 rounded-full ${result.summary.adversarialDetected ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h4 className={`text-xs font-bold uppercase ${result.summary.adversarialDetected ? 'text-amber-700' : 'text-slate-500'}`}>
                  {result.summary.adversarialDetected ? 'Obfuscation Thwarted' : 'No Obfuscation'}
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;
