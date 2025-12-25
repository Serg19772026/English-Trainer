
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { TOPICS } from './constants';
import { Topic, Sentence, AppState } from './types';
import { speakText } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SELECTING_TOPIC);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const [visibleSentences, setVisibleSentences] = useState<Record<string, Sentence[]>>(() => {
    const initial: Record<string, Sentence[]> = {};
    TOPICS.forEach(t => {
      const shuffled = [...t.sentences].sort(() => 0.5 - Math.random()).slice(0, 5);
      initial[t.id] = shuffled;
    });
    return initial;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [matchedIndices, setMatchedIndices] = useState(new Set<number>());
  const [lastMatchedIndex, setLastMatchedIndex] = useState<number | null>(null);
  const [focusedWordIndex, setFocusedWordIndex] = useState<number | null>(null);
  const [isolatedSuccessIndex, setIsolatedSuccessIndex] = useState<number | null>(null);
  
  const [focusedCharMatchCount, setFocusedCharMatchCount] = useState(0);
  const [error, setError] = useState<{ message: string; type?: string } | null>(null);
  const [refreshedTopicId, setRefreshedTopicId] = useState<string | null>(null);

  const [showTranslation, setShowTranslation] = useState(true);

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<number | null>(null);
  const wrongTimerRef = useRef<number | null>(null);
  const speechSafetyTimeoutRef = useRef<number | null>(null);
  
  const currentTopic = TOPICS[selectedTopicIndex];
  const activeSentences = visibleSentences[currentTopic.id] || currentTopic.sentences.slice(0, 5);
  const currentSentence = activeSentences[selectedSentenceIndex] || activeSentences[0];
  
  const sentenceWords = useMemo(() => 
    currentSentence?.text.split(/\s+/).map(w => w.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")) || [],
    [currentSentence]
  );

  const sentenceWordsRef = useRef<string[]>([]);
  const focusedWordIndexRef = useRef<number | null>(null);
  const isolatedSuccessIndexRef = useRef<number | null>(null);
  const isListeningRef = useRef<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      setIsMobile(mobileRegex.test(userAgent.toLowerCase()) || isTouch);
    };
    checkMobile();
  }, []);

  useEffect(() => {
    sentenceWordsRef.current = sentenceWords;
  }, [sentenceWords]);

  useEffect(() => {
    focusedWordIndexRef.current = focusedWordIndex;
  }, [focusedWordIndex]);

  useEffect(() => {
    isolatedSuccessIndexRef.current = isolatedSuccessIndex;
  }, [isolatedSuccessIndex]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    if (matchedIndices.size > 0 && matchedIndices.size === sentenceWords.length && focusedWordIndex === null) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
      setIsListening(false);
      setIsCompleted(true);
    }
  }, [matchedIndices.size, sentenceWords.length, focusedWordIndex]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (wrongTimerRef.current) window.clearTimeout(wrongTimerRef.current);
      if (speechSafetyTimeoutRef.current) window.clearTimeout(speechSafetyTimeoutRef.current);
    };
  }, []);

  const triggerWrongFeedback = () => {
    setIsWrong(true);
    if (wrongTimerRef.current) window.clearTimeout(wrongTimerRef.current);
    wrongTimerRef.current = window.setTimeout(() => {
      setIsWrong(false);
    }, 2000);
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition && !recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        const spokenWords = (transcript + interimTranscript).toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").split(/\s+/).filter(w => w.length > 0);
        const currentWords = sentenceWordsRef.current;
        const currentFocusIdx = focusedWordIndexRef.current;

        if (currentFocusIdx !== null) {
          const target = currentWords[currentFocusIdx];
          const latestSpoken = spokenWords[spokenWords.length - 1] || "";
          
          let matchCount = 0;
          for (let i = 0; i < Math.min(target.length, latestSpoken.length); i++) {
            if (target[i] === latestSpoken[i]) {
              matchCount++;
            } else {
              break;
            }
          }
          setFocusedCharMatchCount(matchCount);

          const foundFullMatch = spokenWords.some(spoken => {
            const s = spoken.trim();
            const t = target.trim();
            return s === t || (s.length > 3 && t.includes(s)) || (t.length > 3 && s.includes(t));
          });

          if (foundFullMatch) {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
            setFocusedCharMatchCount(target.length);
            setIsolatedSuccessIndex(currentFocusIdx);
            setFocusedWordIndex(null);
            setIsWrong(false);
            if (recognitionRef.current) {
              try { recognitionRef.current.stop(); } catch(e) {}
            }
            setTimeout(() => {
              setIsolatedSuccessIndex(null);
              setFocusedCharMatchCount(0);
            }, 2000);
          }
          return;
        }
        
        setMatchedIndices(prev => {
          const next = new Set(prev);
          let targetIdx = next.size;
          spokenWords.forEach(spoken => {
            if (targetIdx < currentWords.length) {
              const target = currentWords[targetIdx];
              const isMatch = spoken === target || (spoken.length > 3 && target.includes(spoken)) || (target.length > 3 && spoken.includes(target));
              if (isMatch && !next.has(targetIdx)) {
                next.add(targetIdx);
                setLastMatchedIndex(targetIdx);
                targetIdx++;
                setTimeout(() => setLastMatchedIndex(null), 800);
              }
            }
          });
          return next;
        });
      };

      recognition.onstart = () => { setIsListening(true); setIsCompleted(false); setIsWrong(false); };
      recognition.onend = () => {
        setIsListening(false);
        if (focusedWordIndexRef.current !== null && isolatedSuccessIndexRef.current === null) triggerWrongFeedback();
        setFocusedWordIndex(null); setFocusedCharMatchCount(0);
      };
      recognition.onerror = (event: any) => {
        setIsListening(false); setFocusedWordIndex(null); setFocusedCharMatchCount(0);
        if (event.error !== 'no-speech' && event.error !== 'aborted') setError({ message: `Microphone issue: ${event.error}` });
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const handlePracticeFullSentence = async () => {
    if (isSpeaking) return;
    if (isListeningRef.current && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
      setIsListening(false);
      setTimeout(handlePracticeFullSentence, 100);
      return;
    }
    setFocusedWordIndex(null); setIsolatedSuccessIndex(null); setFocusedCharMatchCount(0);
    setIsListening(false); setIsCompleted(false); setIsWrong(false);
    setMatchedIndices(new Set()); setLastMatchedIndex(null); setError(null);
    setIsSpeaking(true);
    if (speechSafetyTimeoutRef.current) window.clearTimeout(speechSafetyTimeoutRef.current);
    speechSafetyTimeoutRef.current = window.setTimeout(() => { if (isSpeaking) setIsSpeaking(false); }, 10000);
    try {
      await speakText(currentSentence.text);
      if (speechSafetyTimeoutRef.current) window.clearTimeout(speechSafetyTimeoutRef.current);
      setIsSpeaking(false);
      setTimeout(() => {
        if (recognitionRef.current) {
          try { recognitionRef.current.start(); } catch (e) { setIsListening(true); }
        }
      }, 300);
    } catch (err: any) {
      if (speechSafetyTimeoutRef.current) window.clearTimeout(speechSafetyTimeoutRef.current);
      setIsSpeaking(false); setError({ message: "Audio system error." });
    }
  };

  const handleWordIsolatedPronounce = async (idx: number, word: string) => {
    if (isSpeaking) return;
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch(e) {} }
    setFocusedWordIndex(idx); setIsolatedSuccessIndex(null); setFocusedCharMatchCount(0);
    setLastMatchedIndex(null); setIsWrong(false); setIsSpeaking(true);
    try {
      await speakText(word);
      setIsSpeaking(false);
      if (recognitionRef.current) { try { recognitionRef.current.start(); } catch(e) { setIsListening(true); } }
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        if (focusedWordIndexRef.current === idx && !isolatedSuccessIndexRef.current) {
           if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch(e) {} }
        }
      }, 6000);
    } catch (err: any) { setIsSpeaking(false); setFocusedWordIndex(null); setError({ message: "Word audio error." }); }
  };

  const handleTopicClick = (index: number) => {
    setSelectedTopicIndex(index); setAppState(AppState.SELECTING_SENTENCE); setSelectedSentenceIndex(0);
    setMatchedIndices(new Set()); setIsCompleted(false); setIsWrong(false);
    setFocusedWordIndex(null); setIsolatedSuccessIndex(null); setError(null);
  };

  const getStatusText = () => {
    if (isSpeaking) return 'AI VOICE';
    if (isWrong) return 'WRONG';
    if (isListening) return focusedWordIndex !== null ? 'REPEAT' : 'LISTEN';
    if (isCompleted) return 'PERFECT!';
    return 'READY';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-y-auto pb-safe">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg">L</div>
          <div className="font-black text-lg tracking-tighter">LINGUIST.<span className="text-blue-600">AI</span></div>
        </div>
        <button onClick={() => setShowTranslation(!showTranslation)} className={`text-[9px] font-black px-3 py-2 rounded-lg border-2 transition-all ${showTranslation ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
          {showTranslation ? 'TRANSLATION: ON' : 'TRANSLATION: OFF'}
        </button>
      </nav>

      <main className="py-6 h-full flex flex-col">
        {appState === AppState.SELECTING_TOPIC && (
          <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map((topic, index) => (
              <div key={topic.id} onClick={() => handleTopicClick(index)} className="relative p-6 bg-white rounded-3xl border-2 border-transparent hover:border-blue-500 shadow-sm hover:shadow-xl transition-all text-left group h-full cursor-pointer active:scale-95">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-4xl group-hover:scale-110 transition-transform">{topic.icon}</div>
                </div>
                <h3 className="font-bold text-lg">{topic.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Refine your pronunciation</p>
              </div>
            ))}
          </div>
        )}

        {appState === AppState.SELECTING_SENTENCE && (
          <div className="max-w-5xl mx-auto p-4 w-full flex-1 flex flex-col items-start">
             <button onClick={() => setAppState(AppState.SELECTING_TOPIC)} className="mb-6 text-slate-400 hover:text-blue-600 flex items-center gap-2 font-black transition-colors text-xs active:scale-90">← BACK TO TOPICS</button>
             <div className="grid grid-cols-1 gap-2 w-full pb-64">
               {activeSentences.map((s, idx) => (
                 <button key={s.id} onClick={() => { setSelectedSentenceIndex(idx); setAppState(AppState.PRACTICING); setMatchedIndices(new Set()); setIsCompleted(false); setIsWrong(false); setFocusedWordIndex(null); setIsolatedSuccessIndex(null); setError(null); }} className="p-4 bg-white rounded-2xl border-2 border-transparent hover:border-blue-500 shadow-sm transition-all text-left flex justify-between items-center group active:scale-95">
                   <div className="flex-1">
                     <p className="font-black text-xl md:text-3xl leading-tight mb-1">{s.text}</p>
                     {showTranslation && <p className="text-slate-400 text-sm md:text-lg font-medium italic opacity-80">{s.translation}</p>}
                   </div>
                   <div className="ml-4 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                   </div>
                 </button>
               ))}
             </div>
          </div>
        )}

        {appState === AppState.PRACTICING && (
          <div className="max-w-4xl mx-auto p-4 w-full h-full flex flex-col items-center">
             <button onClick={() => { setAppState(AppState.SELECTING_SENTENCE); setMatchedIndices(new Set()); setIsCompleted(false); setIsWrong(false); setFocusedWordIndex(null); if(recognitionRef.current) { try { recognitionRef.current.stop(); } catch(e) {} } }} className="self-start mb-4 text-slate-400 hover:text-blue-600 flex items-center gap-2 font-bold transition-colors text-xs active:scale-90">← BACK TO LIST</button>
             
             <div className="bg-white rounded-[32px] p-6 pt-6 pb-24 shadow-2xl shadow-blue-100/50 border border-slate-100 text-center relative overflow-hidden w-full">
                <div className="mb-8 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full ${isSpeaking ? 'bg-blue-400 animate-pulse' : isWrong ? 'bg-red-500' : isListening ? 'bg-red-500 animate-pulse' : isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`}></span>
                    <span className={`text-lg md:text-2xl font-black tracking-[0.2em] uppercase transition-all ${isCompleted ? 'text-emerald-600' : isWrong ? 'text-red-600 animate-shake' : focusedWordIndex !== null ? 'text-amber-600' : 'text-slate-400'}`}>{getStatusText()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 mb-8">
                  {currentSentence.text.split(' ').map((word, idx) => {
                    const isMatched = matchedIndices.has(idx);
                    const isTarget = matchedIndices.size === idx && isListening && focusedWordIndex === null;
                    const isFocused = focusedWordIndex === idx;
                    const isIsolatedSuccess = isolatedSuccessIndex === idx;
                    const cleanWord = word.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
                    
                    return (
                      <div key={idx} onClick={() => isMobile ? handleWordIsolatedPronounce(idx, cleanWord) : null} onDoubleClick={() => !isMobile ? handleWordIsolatedPronounce(idx, cleanWord) : null} className={`relative px-1.5 py-0.5 text-2xl md:text-5xl font-black transition-all cursor-pointer select-none rounded-xl group ${isIsolatedSuccess ? 'word-isolated-success' : isMatched ? 'text-blue-600' : isTarget ? 'text-slate-900' : isFocused ? 'word-isolated-focus' : 'text-slate-300'} ${lastMatchedIndex === idx && !isIsolatedSuccess ? 'word-just-matched' : ''} ${isTarget ? 'word-target' : ''} hover:bg-slate-50 active:bg-blue-50`}>
                        {isFocused ? (
                          <span className="flex">{word.split('').map((char, charIdx) => <span key={charIdx} className={`transition-all duration-300 ${charIdx < focusedCharMatchCount ? 'char-matched' : 'text-slate-300 opacity-50'}`}>{char}</span>)}</span>
                        ) : word}
                        
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                           <span className="text-[7px] text-blue-400 font-bold tracking-widest uppercase">{isMobile ? 'Tap to repeat' : 'Double-click to repeat'}</span>
                        </div>
                        {isMatched && !isIsolatedSuccess && <div className="absolute -top-1 -right-0.5 w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm"></div>}
                      </div>
                    );
                  })}
                </div>

                <div className="mb-10">{showTranslation && <p className="text-sm md:text-lg text-slate-400 font-medium italic">"{currentSentence.translation}"</p>}</div>

                <div className="flex flex-col items-center gap-6">
                   <button onClick={handlePracticeFullSentence} disabled={isSpeaking} className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all active:scale-90 ${isSpeaking ? 'bg-slate-100 text-slate-300 scale-95' : isCompleted ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-xl scale-110' : isWrong ? 'bg-red-500 text-white shadow-red-200 shadow-xl scale-110' : focusedWordIndex !== null ? 'bg-amber-500 text-white animate-pulse shadow-amber-200 shadow-xl scale-110' : 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:scale-105'}`}>
                     {isSpeaking ? (
                       <div className="flex gap-1"><div className="w-2 h-8 bg-slate-300 rounded-full animate-bounce"></div><div className="w-2 h-8 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div><div className="w-2 h-8 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div></div>
                     ) : isCompleted ? (
                       <svg className="w-12 h-12 animate-[bounce_1s_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                     ) : (isWrong || focusedWordIndex !== null || isListening) ? (
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                     ) : (
                       <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                     )}
                   </button>
                   <p className={`font-black text-[10px] tracking-widest uppercase transition-colors ${isCompleted ? 'text-emerald-600' : isWrong ? 'text-red-600' : isListening ? 'text-red-500' : focusedWordIndex !== null ? 'text-amber-600' : 'text-slate-400'}`}>
                      {isCompleted ? 'PERFECT! TAP TO REPLAY' : isWrong ? 'TRY AGAIN' : isListening ? 'LISTENING... (TAP TO RESTART)' : focusedWordIndex !== null ? 'SAY IT NOW!' : 'TAP TO LISTEN & START'}
                   </p>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
