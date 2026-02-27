import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  Play, 
  Maximize, 
  Download, 
  Users, 
  X, 
  Settings2, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Target, 
  Lock, 
  Eye, 
  MousePointer2 
} from 'lucide-react';

/**
 * Exodus Hack-Jam Team Randomizer - Mystery Selection Edition (v4.2)
 * Logic: Ensures "SYNTAX" and "Techmates" stay together.
 * Interaction: Teams choose from 4 mystery boxes.
 * Styling: Hardened CSS fallbacks for local environments without Tailwind active.
 */

const CONFETTI_SCRIPT = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
const HTML2CANVAS_SCRIPT = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

const DEFAULT_TEAMS = [
  "SYNTAX", "Techmates", "Trignometry",
"Innovates",
"Creatorzz",
"Stuart little",
"Nexa",
"WARRIORS",
"Team crazyz",
"Trinity",
"Fets Luck",
"DeShaNo",
"Luna",
"TM_AMF",
"DAOS",
"Vortex"
];

const COLORS = {
  primary: "#C40000",
  secondary: "#F5E6C8",
  accent: "#1A1A1A",
  blackTrans: "rgba(0, 0, 0, 0.4)",
  whiteTrans: "rgba(255, 255, 255, 0.1)"
};

const App = () => {
  const [teamsInput, setTeamsInput] = useState(DEFAULT_TEAMS.join('\n'));
  const [teamAssignments, setTeamAssignments] = useState({}); 
  const [revealedTeams, setRevealedTeams] = useState(new Set());
  const [viewMode, setViewMode] = useState('setup'); 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState("");
  const [shuffledTeamList, setShuffledTeamList] = useState([]);
  const [currentlySelectingTeam, setCurrentlySelectingTeam] = useState(null);
  const [isRevealing, setIsRevealing] = useState(false);

  const resultsRef = useRef(null);

  useEffect(() => {
    const scripts = [CONFETTI_SCRIPT, HTML2CANVAS_SCRIPT];
    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    });
  }, []);

  const calculateGroups = (list) => {
    let pool = [...list].sort(() => Math.random() - 0.5);
    const pairNames = ["syntax", "techmates"];
    const actualPair = pool.filter(t => pairNames.includes(t.toLowerCase()));
    const others = pool.filter(t => !pairNames.includes(t.toLowerCase()));

    let groups = [[], [], [], []];
    const pairGrpIdx = Math.floor(Math.random() * 4);
    
    if (actualPair.length === 2) {
      groups[pairGrpIdx].push(...actualPair);
      groups[pairGrpIdx].push(others.pop(), others.pop());
      for (let i = 0; i < 4; i++) {
        if (i === pairGrpIdx) continue;
        groups[i] = [others.pop(), others.pop(), others.pop(), others.pop()];
      }
    } else {
      for (let i = 0; i < 4; i++) groups[i] = pool.splice(0, 4);
    }

    const mapping = {};
    groups.forEach((group, gIdx) => {
      group.forEach(team => { mapping[team] = gIdx; });
    });
    return { mapping };
  };

  const startMysteryReveal = () => {
    const list = teamsInput.split('\n').map(t => t.trim()).filter(t => t !== "");
    if (list.length !== 16) {
      setError(`Exactly 16 teams required. Currently: ${list.length}`);
      return;
    }
    setError("");
    const { mapping } = calculateGroups(list);
    setTeamAssignments(mapping);
    setShuffledTeamList(list.sort(() => Math.random() - 0.5));
    setRevealedTeams(new Set());
    setCurrentlySelectingTeam(null);
    setViewMode('reveal');
  };

  const handleChooseGroup = (selectionIdx) => {
    if (!currentlySelectingTeam || isRevealing) return;
    
    setIsRevealing(true);
    
    setTimeout(() => {
      const teamName = currentlySelectingTeam;
      const newRevealed = new Set(revealedTeams);
      newRevealed.add(teamName);
      setRevealedTeams(newRevealed);
      setIsRevealing(false);
      setCurrentlySelectingTeam(null);

      if (newRevealed.size === 16) {
        setTimeout(() => {
          setViewMode('results');
          triggerConfetti();
        }, 800);
      }
    }, 1200);
  };

  const triggerConfetti = () => {
    if (window.confetti) {
      window.confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: [COLORS.primary, COLORS.secondary, '#000000']
      });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const quickGenerate = () => {
    const list = teamsInput.split('\n').map(t => t.trim()).filter(t => t !== "");
    if (list.length !== 16) {
      setError(`Exactly 16 teams required. Currently: ${list.length}`);
      return;
    }
    const { mapping } = calculateGroups(list);
    setTeamAssignments(mapping);
    setRevealedTeams(new Set(list));
    setViewMode('results');
    triggerConfetti();
  };

  const getGroupLetter = (team) => String.fromCharCode(65 + teamAssignments[team]);

  return (
    <div className="app-container" style={{ backgroundColor: COLORS.primary, color: COLORS.secondary, minHeight: '100-vh' }}>
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <header className="main-header">
        <div className="badge">EXODUS Hack-Jam 2026</div>
        <h1 className="main-title">
          GROUP <span style={{ color: '#000' }}>CHALLENGE</span>
        </h1>
      </header>

      <main className="main-content">
        {viewMode === 'setup' && (
          <div className="card setup-card animate-slide-up">
            <div className="card-header">
              <div className="icon-box">
                <Users size={32} strokeWidth={2.5} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h2 className="section-title">The Roster</h2>
                <p className="subtitle">16 Competitors Required</p>
              </div>
            </div>

            <textarea
              value={teamsInput}
              onChange={(e) => setTeamsInput(e.target.value)}
              className="team-textarea"
              placeholder="Paste team names here..."
            />

            {error && (
              <div className="error-box">
                <AlertCircle size={24} />
                <span>{error}</span>
              </div>
            )}

            <div className="button-grid">
              <button onClick={quickGenerate} className="btn btn-secondary-outline">
                <Zap className="btn-icon" size={24} />
                <span>Instant Result</span>
              </button>
              <button onClick={startMysteryReveal} className="btn btn-primary">
                <Target className="btn-icon" size={24} />
                <span>Interactive Selection</span>
              </button>
            </div>
          </div>
        )}

        {viewMode === 'reveal' && (
          <div className="animate-fade-in">
            {currentlySelectingTeam && (
              <div className="modal-overlay animate-fade-in">
                <div className="modal-content animate-zoom-in">
                  <h3 className="modal-small-title">Team Selection</h3>
                  <div className="team-reveal-name">
                    {currentlySelectingTeam}
                  </div>
                  
                  <p className="modal-prompt">
                    {isRevealing ? 'Revealing Destiny...' : 'Choose your mystery group box:'}
                  </p>
                  
                  <div className="mystery-box-grid">
                    {[0, 1, 2, 3].map((idx) => (
                      <button
                        key={idx}
                        disabled={isRevealing}
                        onClick={() => handleChooseGroup(idx)}
                        className={`mystery-box ${isRevealing ? 'box-loading' : ''}`}
                      >
                        <div className="mystery-question">?</div>
                      </button>
                    ))}
                  </div>
                  
                  {!isRevealing && (
                    <button onClick={() => setCurrentlySelectingTeam(null)} className="btn-cancel">
                      Cancel Selection
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="reveal-header">
              <h2 className="reveal-title">Select a team to reveal their group</h2>
              <div className="status-pills">
                 <div className="pill">
                    <Lock size={14} /> Synced Protocol: Active
                 </div>
                 <div className="pill">
                    <Target size={14} /> {revealedTeams.size} / 16 Teams Assigned
                 </div>
              </div>
            </div>

            <div className="team-grid">
              {shuffledTeamList.map((team, idx) => {
                const isRevealed = revealedTeams.has(team);
                const isPair = ["syntax", "techmates"].includes(team.toLowerCase());
                
                return (
                  <button
                    key={idx}
                    disabled={isRevealed}
                    onClick={() => setCurrentlySelectingTeam(team)}
                    className={`team-card ${isRevealed ? 'team-revealed' : 'team-unrevealed'}`}
                  >
                    {isRevealed ? (
                      <>
                        <div className="assigned-tag">Group</div>
                        <div className="group-letter">{getGroupLetter(team)}</div>
                        <div className="team-name-small">{team}</div>
                      </>
                    ) : (
                      <>
                        <div className="team-icon">
                            <MousePointer2 size={20} />
                          </div>
                        <span className="team-name-label">{team}</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === 'results' && (
          <div className="animate-slide-up">
             <div className="results-header">
               <div style={{ textAlign: 'left' }}>
                 <h2 className="final-title">FINAL DRAW</h2>
                 <p className="final-subtitle">Competition Phase Ready</p>
               </div>
               <div className="action-btns">
                  <button onClick={toggleFullscreen} className="icon-btn"><Maximize size={24}/></button>
                  <button onClick={() => setViewMode('setup')} className="btn btn-primary reset-btn">
                    <RotateCcw size={20} /> New Draft
                  </button>
               </div>
             </div>

             <div ref={resultsRef} className="final-grid">
               {[0, 1, 2, 3].map((idx) => (
                 <div key={idx} className="group-card">
                    <div className="group-card-header">
                       <span className="section-label">Section</span>
                       <h3 className="section-letter">{String.fromCharCode(65 + idx)}</h3>
                    </div>
                    <div className="team-list">
                      {Object.entries(teamAssignments)
                        .filter(([_, gIdx]) => gIdx === idx)
                        .map(([team, _], tIdx) => (
                          <div key={tIdx} className="team-entry">
                            <div className="rank-badge">{tIdx + 1}</div>
                            <div className="entry-name">{team}</div>
                          </div>
                      ))}
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </main>

      <footer className="main-footer">
         <div className="footer-info">
             <div className="footer-brand">Exodus Hack-Jam</div>
             <div className="footer-version">Selection System v4.2</div>
         </div>
         <div className="footer-labels">
             <span>Mystery Reveal</span>
             <span>Pair Sync: Active</span>
         </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

        :root {
          --primary: ${COLORS.primary};
          --secondary: ${COLORS.secondary};
        }

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background: var(--primary);
          color: var(--secondary);
        }

        .app-container {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          padding-bottom: 50px;
        }

        .blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          background: var(--secondary);
          opacity: 0.1;
        }

        .blob-1 { top: -10%; left: -5%; width: 40vw; height: 40vw; animation: pulse 10s infinite; }
        .blob-2 { bottom: -10%; right: -5%; width: 50vw; height: 50vw; opacity: 0.05; }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.15; }
        }

        .main-header {
          position: relative;
          z-index: 10;
          padding: 48px 24px 32px;
          text-align: center;
        }

        .badge {
          display: inline-block;
          padding: 8px 24px;
          border: 2px solid var(--secondary);
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          background: rgba(0,0,0,0.2);
          margin-bottom: 16px;
        }

        .main-title {
          font-size: 5rem;
          font-weight: 900;
          font-style: italic;
          text-transform: uppercase;
          line-height: 0.9;
          margin: 0;
          letter-spacing: -2px;
        }

        @media (max-width: 768px) {
          .main-title { font-size: 3rem; }
        }

        .main-content {
          position: relative;
          z-index: 10;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .card {
          background: rgba(0,0,0,0.2);
          backdrop-filter: blur(10px);
          border-radius: 40px;
          padding: 40px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }

        .setup-card { max-width: 800px; margin: 0 auto; }

        .card-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }

        .icon-box {
          padding: 16px;
          background: var(--secondary);
          color: var(--primary);
          border-radius: 16px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
        }

        .section-title { font-size: 28px; font-weight: 900; text-transform: uppercase; font-style: italic; margin: 0; }
        .subtitle { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6; margin: 4px 0 0; }

        .team-textarea {
          width: 100%;
          height: 320px;
          background: rgba(0,0,0,0.4);
          border: 2px solid rgba(245, 230, 200, 0.2);
          border-radius: 24px;
          padding: 32px;
          font-size: 20px;
          color: var(--secondary);
          font-family: monospace;
          resize: none;
          box-sizing: border-box;
          margin-bottom: 24px;
          transition: border-color 0.3s;
        }

        .team-textarea:focus { outline: none; border-color: var(--secondary); }

        .error-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          background: rgba(0,0,0,0.6);
          border-left: 4px solid #ef4444;
          color: #f87171;
          border-radius: 12px;
          margin-bottom: 32px;
          font-weight: 700;
          animation: shake 0.5s;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .button-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 640px) { .button-grid { grid-template-columns: 1fr; } }

        .btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          border-radius: 24px;
          font-size: 18px;
          font-weight: 900;
          text-transform: uppercase;
          font-style: italic;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
        }

        .btn-primary { background: var(--secondary); color: var(--primary); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.4); }
        .btn-secondary-outline { background: rgba(0,0,0,0.4); color: var(--secondary); border: 2px solid rgba(255,255,255,0.1); }
        .btn:hover { transform: translateY(-4px); }
        .btn:active { transform: scale(0.95); }

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(0,0,0,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .modal-content { max-width: 900px; width: 100%; text-align: center; }
        .modal-small-title { font-size: 20px; font-weight: 700; text-transform: uppercase; opacity: 0.6; margin-bottom: 8px; }
        .team-reveal-name { font-size: 5rem; font-weight: 900; font-style: italic; text-transform: uppercase; color: var(--secondary); margin-bottom: 40px; line-height: 1; }
        .modal-prompt { font-size: 20px; font-weight: 700; font-style: italic; text-transform: uppercase; opacity: 0.8; margin-bottom: 32px; }

        .mystery-box-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        @media (max-width: 640px) { .mystery-box-grid { grid-template-columns: 1fr 1fr; } }

        .mystery-box {
          height: 180px;
          background: rgba(245, 230, 200, 0.1);
          border: 2px solid rgba(245, 230, 200, 0.3);
          border-radius: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .mystery-box:hover { background: var(--secondary); transform: scale(1.05); }
        .mystery-question { font-size: 60px; font-weight: 900; font-style: italic; color: var(--secondary); transition: color 0.3s; }
        .mystery-box:hover .mystery-question { color: var(--primary); }
        .box-loading { opacity: 0.3; pointer-events: none; }

        .btn-cancel {
          background: none;
          border: none;
          color: var(--secondary);
          opacity: 0.4;
          font-weight: 900;
          text-transform: uppercase;
          margin-top: 48px;
          cursor: pointer;
          letter-spacing: 2px;
        }

        .reveal-header { text-align: center; margin-bottom: 48px; }
        .reveal-title { font-size: 32px; font-weight: 900; font-style: italic; text-transform: uppercase; opacity: 0.8; margin-bottom: 16px; }
        .status-pills { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; }
        .pill { padding: 8px 16px; background: rgba(0,0,0,0.2); border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.05); }

        .team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        @media (max-width: 1024px) { .team-grid { grid-template-columns: repeat(2, 1fr); } }

        .team-card {
          height: 180px;
          border-radius: 32px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: none;
        }

        .team-unrevealed { background: rgba(0,0,0,0.4); border: 2px solid rgba(245, 230, 200, 0.2); }
        .team-unrevealed:hover { border-color: var(--secondary); transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); }
        .team-revealed { background: var(--secondary); transform: scale(0.95); opacity: 0.6; }

        .team-name-label { font-size: 18px; font-weight: 900; text-transform: uppercase; color: var(--secondary); text-align: center; }
        .group-letter { font-size: 72px; font-weight: 900; font-style: italic; color: var(--primary); line-height: 1; }
        .assigned-tag { font-size: 10px; font-weight: 900; text-transform: uppercase; color: rgba(0,0,0,0.4); }
        .team-name-small { font-size: 10px; font-weight: 700; text-transform: uppercase; color: rgba(0,0,0,0.3); margin-top: 8px; }

        .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 48px; }
        .final-title { font-size: 4rem; font-weight: 900; font-style: italic; margin: 0; line-height: 1; }
        .final-subtitle { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 4px; opacity: 0.5; margin-top: 8px; }

        .action-btns { display: flex; gap: 16px; }
        .icon-btn { width: 64px; height: 64px; background: #000; color: var(--secondary); border-radius: 20px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .reset-btn { padding: 0 32px; flex-direction: row; gap: 12px; height: 64px; }

        .final-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
        @media (max-width: 1024px) { .final-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .final-grid { grid-template-columns: 1fr; } }

        .group-card {
          background: var(--secondary);
          border-radius: 40px;
          padding: 40px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          border-bottom: 12px solid rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }

        .group-card:hover { transform: translateY(-8px); }
        .group-card-header { text-align: center; margin-bottom: 40px; }
        .section-label { font-size: 12px; font-weight: 900; text-transform: uppercase; opacity: 0.3; letter-spacing: 2px; }
        .section-letter { font-size: 80px; font-weight: 900; font-style: italic; color: var(--primary); margin: -8px 0 0; }

        .team-list { display: flex; flex-direction: column; gap: 16px; }
        .team-entry { display: flex; align-items: center; gap: 16px; background: #fff; padding: 16px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .rank-badge { width: 40px; height: 40px; background: var(--primary); color: #fff; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-style: italic; }
        .entry-name { font-size: 14px; font-weight: 900; text-transform: uppercase; color: #000; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .main-footer { padding: 48px 24px; border-top: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2); margin-top: 80px; display: flex; justify-content: space-between; align-items: center; opacity: 0.4; }
        .footer-brand { font-size: 20px; font-weight: 900; font-style: italic; text-transform: uppercase; }
        .footer-version { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .footer-labels { display: flex; gap: 32px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; }

        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-zoom-in { animation: zoomIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}} />
    </div>
  );
};

export default App;
