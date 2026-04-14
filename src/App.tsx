/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, ArrowLeft, RotateCcw, ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { QUESTIONS, RESULTS } from './constants';
import { Score, MBTIType } from './types';

type Screen = 'start' | 'test' | 'result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selections, setSelections] = useState<(number | null)[]>(new Array(QUESTIONS.length).fill(null));
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      if (!isMuted) {
        audioRef.current.play().catch(err => console.log("Autoplay blocked:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted]);

  const toggleMute = () => setIsMuted(!isMuted);

  const startTest = () => {
    setSelections(new Array(QUESTIONS.length).fill(null));
    setCurrentQuestion(0);
    setScreen('test');
  };

  const selectOption = (index: number) => {
    const newSelections = [...selections];
    newSelections[currentQuestion] = index;
    setSelections(newSelections);

    // Auto-advance after a short delay for visual feedback
    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setScreen('result');
      }
    }, 400);
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resultType = useMemo(() => {
    if (screen !== 'result') return 'INFP';
    const scores: Score = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    selections.forEach((choiceIndex, qIndex) => {
      if (choiceIndex === null) return;
      const score = QUESTIONS[qIndex].options[choiceIndex].score;
      (Object.keys(score) as (keyof Score)[]).forEach(key => {
        scores[key] = (scores[key] || 0) + (score[key] || 0);
      });
    });

    const mbti = 
      ((scores.E || 0) >= (scores.I || 0) ? 'E' : 'I') +
      ((scores.N || 0) >= (scores.S || 0) ? 'N' : 'S') +
      ((scores.F || 0) >= (scores.T || 0) ? 'F' : 'T') +
      ((scores.P || 0) >= (scores.J || 0) ? 'P' : 'J');
    
    return mbti as MBTIType;
  }, [selections, screen]);

  const resultData = RESULTS[resultType] || RESULTS['INFP'];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <svg className="fixed bottom-[-50px] right-[-50px] opacity-10 pointer-events-none text-black" width="400" height="400" viewBox="0 0 100 100">
        <path d="M50 0 C70 30 90 40 100 100 C40 90 30 70 0 50 C30 50 40 30 50 0" fill="currentColor"/>
      </svg>

      <div className="max-w-xl w-full glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {/* Audio Control */}
        <button 
          onClick={toggleMute}
          className="absolute top-8 right-8 z-50 p-2 text-accent-silver/50 hover:text-white transition-colors"
          title={isMuted ? "开启音乐" : "关闭音乐"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
        </button>

        <audio 
          ref={audioRef}
          src="/bgm.mp3" 
          loop 
          autoPlay
        />

        <AnimatePresence mode="wait">
          {screen === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h1 className="text-6xl font-black mb-6 tracking-[0.2em] text-white">WJTI</h1>
              <div className="h-1 w-12 bg-accent-golden mx-auto mb-10" />
              <div className="space-y-2 mb-12 text-accent-golden/80 text-base font-light">
                <p className="leading-[30px]">Mesdames et messieurs</p>
                <p className="leading-[30px]">Bienvenus à cette soirée de charme et d’enchantement</p>
                <p className="mt-2 leading-[30px]">女士们 先生们</p>
                <p className="leading-[30px]">欢迎来到这个充满魅力和欢乐的夜晚</p>
                <p className="pt-4 italic text-[#c2bbbb] text-sm tracking-widest leading-[35px]">在尚雯婕的歌声里，妳最念念不忘的是？</p>
              </div>
              <button 
                onClick={startTest}
                className="group relative px-10 py-4 border border-white/20 text-white rounded-full hover:bg-white hover:text-bg-dark transition-all duration-500 tracking-[0.3em] text-sm uppercase overflow-hidden"
              >
                <span className="relative z-10">请开启“异类”之旅</span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </motion.div>
          )}

          {screen === 'test' && (
            <motion.div
              key="test"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] text-accent-silver tracking-[0.3em] uppercase font-medium">
                    Sequence {String(currentQuestion + 1).padStart(2, '0')} / {QUESTIONS.length}
                  </span>
                </div>
                <div className="h-[1px] w-full bg-white/10 overflow-hidden">
                  <motion.div 
                    className="h-full bg-accent-golden"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold mb-12 text-white leading-relaxed font-serif">
                {QUESTIONS[currentQuestion].text}
              </h2>

              <div className="space-y-4 mb-12">
                {QUESTIONS[currentQuestion].options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => selectOption(idx)}
                    className={`option-card w-full p-6 text-left text-sm tracking-wide rounded-2xl ${selections[currentQuestion] === idx ? 'selected' : ''}`}
                  >
                    {option.text}
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-start items-center pt-8 border-t border-white/5">
                <button 
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-accent-silver hover:text-white transition-all uppercase disabled:opacity-0"
                >
                  <ArrowLeft size={12} />
                  Prev / 上一题
                </button>
              </div>
            </motion.div>
          )}

          {screen === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <span className="text-accent-silver text-[10px] tracking-[0.5em] block mb-6 uppercase">— 异类剪影 —</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 font-serif tracking-tight mx-auto leading-tight">
                {(() => {
                  const bilingualRegex = /^(《[a-zA-Z\s']+)([\u4e00-\u9fa5]+》)$/;
                  const match = resultData.title.match(bilingualRegex);
                  if (match) {
                    return (
                      <>
                        {match[1]}
                        <br />
                        {match[2]}
                      </>
                    );
                  }
                  return <span className="whitespace-nowrap md:whitespace-normal">{resultData.title}</span>;
                })()}
              </h2>
              
              <div className="text-accent-golden italic text-sm mb-10 tracking-widest font-light text-balance mx-auto max-w-[85%] leading-relaxed">
                {resultData.quote}
              </div>
              
              <div className="text-stone-300 leading-loose mb-12 text-base text-left px-6 border-l-2 border-accent-golden font-light">
                {resultData.desc}
              </div>
              
              <div className="flex flex-col gap-6 items-center">
                <a 
                  href={resultData.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-3 border border-white/10 text-accent-silver rounded-full hover:border-white hover:text-white transition-all duration-300 text-[10px] tracking-[0.2em] uppercase group"
                >
                  <Music size={14} className="group-hover:animate-pulse" />
                  在QQ音乐打开
                  <ExternalLink size={12} />
                </a>

                <button 
                  onClick={() => setScreen('start')}
                  className="flex items-center gap-2 text-[10px] text-stone-500 hover:text-white transition-colors tracking-[0.3em] uppercase group"
                >
                  <RotateCcw size={12} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
                  再次开启 / Re-Start
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
