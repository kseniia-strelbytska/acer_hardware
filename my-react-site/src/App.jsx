import React, { useState, useEffect } from 'react';
import { Play, Info, CheckCircle, AlertCircle, Zap, Cpu, HardDrive, Monitor, ChevronLeft, ChevronRight, File } from 'lucide-react';

const AcerHardwareExplorer = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentTask, setCurrentTask] = useState(0);
  const [code, setCode] = useState('');
  const [userName, setUserName] = useState('');
  const [tempName, setTempName] = useState('');
  const [fanSpeed, setFanSpeed] = useState(0);
  const [fanRotation, setFanRotation] = useState(0);
  const [screenText, setScreenText] = useState('');
  const [ramData, setRamData] = useState([]);
  const [storedFiles, setStoredFiles] = useState([]);
  const [dataFlow, setDataFlow] = useState([]);
  const [bitFlow, setBitFlow] = useState([]);
  const [cpuActivity, setCpuActivity] = useState(0);
  const [powerFlow, setPowerFlow] = useState(false);
  const [taskComplete, setTaskComplete] = useState([false, false, false, false, false, false, false]);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const components = {
    cpu: { name: 'CPU (Processor)', desc: 'The brain of the computer. Processes all instructions and calculations.', x: 25, y: 20, gridX: 2, gridY: 2 },
    ram: { name: 'RAM (Memory)', desc: 'Temporary fast-access memory that stores data currently being used.', x: 50, y: 20, gridX: 5, gridY: 2 },
    storage: { name: 'SSD Storage', desc: 'Permanent storage that holds your files, programs, and operating system.', x: 75, y: 20, gridX: 8, gridY: 2 },
    fan: { name: 'Cooling Fan', desc: 'Keeps components cool by circulating air and preventing overheating.', x: 25, y: 80, gridX: 2, gridY: 8 },
    battery: { name: 'Battery', desc: 'Lithium-ion power source providing portable electricity.', x: 75, y: 80, gridX: 8, gridY: 8 }
  };

  const getTaskConfig = () => [
    {
      title: 'Task 1: Power On the System',
      instruction: 'Before we can do anything, we need power! Type: battery.powerOn()',
      hint: 'Simply call battery.powerOn() with parentheses',
      check: (c) => {
        if (c.includes('battery.powerOn')) {
          setPowerFlow(true);
          return true;
        }
        return false;
      }
    },
    {
      title: 'Task 2: Start the Cooling Fan',
      instruction: `Great${userName ? ', ' + userName : ''}! The CPU generates heat. Use the fan object to start cooling. Type: fan.start(speed=YOUR_NUMBER)`,
      hint: 'Remember: fan.start(speed=NUMBER) where speed is in RPM (try 1000-3000)',
      check: (c) => {
        const match = c.match(/fan\.start\(\s*speed\s*=\s*(\d+)\s*\)/);
        if (match) {
          setFanSpeed(parseInt(match[1]));
          return true;
        }
        return false;
      }
    },
    {
      title: 'Task 3: Type Your Name',
      instruction: 'Click the keyboard keys below to type your name, then click Submit!',
      hint: 'Type your name using the keyboard and press the Submit button',
      check: () => userName.length > 0
    },
    {
      title: `Task 4: Store Data in RAM`,
      instruction: `Great to meet you, ${userName}! Now let's store some data. Type: ram.store("Hello World")`,
      hint: 'Format: ram.store("YOUR TEXT HERE")',
      check: (c) => {
        const match = c.match(/ram\.store\(\s*"([^"]+)"\s*\)/);
        if (match) {
          setRamData(prev => [...prev.slice(-4), { text: match[1], time: Date.now() }]);
          return true;
        }
        return false;
      }
    },
    {
      title: `Task 5: Activate CPU Processing`,
      instruction: `Excellent work, ${userName}! Execute a calculation. Type: cpu.execute("2 + 2")`,
      hint: 'Use cpu.execute() with a calculation in quotes',
      check: (c) => {
        if (c.includes('cpu.execute')) {
          setCpuActivity(100);
          setTimeout(() => setCpuActivity(50), 500);
          setTimeout(() => setCpuActivity(0), 2000);
          return true;
        }
        return false;
      }
    },
    {
      title: `Task 6: Write to Storage`,
      instruction: `Well done, ${userName}! Save a file permanently. Type: storage.write("myfile.txt", 1024)`,
      hint: 'Format: storage.write(filename, size_in_bytes)',
      check: (c) => {
        const match = c.match(/storage\.write\(\s*"([^"]+)"\s*,\s*(\d+)\s*\)/);
        if (match) {
          const newFile = {
            name: match[1],
            size: parseInt(match[2]),
            date: new Date().toLocaleString(),
            id: Date.now()
          };
          setStoredFiles(prev => [...prev, newFile]);
          // Animate bits flowing from CPU to storage
          animateBitFlow(components.cpu.gridX, components.cpu.gridY, components.storage.gridX, components.storage.gridY);
          return true;
        }
        return false;
      }
    },
    {
      title: `Task 7: Display Message on Screen`,
      instruction: `Final task, ${userName}! Type: screen.display("Hardware Mastered!")`,
      hint: 'Use screen.display() with text in quotes',
      check: (c) => {
        const match = c.match(/screen\.display\(\s*"([^"]+)"\s*\)/);
        if (match) {
          setScreenText(match[1]);
          return true;
        }
        return false;
      }
    }
  ];

  const tasks = getTaskConfig();

  const animateBitFlow = (startX, startY, endX, endY) => {
    const bits = [];
    const pathX = endX - startX;
    const pathY = endY - startY;
    
    for (let i = 0; i < 8; i++) {
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

  // Animate fan rotation
  useEffect(() => {
    if (fanSpeed > 0) {
      const interval = setInterval(() => {
        setFanRotation(prev => (prev + fanSpeed / 50) % 360);
      }, 16);
      return () => clearInterval(interval);
    }
  }, [fanSpeed]);

  // Animate data flow particles
  useEffect(() => {
    const interval = setInterval(() => {
      if (powerFlow) {
        setDataFlow(prev => {
          const newFlow = [...prev];
          if (Math.random() > 0.8) {
            newFlow.push({ 
              id: Date.now() + Math.random(), 
              x: Math.random() * 100, 
              y: Math.random() * 100, 
              progress: 0 
            });
          }
          return newFlow.filter(d => d.progress < 100).map(d => ({ ...d, progress: d.progress + 2 }));
        });
      }
    }, 50);
    return () => clearInterval(interval);
  }, [powerFlow]);

  // Animate bit flow
  useEffect(() => {
    const interval = setInterval(() => {
      setBitFlow(prev => {
        return prev
          .filter(bit => bit.progress < 100)
          .map(bit => ({ ...bit, progress: bit.progress + 2 }));
      });
    }, 30);
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
      if (attempts >= 2) {
        setShowHint(true);
      }
    }
  };

  const handleKeyPress = (key) => {
    setTempName(prev => prev + key);
  };

  const handleBackspace = () => {
    setTempName(prev => prev.slice(0, -1));
  };

  const handleSubmitName = () => {
    if (tempName.trim().length > 0) {
      setUserName(tempName.trim());
      setScreenText(tempName.trim());
      const newComplete = [...taskComplete];
      newComplete[2] = true;
      setTaskComplete(newComplete);
    }
  };

  const goToPrevTask = () => {
    if (currentTask > 0) {
      setCurrentTask(prev => prev - 1);
      setCode('');
      setShowHint(false);
      setAttempts(0);
    }
  };

  const goToNextTask = () => {
    if (currentTask < tasks.length - 1) {
      setCurrentTask(prev => prev + 1);
      setCode('');
      setShowHint(false);
      setAttempts(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-purple-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 mb-2">
            Acer N19C3 Hardware Explorer
          </h1>
          <p className="text-purple-700 text-lg">Interactive Learning Experience</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel */}
          <div className="flex-1 lg:w-2/3 space-y-6">
            {/* Screen Display */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-purple-200 shadow-xl">
              <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                LCD Display
              </h2>
              <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg shadow-lg border-4 border-slate-300 flex items-center justify-center">
                <div className="w-[95%] h-28 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 rounded flex items-center justify-center p-4">
                  <p className="text-purple-700 text-lg font-mono break-all text-center">{screenText || 'Display Ready...'}</p>
                </div>
              </div>
            </div>

            {/* Laptop Internal Components - Motherboard */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-purple-200 shadow-xl">
              <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                Motherboard & Components
              </h2>
              
              <div className="relative bg-gradient-to-br from-emerald-100/50 via-teal-50/50 to-cyan-100/50 rounded-xl p-12 min-h-[1200px] border-4 border-teal-200 shadow-inner overflow-hidden">
                {/* Motherboard Grid Pattern */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(134, 239, 172, 0.4)" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)"/>
                  
                  {/* Main circuit traces - horizontal */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(134, 239, 172, 0.6)" strokeWidth="0.4"/>
                  <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(134, 239, 172, 0.6)" strokeWidth="0.4"/>
                  <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(134, 239, 172, 0.6)" strokeWidth="0.4"/>
                  
                  {/* Main circuit traces - vertical */}
                  <line x1="25" y1="0" x2="25" y2="100" stroke="rgba(134, 239, 172, 0.6)" strokeWidth="0.4"/>
                  <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(134, 239, 172, 0.6)" strokeWidth="0.4"/>
                  <line x1="75" y1="0" x2="75" y2="100" stroke="rgba(134, 239, 172, 0.6)" strokeWidth="0.4"/>
                </svg>

                {/* Data flow particles on traces */}
                {dataFlow.map(flow => (
                  <div
                    key={flow.id}
                    className="absolute w-2 h-2 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"
                    style={{
                      left: `${flow.x}%`,
                      top: `${flow.y}%`,
                      opacity: 1 - flow.progress / 100,
                      transform: `scale(${1 - flow.progress / 200})`
                    }}
                  />
                ))}

                {/* Bit flow animation (0s and 1s) */}
                {bitFlow.map(bit => {
                  const currentX = bit.x + (bit.targetX - bit.x) * (bit.progress / 100);
                  const currentY = bit.y + (bit.targetY - bit.y) * (bit.progress / 100);
                  return (
                    <div
                      key={bit.id}
                      className="absolute text-purple-600 font-bold text-sm animate-pulse"
                      style={{
                        left: `${currentX * 10}%`,
                        top: `${currentY * 10}%`,
                        opacity: 1 - bit.progress / 100,
                        transition: 'left 0.3s, top 0.3s'
                      }}
                    >
                      {bit.value}
                    </div>
                  );
                })}

                {/* Components positioned on grid */}
                {Object.entries(components).map(([key, comp]) => (
                  <div
                    key={key}
                    className="absolute cursor-pointer transform transition-all duration-300 hover:scale-110"
                    style={{ 
                      left: `${comp.x}%`, 
                      top: `${comp.y}%`, 
                      transform: 'translate(-50%, -50%)' 
                    }}
                    onClick={() => setSelectedComponent(key)}
                  >
                    {key === 'cpu' && (
                      <div className="relative">
                        <div className={`w-32 h-32 bg-gradient-to-br from-orange-300 via-amber-200 to-yellow-300 rounded-2xl shadow-2xl flex items-center justify-center transition-all border-4 border-orange-400 ${cpuActivity > 0 ? 'shadow-amber-400/70 scale-105' : ''}`}>
                          <Cpu className="w-16 h-16 text-orange-700" />
                        </div>
                        {cpuActivity > 0 && (
                          <>
                            <div className="absolute inset-0 bg-amber-300 rounded-2xl animate-ping opacity-40" />
                            {/* Golden processing lines */}
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                              <line x1="20" y1="50" x2="80" y2="50" stroke="gold" strokeWidth="2" className="animate-pulse" opacity={cpuActivity / 100} />
                              <line x1="50" y1="20" x2="50" y2="80" stroke="gold" strokeWidth="2" className="animate-pulse" opacity={cpuActivity / 100} style={{ animationDelay: '0.2s' }} />
                              <line x1="30" y1="30" x2="70" y2="70" stroke="gold" strokeWidth="2" className="animate-pulse" opacity={cpuActivity / 100} style={{ animationDelay: '0.4s' }} />
                              <line x1="70" y1="30" x2="30" y2="70" stroke="gold" strokeWidth="2" className="animate-pulse" opacity={cpuActivity / 100} style={{ animationDelay: '0.6s' }} />
                            </svg>
                          </>
                        )}
                      </div>
                    )}
                    
                    {key === 'ram' && (
                      <div className="w-36 h-16 bg-gradient-to-r from-green-300 via-emerald-200 to-teal-300 rounded-lg shadow-2xl flex items-center justify-center overflow-hidden relative border-4 border-green-400">
                        {ramData.slice(-3).map((data, i) => (
                          <div key={i} className="absolute text-[10px] text-green-800 font-mono opacity-70" style={{ top: `${i * 30}%` }}>
                            {data.text.slice(0, 10)}
                          </div>
                        ))}
                        <HardDrive className="w-8 h-8 text-green-700 z-10" />
                      </div>
                    )}
                    
                    {key === 'storage' && (
                      <div className="relative">
                        <div className="w-36 h-24 bg-gradient-to-br from-blue-300 via-indigo-200 to-purple-300 rounded-2xl shadow-2xl flex flex-col items-center justify-center border-4 border-blue-400">
                          <HardDrive className="w-12 h-12 text-blue-700 mb-1" />
                          <div className="text-blue-800 text-xs font-bold">{storedFiles.length} files</div>
                        </div>
                        {/* File icons on storage */}
                        <div className="absolute -top-10 left-0 right-0 flex flex-wrap gap-2 justify-center">
                          {storedFiles.map((file, idx) => (
                            <div
                              key={file.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFile(file);
                              }}
                              className="w-8 h-8 bg-white rounded-lg shadow-lg cursor-pointer hover:scale-110 transition-transform flex items-center justify-center border-2 border-blue-300"
                              title={file.name}
                            >
                              <File className="w-5 h-5 text-blue-600" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {key === 'fan' && (
                      <div className="relative w-24 h-24">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 via-slate-200 to-gray-300 rounded-full shadow-2xl border-4 border-gray-400" />
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 100 100"
                          style={{ transform: `rotate(${fanRotation}deg)`, transition: 'transform 0.05s linear' }}
                        >
                          {[0, 120, 240].map(angle => (
                            <path
                              key={angle}
                              d="M50 50 Q60 30 50 10 Q40 30 50 50"
                              fill="#e2e8f0"
                              opacity="0.9"
                              transform={`rotate(${angle} 50 50)`}
                            />
                          ))}
                          <circle cx="50" cy="50" r="10" fill="#475569" />
                        </svg>
                      </div>
                    )}
                    
                    {key === 'battery' && (
                      <div className="relative w-28 h-20 bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-300 rounded-2xl shadow-2xl flex items-center justify-center border-4 border-yellow-400">
                        <Zap className={`w-12 h-12 text-yellow-700 ${powerFlow ? 'animate-pulse' : ''}`} />
                        {powerFlow && (
                          <div className="absolute inset-0 bg-yellow-300 rounded-2xl animate-ping opacity-30" />
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Component info popup */}
                {selectedComponent && (
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-lg border-2 border-purple-300 rounded-2xl p-5 max-w-xs shadow-2xl z-20">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-purple-700 font-bold text-lg">{components[selectedComponent].name}</h3>
                      <button onClick={() => setSelectedComponent(null)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
                    </div>
                    <p className="text-gray-700 text-sm">{components[selectedComponent].desc}</p>
                    <button className="mt-3 text-purple-600 text-sm hover:text-purple-700 flex items-center gap-1 font-semibold">
                      <Info className="w-4 h-4" />
                      Read More
                    </button>
                  </div>
                )}

                {/* File metadata popup */}
                {selectedFile && (
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-lg border-2 border-blue-300 rounded-2xl p-5 max-w-xs shadow-2xl z-20">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-blue-700 font-bold text-lg flex items-center gap-2">
                        <File className="w-5 h-5" />
                        File Details
                      </h3>
                      <button onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600 font-semibold">Name:</span>
                        <span className="text-gray-800 ml-2 font-mono">{selectedFile.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 font-semibold">Size:</span>
                        <span className="text-gray-800 ml-2">{selectedFile.size} bytes ({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                      </div>
                      <div>
                        <span className="text-gray-600 font-semibold">Date Added:</span>
                        <span className="text-gray-800 ml-2">{selectedFile.date}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Virtual Keyboard */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-purple-200 shadow-xl">
              <h3 className="text-xl font-bold text-purple-700 mb-4">Keyboard Input</h3>
              <div className="mb-4 bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                <div className="text-purple-700 font-mono text-lg min-h-[28px]">{tempName || 'Type here...'}</div>
              </div>
              <div className="space-y-1 mb-3">
                <div className="grid grid-cols-10 gap-1">
                  {'QWERTYUIOP'.split('').map(key => (
                    <button
                      key={key}
                      onClick={() => handleKeyPress(key)}
                      className="bg-purple-100 hover:bg-purple-300 text-purple-800 font-bold py-3 rounded-lg transition-colors text-sm border-2 border-purple-200 shadow-sm"
                    >
                      {key}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-10 gap-1">
                  <div className="col-span-1"></div>
                  {'ASDFGHJKL'.split('').map(key => (
                    <button
                      key={key}
                      onClick={() => handleKeyPress(key)}
                      className="bg-purple-100 hover:bg-purple-300 text-purple-800 font-bold py-3 rounded-lg transition-colors text-sm border-2 border-purple-200 shadow-sm"
                    >
                      {key}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-10 gap-1">
                  <div className="col-span-2"></div>
                  {'ZXCVBNM'.split('').map(key => (
                    <button
                      key={key}
                      onClick={() => handleKeyPress(key)}
                      className="bg-purple-100 hover:bg-purple-300 text-purple-800 font-bold py-3 rounded-lg transition-colors text-sm border-2 border-purple-200 shadow-sm"
                    >
                      {key}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-10 gap-1">
                  <button
                    onClick={() => handleKeyPress(' ')}
                    className="col-span-5 col-start-2 bg-purple-100 hover:bg-purple-300 text-purple-800 font-bold py-3 rounded-lg transition-colors border-2 border-purple-200 shadow-sm"
                  >
                    SPACE
                  </button>
                  <button
                    onClick={handleBackspace}
                    className="col-span-2 bg-pink-200 hover:bg-pink-300 text-pink-800 font-bold py-3 rounded-lg transition-colors text-xs border-2 border-pink-300 shadow-sm"
                  >
                    ← BACK
                  </button>
                </div>
              </div>
              {currentTask === 2 && (
                <button
                  onClick={handleSubmitName}
                  className="w-full bg-gradient-to-r from-green-300 to-emerald-300 hover:from-green-400 hover:to-emerald-400 text-green-800 font-bold py-3 rounded-xl transition-all shadow-lg border-2 border-green-400"
                >
                  Submit Name
                </button>
              )}
            </div>
          </div>

          {/* Right Panel - Tasks */}
          <div className="flex-1 lg:w-1/3 space-y-4">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-purple-200 shadow-xl sticky top-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-6">Learning Tasks</h2>
              
              {/* Task Progress Dots */}
              <div className="flex items-center justify-center gap-3 mb-6">
                {tasks.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === currentTask ? 'bg-purple-400 scale-150 ring-4 ring-purple-400/30' :
                      taskComplete[idx] ? 'bg-green-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 rounded-2xl p-5 border-2 border-purple-300 mb-4 shadow-md">
                <h3 className="text-xl font-bold text-purple-800 mb-2">{tasks[currentTask].title}</h3>
                <p className="text-purple-700 mb-4 text-sm">{tasks[currentTask].instruction}</p>

                {currentTask !== 2 && (
                  <>
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full bg-white text-purple-700 font-mono p-3 rounded-xl border-2 border-purple-300 focus:border-purple-400 focus:outline-none mb-3 resize-none shadow-sm"
                      rows="3"
                      placeholder="Type your code here..."
                    />
                    <button
                      onClick={executeCode}
                      className="w-full bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-400 hover:to-pink-400 text-purple-800 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg border-2 border-purple-400"
                    >
                      <Play className="w-5 h-5" />
                      Execute Code
                    </button>
                  </>
                )}

                {showHint && (
                  <div className="mt-4 bg-amber-100 border-2 border-amber-300 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-800 text-sm font-bold">Hint:</p>
                      <p className="text-amber-700 text-sm">{tasks[currentTask].hint}</p>
                    </div>
                  </div>
                )}

                {taskComplete[currentTask] && (
                  <div className="mt-4 bg-green-100 border-2 border-green-300 rounded-xl p-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 text-sm font-bold">Task Complete! 🎉</p>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={goToPrevTask}
                  disabled={currentTask === 0}
                  className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border-2 ${
                    currentTask === 0 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300' 
                      : 'bg-gradient-to-r from-purple-200 to-pink-200 hover:from-purple-300 hover:to-pink-300 text-purple-800 shadow-lg border-purple-300'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                <button
                  onClick={goToNextTask}
                  disabled={currentTask === tasks.length - 1}
                  className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border-2 ${
                    currentTask === tasks.length - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300' 
                      : 'bg-gradient-to-r from-purple-200 to-pink-200 hover:from-purple-300 hover:to-pink-300 text-purple-800 shadow-lg border-purple-300'
                  }`}
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-purple-200 shadow-xl">
              <h3 className="text-lg font-bold text-purple-700 mb-3">Overall Progress</h3>
              <div className="w-full bg-purple-100 rounded-full h-4 overflow-hidden border-2 border-purple-200">
                <div
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${(taskComplete.filter(Boolean).length / tasks.length) * 100}%` }}
                />
              </div>
              <p className="text-purple-700 text-sm mt-2 text-center font-semibold">
                {taskComplete.filter(Boolean).length} / {tasks.length} Tasks Completed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcerHardwareExplorer;