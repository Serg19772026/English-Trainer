
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// --- TYPES ---
export interface Sentence {
  id: string;
  text: string;
  translation: string;
}

export interface Topic {
  id: string;
  title: string;
  icon: string;
  sentences: Sentence[];
}

export enum AppState {
  SELECTING_TOPIC = 'SELECTING_TOPIC',
  SELECTING_SENTENCE = 'SELECTING_SENTENCE',
  PRACTICING = 'PRACTICING'
}

// --- CONSTANTS ---
const TOPICS: Topic[] = [
  {
    id: 'travel', title: 'Travel', icon: '✈️',
    sentences: [
      { id: 't1', text: 'Where is the nearest train station?', translation: 'Где ближайший вокзал?' },
      { id: 't2', text: 'I would like to book a room.', translation: 'Я хотел бы забронировать номер.' },
      { id: 't3', text: 'How much does a taxi cost?', translation: 'Сколько стоит такси?' }
    ]
  },
  {
    id: 'food', title: 'Food', icon: '🍕',
    sentences: [
      { id: 'f1', text: 'Can I see the menu, please?', translation: 'Можно меню, пожалуйста?' },
      { id: 'f2', text: 'The food was delicious.', translation: 'Еда была вкусной.' },
      { id: 'f3', text: 'Check please, we are ready.', translation: 'Счет, пожалуйста, мы готовы.' }
    ]
  },
  {
    id: 'work', title: 'Work', icon: '💼',
    sentences: [
      { id: 'w1', text: 'Let’s schedule a meeting.', translation: 'Давайте запланируем встречу.' },
      { id: 'w2', text: 'I need to finish this report.', translation: 'Мне нужно закончить отчет.' }
    ]
  }
];

// --- SERVICE ---
const speakText = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) return reject('No TTS support');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    window.speechSynthesis.speak(utterance);
  });
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SELECTING_TOPIC);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [matchedIndices, setMatchedIndices] = useState(new Set<number>());
  const [lastMatchedIndex, setLastMatchedIndex] = useState<number | null>(null);
  const [focusedWordIndex, setFocusedWordIndex] = useState<number | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);

  const recognitionRef = useRef<any>(null);
  const currentTopic = TOPICS[selectedTopicIndex];
  const currentSentence = currentTopic.sentences[selectedSentenceIndex];
  const sentenceWords = useMemo(() => 
    currentSentence.text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").split(/\s+/),
    [currentSentence]
  );

  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        const spokenWords = transcript.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").split(/\s+/);
        
        setMatchedIndices(prev => {
          const next = new Set(prev);
          let targetIdx = next.size;
          spokenWords.forEach(word => {
            if (targetIdx < sentenceWords.length && (word === sentenceWords[targetIdx] || (word.length > 3 && sentenceWords[targetIdx].includes(word)))) {
              next.add(targetIdx);
              setLastMatchedIndex(targetIdx);
              targetIdx++;
            }
          });
          return next;
        });
      };

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, [sentenceWords]);

  useEffect(() => {
    if (matchedIndices.size > 0 && matchedIndices.size === sentenceWords.length) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsCompleted(true);
    }
  }, [matchedIndices, sentenceWords]);

  const handleStartPractice = async () => {
    setMatchedIndices(new Set());
    setIsCompleted(false);
    setIsSpeaking(true);
    try {
      await speakText(currentSentence.text);
      setIsSpeaking(false);
      if (recognitionRef.current) recognitionRef.current.start();
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  const handleTopicSelect = (idx: number) => {
    setSelectedTopicIndex(idx);
    setAppState(AppState.SELECTING_SENTENCE);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center max-w-lg mx-auto">
      <nav className="w-full flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-blue-600">LINGUIST.AI</h1>
        <button onClick={() => setShowTranslation(!showTranslation)} className="text-[10px] bg-white border p-2 rounded-lg font-bold">
          {showTranslation ? 'RU: ON' : 'RU: OFF'}
        </button>
      </nav>

      {appState === AppState.SELECTING_TOPIC && (
        <div className="w-full grid gap-4">
          {TOPICS.map((t, i) => (
            <div key={t.id} onClick={() => handleTopicSelect(i)} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all">
              <span className="text-3xl">{t.icon}</span>
              <h2 className="text-xl font-bold mt-2">{t.title}</h2>
            </div>
          ))}
        </div>
      )}

      {appState === AppState.SELECTING_SENTENCE && (
        <div className="w-full">
          <button onClick={() => setAppState(AppState.SELECTING_TOPIC)} className="text-slate-400 text-xs font-bold mb-4">← BACK</button>
          <div className="grid gap-2">
            {currentTopic.sentences.map((s, i) => (
              <div key={s.id} onClick={() => { setSelectedSentenceIndex(i); setAppState(AppState.PRACTICING); setMatchedIndices(new Set()); setIsCompleted(false); }} className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:bg-blue-50">
                <p className="font-bold text-lg">{s.text}</p>
                {showTranslation && <p className="text-slate-400 text-sm italic">{s.translation}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {appState === AppState.PRACTICING && (
        <div className="w-full text-center flex flex-col items-center">
          <button onClick={() => setAppState(AppState.SELECTING_SENTENCE)} className="self-start text-slate-400 text-xs font-bold mb-8">← BACK</button>
          
          <div className="mb-4">
            <span className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest ${isListening ? 'bg-red-100 text-red-600' : isCompleted ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
              {isSpeaking ? 'AI SPEAKING' : isListening ? 'LISTENING' : isCompleted ? 'PERFECT' : 'READY'}
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {currentSentence.text.split(' ').map((word, i) => (
              <span key={i} className={`text-3xl font-black transition-all ${matchedIndices.has(i) ? 'text-blue-600 word-just-matched' : 'text-slate-200'}`}>
                {word}
              </span>
            ))}
          </div>

          {showTranslation && <p className="text-slate-400 italic mb-12">"{currentSentence.translation}"</p>}

          <button 
            onClick={handleStartPractice}
            disabled={isSpeaking}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white transition-all ${isSpeaking ? 'bg-slate-200' : isListening ? 'bg-red-500 scale-110 shadow-xl' : isCompleted ? 'bg-green-500' : 'bg-blue-600 shadow-lg active:scale-90'}`}
          >
            {isSpeaking ? '...' : (
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            )}
          </button>
          <p className="mt-4 text-[10px] font-bold text-slate-400">TAP TO START PRACTICE</p>
        </div>
      )}
    </div>
  );
};

// --- MOUNTING ---
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
