'use client'; // Required for Next.js projects

import React, { useState, useEffect } from 'react';
import { Play, Info, CheckCircle, AlertCircle, Zap, Cpu, HardDrive, Fan, Battery, ChevronLeft, ChevronRight, File } from 'lucide-react';

const AcerHardwareExplorer = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [currentTask, setCurrentTask] = useState(0);
  const [code, setCode] = useState('');
  const [userName, setUserName] = useState('');
  const [tempName, setTempName] = useState('');
  const [fanSpeed, setFanSpeed] = useState(0);
  const [fanRotation, setFanRotation] = useState(0);
  const [screenText, setScreenText] = useState('');
  
  // Visual State
  const [ramData, setRamData] = useState([]); 
  const [storedFiles, setStoredFiles] = useState([]);
  const [bitFlow, setBitFlow] = useState([]);
  const [powerFlow, setPowerFlow] = useState(false); 
  const [powerSurge, setPowerSurge] = useState(false); 
  const [cpuPulse, setCpuPulse] = useState(0); 
  const [cpuOpType, setCpuOpType] = useState('IDLE'); 
  const [taskComplete, setTaskComplete] = useState(Array(7).fill(false));
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Keyboard keys for Task 3
  const keyboardKeys = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'SPACE'
  ];

  const components = {
    cpu: { id: 'cpu', icon: Cpu, name: 'CPU (Processor)', desc: 'The brain. Processes instructions at GHz speeds.', x: 20, y: 25, color: 'text-blue-600', bg: 'bg-blue-100', glow: 'shadow-blue-500/50' },
    ram: { id: 'ram', icon: Zap, name: 'RAM (Memory)', desc: 'Volatile memory. Fast access (nanoseconds).', x: 50, y: 25, color: 'text-yellow-600', bg: 'bg-yellow-100', glow: 'shadow-yellow-500/50' },
    storage: { id: 'storage', icon: HardDrive, name: 'SSD Storage', desc: 'Non-volatile. Retains data without power.', x: 80, y: 25, color: 'text-emerald-600', bg: 'bg-emerald-100', glow: 'shadow-emerald-500/50' },
    fan: { id: 'fan', icon: Fan, name: 'Cooling Fan', desc: 'Prevents thermal throttling via convection.', x: 20, y: 75, color: 'text-gray-600', bg: 'bg-gray-100', glow: 'shadow-gray-500/50' },
    battery: { id: 'battery', icon: Battery, name: 'Battery', desc: 'Powers the system when unplugged.', x: 80, y: 75, color: 'text-rose-600', bg: 'bg-rose-100', glow: 'shadow-rose-500/50' }
  };

  const cpuColors = {
    'ADD': 'border-green-500 shadow-green-500/50',
    'SUB': 'border-red-500 shadow-red-500/50',
    'MUL': 'border-purple-500 shadow-purple-500/50',
    'DIV': 'border-orange-500 shadow-orange-500/50',
    'IDLE': 'border-blue-500'
  };

  const triggerCpuCycles = (totalCycles, operation) => {
    let count = 0;
    setCpuOpType(operation || 'ADD');
    const interval = setInterval(() => {
      count++;
      setCpuPulse(count);
      setTimeout(() => setCpuPulse(0), 400); 
      if (count >= totalCycles) {
        clearInterval(interval);
        setTimeout(() => setCpuOpType('IDLE'), 1000);
      }
    }, 800);
  };

  const animateBitFlow = (startX, startY, endX, endY) => {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const bit = {
          id: Date.now() + i,
          x: startX,
          y: startY,
          targetX: endX,
          targetY: endY,
          progress: 0,
          value: Math.random() > 0.5 ? '1' : '0'
        };
        setBitFlow(prev => [...prev, bit]);
      }, i * 100);
    }
  };

  const getTaskConfig = () => {
    return [
      {
        title: 'Task 1: Initialize Power System',
        instruction: 'The system is dark. Initialize the battery to supply voltage to the motherboard. Type: battery.powerOn()',
        hint: 'Call battery.powerOn() to enable the power distribution system.',
        check: (c) => {
          if (c.includes('battery.powerOn')) {
            setPowerFlow(true);
            setPowerSurge(true);
            setTimeout(() => setPowerSurge(false), 2500);
            return true;
          }
          return false;
        }
      },
      {
        title: 'Task 2: Thermal Management',
        instruction: 'CPU Heat Load: 24 Watts. Fan Efficiency: 0.008 Watts removed per RPM. Calculate the required RPM (Heat / Efficiency). Type: fan.start(speed=YOUR CALCULATED SPEED)',
        hint: 'Calculation: 24 ÷ 0.008 = 3000 RPM. Type: fan.start(speed=3000)',
        check: (c) => {
          const match = c.match(/fan\.start\(\s*speed\s*=\s*(\d+)\s*\)/);
          if (match) {
            const speed = parseInt(match[1]);
            // Allow a small margin of error or exact match
            if (speed >= 3000 && speed <= 3050) {
              setFanSpeed(speed);
              return true;
            }
          }
          return false;
        }
      },
      {
        title: 'Task 3: User Authentication',
        instruction: 'Type your name using the virtual keyboard, then click ENTER to authenticate.',
        hint: 'Use the on-screen keyboard below the motherboard visualization.',
        check: () => userName.length > 0
      },
      {
        title: 'Task 4: Multi-Channel Memory',
        instruction: 'Store data in RAM. You can store multiple items by using different hexadecimal addresses (e.g., 0xA1, 0xB2). Try: ram.store("DATA", 0xA1)',
        hint: 'ram.store("HELLO", 0xA1) then run ram.store("WORLD", 0xB2)',
        check: (c) => {
          const match = c.match(/ram\.store\(\s*"([^"]+)"\s*,\s*0x([0-9A-Fa-f]+)\s*\)/);
          if (match) {
            const val = match[1];
            const addr = '0x' + match[2].toUpperCase();
            
            setRamData(prev => {
              const filtered = prev.filter(item => item.address !== addr);
              return [...filtered, { text: val, address: addr }];
            });
            return true;
          }
          return false;
        }
      },
      {
        title: 'Task 5: CPU Instruction Set',
        instruction: 'Perform an operation. Supported ops: "ADD", "SUB", "MUL", "DIV". Execute: cpu.execute("MUL", cycles=3)',
        hint: 'cpu.execute("ADD", cycles=3) or cpu.execute("SUB", cycles=2)',
        check: (c) => {
          const match = c.match(/cpu\.execute\(\s*"([^"]+)"\s*,\s*cycles\s*=\s*(\d+)\s*\)/);
          if (match) {
            const op = match[1].toUpperCase();
            const cycles = parseInt(match[2]);
            const allowedOps = ['ADD', 'SUB', 'MUL', 'DIV'];
            
            if (allowedOps.includes(op) && cycles > 0) {
              triggerCpuCycles(cycles, op);
              return true;
            }
          }
          return false;
        }
      },
      {
        title: 'Task 6: Storage Capacity Calculation',
        instruction: 'Save a 2048x2048 texture with 32-bit color depth. Calculate file size in bytes: (W * H * Bits) / 8. Command: storage.write("tex.png", size)',
        hint: 'Calculation: (2048 * 2048 * 32) / 8 = 16,777,216 bytes. Type: storage.write("tex.png", 16777216)',
        check: (c) => {
          const match = c.match(/storage\.write\(\s*"([^"]+)"\s*,\s*(\d+)\s*\)/);
          if (match) {
            const name = match[1];
            const size = parseInt(match[2]);
            if (size === 16777216) {
              setStoredFiles(prev => [...prev, { name, size }]);
              animateBitFlow(components.cpu.x, components.cpu.y, components.storage.x, components.storage.y);
              return true;
            }
          }
          return false;
        }
      },
      {
        title: 'Task 7: Display Bandwidth',
        instruction: 'Configure display for 1920x1080 at 120Hz. Calculate pixel throughput (W * H * Hz). Command: screen.display("YOUR ANSWER px/s")',
        hint: 'Calculation: 1920 * 1080 * 120 = 248,832,000. Type: screen.display("248832000 px/s")',
        check: (c) => {
          const match = c.match(/screen\.display\(\s*"([^"]+)"\s*\)/);
          if (match) {
            setScreenText(match[1]);
            // Check if string contains the calculated number
            return match[1].includes('248832000');
          }
          return false;
        }
      }
    ];
  };

  const tasks = getTaskConfig();

  useEffect(() => {
    if (fanSpeed > 0) {
      // Rotate faster for higher speeds, capped visually
      const visualSpeed = Math.min(fanSpeed / 50, 50); 
      const interval = setInterval(() => {
        setFanRotation(prev => (prev + visualSpeed) % 360);
      }, 16);
      return () => clearInterval(interval);
    }
  }, [fanSpeed]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBitFlow(prev => prev
        .filter(bit => bit.progress < 100)
        .map(bit => ({ ...bit, progress: bit.progress + 2 }))
      );
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const executeCode = () => {
    const trimmedCode = code.trim();
    setAttempts(prev => prev + 1);

    if (tasks[currentTask].check(trimmedCode)) {
      const newComplete = [...taskComplete];
      newComplete[currentTask] = true;
      setTaskComplete(newComplete);
      setShowHint(false);
      setAttempts(0);
      setCode('');
    } else {
      if (attempts >= 1) setShowHint(true);
    }
  };

  const handleKeyPress = (key) => {
    if (key === 'SPACE') setTempName(prev => prev + ' ');
    else setTempName(prev => prev + key);
  };
  
  const handleBackspace = () => setTempName(prev => prev.slice(0, -1));
  
  const handleSubmitName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setScreenText(`USER: ${tempName.trim()} AUTHENTICATED`);
      const newComplete = [...taskComplete];
      newComplete[2] = true;
      setTaskComplete(newComplete);
      setTempName('');
    }
  };
  
  const goToNextTask = () => { if (currentTask < tasks.length - 1) { setCurrentTask(prev => prev + 1); setCode(''); setShowHint(false); setAttempts(0); } };
  const goToPrevTask = () => { if (currentTask > 0) { setCurrentTask(prev => prev - 1); setCode(''); setShowHint(false); setAttempts(0); } };

  return (
    <div className="min-h-screen bg-slate-900 p-4 overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 bg-slate-800 p-3 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/30">
            <Cpu size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Acer Hardware Explorer </h1>
            <p className="text-xs text-slate-400 font-medium">Interactive Learning Environment</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tasks.map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full transition-all duration-500 ${i === currentTask ? 'bg-indigo-400 w-6' : taskComplete[i] ? 'bg-emerald-500' : 'bg-slate-600'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        
        {/* VISUALIZATION PANEL */}
        <div className="col-span-8 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl relative overflow-hidden flex flex-col">
          
          {/* Screen Output Area */}
          <div className="bg-black p-4 border-b border-slate-700 relative overflow-hidden h-16 shrink-0">
            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,3px_100%]"></div>
            <div className="flex justify-between items-center relative z-20">
              <div className="flex gap-2">
                <div className={`w-3 h-3 rounded-full ${powerFlow ? 'bg-red-500 animate-pulse' : 'bg-red-900'}`} />
                <div className={`w-3 h-3 rounded-full ${powerFlow ? 'bg-yellow-500' : 'bg-yellow-900'}`} />
                <div className={`w-3 h-3 rounded-full ${powerFlow ? 'bg-emerald-500' : 'bg-emerald-900'}`} />
              </div>
              <div className="text-green-400 font-mono text-sm tracking-wider shadow-green-900 drop-shadow-md truncate max-w-md text-right">
                {screenText || (powerFlow ? 'SYSTEM_READY...' : 'WAITING FOR POWER...')}
              </div>
            </div>
          </div>

          {/* Motherboard Area */}
          <div className={`flex-1 relative transition-colors duration-1000 overflow-hidden ${powerFlow ? 'bg-slate-900' : 'bg-slate-950'}`}>
              
            {/* Circuit Grid Background */}
            <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
            
            {/* Traces */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
               {/* CPU to RAM */}
              <path d="M 20% 25% L 50% 25%" stroke={powerFlow ? "#6366f1" : "#334155"} strokeWidth="4" fill="none" className="transition-colors duration-1000" />
               {/* RAM to Storage */}
              <path d="M 50% 25% L 80% 25%" stroke={powerFlow ? "#6366f1" : "#334155"} strokeWidth="4" fill="none" className="transition-colors duration-1000" />
               {/* Power Lines */}
              <path d="M 80% 75% L 20% 75% L 20% 25%" stroke={powerFlow ? "#f43f5e" : "#334155"} strokeWidth="2" strokeDasharray="5,5" fill="none" className="transition-colors duration-1000" />
            </svg>

            {/* Task 1: Power Surge Bubbles */}
            {powerSurge && Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-yellow-400 rounded-full blur-sm animate-ping"
                style={{
                  left: '80%', top: '75%',
                  animationDuration: `${1 + Math.random()}s`,
                  transform: `translate(${(Math.random() - 0.5) * 500}px, ${(Math.random() - 0.5) * 500}px)`
                }}
              />
            ))}

            {/* Components */}
            {Object.entries(components).map(([key, comp]) => (
              <div 
                key={key}
                onClick={() => setSelectedComponent(comp)}
                className={`absolute w-32 h-32 rounded-xl border-2 flex flex-col items-center justify-center p-2 cursor-pointer transition-all duration-500 z-10
                  ${powerFlow ? 'bg-slate-800 border-slate-600' : 'bg-slate-900 border-slate-800 grayscale opacity-50'}
                  ${powerFlow && selectedComponent?.id === key ? `ring-2 ring-offset-2 ring-offset-slate-900 ${comp.color.replace('text', 'ring')}` : ''}
                  ${key === 'battery' && powerFlow ? 'shadow-[0_0_30px_rgba(244,63,94,0.4)] border-rose-500' : ''}
                `}
                style={{ left: `calc(${comp.x}% - 4rem)`, top: `calc(${comp.y}% - 4rem)` }}
              >
                {/* Task 5: CPU Pulse Rings - Dynamic Color based on Op */}
                {key === 'cpu' && cpuPulse > 0 && (
                   <div className={`absolute inset-0 rounded-xl border-4 animate-ping opacity-75 ${cpuColors[cpuOpType] || cpuColors.IDLE}`}></div>
                )}
                {key === 'cpu' && cpuOpType !== 'IDLE' && (
                  <div className="absolute -top-6 bg-slate-800 text-xs px-2 py-1 rounded border border-slate-600 font-mono text-white animate-pulse">
                    OP: {cpuOpType}
                  </div>
                )}
                
                {/* Task 4: RAM Holographic Overlay (Multi-stack) */}
                {key === 'ram' && ramData.length > 0 && (
                  <div className="absolute -top-24 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center w-48 pointer-events-none">
                    {/* Only show last 3 items to prevent clutter */}
                    {ramData.slice(-3).map((data, idx) => (
                      <div key={idx} className="bg-yellow-900/90 border border-yellow-500/50 backdrop-blur-md p-1.5 rounded-lg shadow-2xl w-full flex justify-between items-center animate-in slide-in-from-bottom-2 fade-in duration-300">
                        <span className="text-[9px] text-yellow-500 font-mono">{data.address}</span>
                        <span className="text-[10px] text-white font-mono font-bold bg-black/50 px-1.5 py-0.5 rounded truncate max-w-[80px]">{data.text}</span>
                      </div>
                    ))}
                    {ramData.length > 3 && <div className="text-[9px] text-yellow-500">+{ramData.length - 3} more...</div>}
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-yellow-900/90 mt-1"></div>
                  </div>
                )}

                <div className={`mb-2 transition-all duration-300 ${powerFlow ? comp.color : 'text-slate-600'}`}>
                   {key === 'fan' ? <comp.icon className="w-10 h-10" style={{ transform: `rotate(${fanRotation}deg)` }} /> : <comp.icon className="w-10 h-10" />}
                </div>
                <div className={`text-xs font-bold text-center leading-tight ${powerFlow ? 'text-slate-300' : 'text-slate-600'}`}>{comp.name}</div>
              </div>
            ))}

            {/* Task 6: Bit Flow Animation */}
            {bitFlow.map(bit => (
               <div 
                 key={bit.id}
                 className="absolute w-4 h-4 rounded bg-emerald-500 text-white text-[9px] flex items-center justify-center font-mono shadow-[0_0_10px_rgba(16,185,129,0.8)] z-20"
                 style={{ 
                   left: `calc(${bit.x + (bit.targetX - bit.x) * (bit.progress / 100)}% - 0.5rem)`, 
                   top: `calc(${bit.y + (bit.targetY - bit.y) * (bit.progress / 100)}% - 0.5rem)`,
                   opacity: bit.progress >= 100 ? 0 : 1
                 }}
               >
                 {bit.value}
               </div>
            ))}

            {/* Task 3: Keyboard */}
            {currentTask === 2 && !taskComplete[2] && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800/90 backdrop-blur border border-slate-600 p-4 rounded-xl shadow-2xl z-30 w-3/4">
                <div className="mb-3 bg-black p-2 rounded border border-slate-700 text-green-400 font-mono text-center h-10 flex items-center justify-center">
                  {tempName || <span className="animate-pulse">_</span>}
                </div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {keyboardKeys.map(key => (
                    <button
                      key={key}
                      onClick={() => handleKeyPress(key)}
                      className={`font-bold rounded shadow active:scale-95 transition-all text-xs
                        ${key === 'SPACE' ? 'w-32' : 'w-8'} h-8
                        bg-slate-700 text-slate-200 hover:bg-slate-600 border-b-2 border-slate-900
                      `}
                    >
                      {key === 'SPACE' ? 'SPACE' : key}
                    </button>
                  ))}
                   <button onClick={handleBackspace} className="w-12 h-8 font-bold rounded shadow active:scale-95 transition-all text-xs bg-red-900/50 text-red-200 hover:bg-red-900/80 border-b-2 border-red-950">DEL</button>
                   <button onClick={handleSubmitName} className="w-16 h-8 font-bold rounded shadow active:scale-95 transition-all text-xs bg-emerald-700 text-emerald-100 hover:bg-emerald-600 border-b-2 border-emerald-900">ENTER</button>
                </div>
              </div>
            )}
          </div>
          
          {/* Info Footer */}
          <div className="bg-slate-800 p-3 h-16 border-t border-slate-700 flex items-center gap-4">
            {selectedComponent ? (
              <>
                 <div className={`p-1.5 rounded-lg ${selectedComponent.bg} ${selectedComponent.color}`}>
                   <selectedComponent.icon size={20} />
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-200 text-sm">{selectedComponent.name}</h4>
                   <p className="text-xs text-slate-400">{selectedComponent.desc}</p>
                 </div>
              </>
            ) : (
               <div className="flex items-center gap-3 text-slate-500">
                 <Info size={18} />
                 <p className="text-xs">Click components to inspect.</p>
               </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: TASKS */}
        <div className="col-span-4 flex flex-col h-full gap-4">
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-xl flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Mission Control</span>
              <span className="bg-indigo-900/50 text-indigo-300 text-xs px-2 py-1 rounded border border-indigo-700/50">Level {currentTask + 1}</span>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">{tasks[currentTask].title}</h3>
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">{tasks[currentTask].instruction}</p>
            
            {/* Code Editor */}
            {currentTask !== 2 && (
              <div className="bg-black/50 rounded-xl border border-slate-600 overflow-hidden mb-4 shadow-inner">
                 <div className="bg-slate-900 px-3 py-1.5 text-[10px] text-slate-400 font-mono border-b border-slate-700 flex items-center gap-2">
                   <File size={10} /> script.js
                 </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-transparent text-emerald-400 font-mono p-3 focus:outline-none resize-none text-sm leading-relaxed"
                  rows="5"
                  placeholder="// Enter command..."
                  spellCheck="false"
                />
              </div>
            )}

            {currentTask !== 2 && (
              <button
                onClick={executeCode}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Run Sequence
              </button>
            )}

            {showHint && (
              <div className="mt-4 bg-amber-900/20 border border-amber-700/50 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-500 text-xs font-bold">Hint:</p>
                  <p className="text-amber-400 text-xs">{tasks[currentTask].hint}</p>
                </div>
              </div>
            )}
            
            {taskComplete[currentTask] && (
              <div className="mt-4 bg-emerald-900/20 border border-emerald-700/50 rounded-xl p-3 flex items-center gap-2 animate-pulse">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <p className="text-emerald-400 text-sm font-bold">System Status: OK</p>
              </div>
            )}

            <div className="mt-auto pt-4 flex gap-3">
              <button onClick={goToPrevTask} disabled={currentTask === 0} className="p-2 rounded-lg border border-slate-600 text-slate-400 hover:bg-slate-700 disabled:opacity-30 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={goToNextTask} disabled={!taskComplete[currentTask]} className="flex-1 py-2 rounded-lg bg-slate-700 text-white font-bold text-sm hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                Next Module <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcerHardwareExplorer;