import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import './css/valentine-cny.css';
import eventData from '../json/events.json';
import NavMobile from './landing-page/Nav-mobile.jsx'
import Header from './landing-page/Header.jsx'

const ValentineCNYEvent = () => {
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  // UI state
  const [coverImageLoaded, setCoverImageLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [activeTab, setActiveTab] = useState('about_valentine');
  const [showHearts, setShowHearts] = useState(true);
  const [showLanterns, setShowLanterns] = useState(true);

  // Refs
  const audioRef = useRef(null);
  const lanternsRef = useRef(null);

  // Game refs/state
  const gameCanvasRef = useRef(null);
  const gameRAFRef = useRef(null);
  const gameStateRef = useRef(null); // mutable state for game loop & controls

  // Get event data from JSON
  const valentineCNYEvent = eventData.events.valentine;

  // Audio controls
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleProgressChange = useCallback((e) => {
    const value = Number(e.target.value);
    const newTime = (value / 100) * duration;
    if (audioRef.current) audioRef.current.currentTime = newTime;
    setProgress(value);
  }, [duration]);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = Number(e.target.value);
    if (audioRef.current) audioRef.current.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) setIsMuted(false);
  }, [isMuted]);

  const formatTime = useCallback((time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      if (duration > 0) {
        setProgress((audio.currentTime / duration) * 100);
      }
    };

    const setAudioData = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioData);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioData);
    };
  }, [duration]);

  // Hearts (pure CSS/HTML)
  const renderHearts = () => {
    if (!showHearts) return null;
    const hearts = [];
    for (let i = 0; i < 30; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        animationDuration: `${3 + Math.random() * 7}s`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.5 + 0.5,
        fontSize: `${Math.random() * 10 + 10}px`,
        color: ['#ff6b81', '#ff4757', '#ff0033', '#fd79a8'][Math.floor(Math.random() * 4)]
      };
      hearts.push(
        <div key={i} className="heart_valentine" style={style}>
          ❤
        </div>
      );
    }
    return hearts;
  };

  // Floating Lanterns (pure CSS/HTML)
  useEffect(() => {
    if (!showLanterns || !lanternsRef.current) return;
    const container = lanternsRef.current;
    const lanternCount = 15;
    while (container.firstChild) container.removeChild(container.firstChild);
    for (let i = 0; i < lanternCount; i++) {
      const lantern = document.createElement('div');
      lantern.className = 'cny-lantern_valentine';
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const colors = ['#e84118', '#c23616', '#ff4757', '#ff6b81'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      lantern.style.left = `${posX}%`;
      lantern.style.top = `${posY}%`;
      lantern.style.color = color;
      lantern.style.animationDelay = `${Math.random() * 2}s`;
      lantern.innerHTML = '🏮';
      container.appendChild(lantern);
    }
    return () => {
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, [showLanterns]);

  // Image loading handler
  const handleImageLoad = useCallback((index) => {
    setLoadedImages(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  // ========= GAME: SNAKE (with mobile buttons + keyboard) =========
  const startGame = useCallback(() => {
    const canvas = gameCanvasRef.current;
    if (!canvas) return;

    // HiDPI scaling
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const baseWidth = 800;
    const baseHeight = 220;
    canvas.style.width = '100%';
    canvas.width = baseWidth * dpr;
    canvas.height = baseHeight * dpr;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Grid
    const cell = 20; // 20px per cell
    const cols = Math.floor(baseWidth / cell); // 40
    const rows = Math.floor(baseHeight / cell); // 11

    // Game state
    let snake = [
      { x: 5, y: Math.floor(rows / 2) },
      { x: 4, y: Math.floor(rows / 2) },
      { x: 3, y: Math.floor(rows / 2) },
    ];
    let dir = { x: 1, y: 0 }; // moving right
    let nextDir = { x: 1, y: 0 };
    let food = null;
    let score = 0;
    let best = Number(localStorage.getItem('val_snake_best') || 0);
    let tickMs = 130; // speed
    let paused = false;
    let gameOver = false;
    let intervalId = null;

    const placeFood = () => {
      let fx, fy, bad;
      do {
        fx = Math.floor(Math.random() * cols);
        fy = Math.floor(Math.random() * rows);
        bad = snake.some(s => s.x === fx && s.y === fy);
      } while (bad);
      food = { x: fx, y: fy };
    };

    placeFood();

    // Drawing helpers
    const clear = () => {
      // soft pink background to match event theme
      const grd = ctx.createLinearGradient(0, 0, 0, baseHeight);
      grd.addColorStop(0, '#ffe0f2');
      grd.addColorStop(1, '#ffd1ec');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, baseWidth, baseHeight);
    };

    const drawCell = (x, y, fill) => {
      ctx.fillStyle = fill;
      ctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
    };

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cell, 0);
        ctx.lineTo(c * cell, baseHeight);
        ctx.stroke();
      }
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * cell);
        ctx.lineTo(baseWidth, r * cell);
        ctx.stroke();
      }
    };

    const drawHUD = () => {
      ctx.fillStyle = '#feca57';
      ctx.font = '18px Poppins, sans-serif';
      ctx.fillText(`Score: ${score}`, 10, 22);
      ctx.fillText(`Best: ${best}`, 10, 44);
    };

    const render = () => {
      clear();
      drawGrid();

      // food
      drawCell(food.x, food.y, '#e84393'); // rose pink

      // snake
      snake.forEach((s, i) => {
        drawCell(s.x, s.y, i === 0 ? '#ff4757' : '#ff6b81');
      });

      drawHUD();

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, baseWidth, baseHeight);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 26px Poppins, sans-serif';
        ctx.fillText('Game Over ❤', baseWidth / 2, baseHeight / 2 - 10);
        ctx.font = '16px Poppins, sans-serif';
        ctx.fillText('Tap/Click or Press Enter to Restart', baseWidth / 2, baseHeight / 2 + 18);
        ctx.textAlign = 'start';
      } else if (paused) {
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(0, 0, baseWidth, baseHeight);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 22px Poppins, sans-serif';
        ctx.fillText('Paused', baseWidth / 2, baseHeight / 2);
        ctx.textAlign = 'start';
      }
    };

    const setDirection = (nx, ny) => {
      // prevent reversing directly
      if (nx === -dir.x && ny === -dir.y) return;
      nextDir = { x: nx, y: ny };
    };

    const step = () => {
      if (paused || gameOver) {
        render();
        return;
      }

      dir = nextDir; // apply buffered direction
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // wrap or collide? We'll use collide walls
      if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows) {
        gameOver = true;
        best = Math.max(best, score);
        localStorage.setItem('val_snake_best', String(best));
        render();
        return;
      }

      // self collision
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        gameOver = true;
        best = Math.max(best, score);
        localStorage.setItem('val_snake_best', String(best));
        render();
        return;
      }

      snake.unshift(head);

      // eat
      if (head.x === food.x && head.y === food.y) {
        score += 1;
        if (score % 5 === 0 && tickMs > 60) {
          // speed up slightly every 5 food
          tickMs -= 5;
          restartInterval();
        }
        placeFood();
      } else {
        snake.pop();
      }

      render();
    };

    const restart = () => {
      snake = [
        { x: 5, y: Math.floor(rows / 2) },
        { x: 4, y: Math.floor(rows / 2) },
        { x: 3, y: Math.floor(rows / 2) },
      ];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      score = 0;
      tickMs = 130;
      paused = false;
      gameOver = false;
      placeFood();
      restartInterval();
      render();
    };

    const restartInterval = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(step, tickMs);
    };

    // input handlers (keyboard)
    const onKeyDown = (e) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') setDirection(0, -1);
      else if (e.code === 'ArrowDown' || e.code === 'KeyS') setDirection(0, 1);
      else if (e.code === 'ArrowLeft' || e.code === 'KeyA') setDirection(-1, 0);
      else if (e.code === 'ArrowRight' || e.code === 'KeyD') setDirection(1, 0);
      else if (e.code === 'Space' || e.code === 'KeyP') paused = !paused;
      else if (e.code === 'Enter') {
        if (gameOver) restart();
      }
    };

    // simple click/tap to restart on canvas
    const onCanvasPointerDown = () => {
      if (gameOver) restart();
    };

    window.addEventListener('keydown', onKeyDown);
    canvas.addEventListener('pointerdown', onCanvasPointerDown);

    // expose controls for mobile buttons
    gameStateRef.current = {
      stop: () => {
        if (intervalId) clearInterval(intervalId);
        window.removeEventListener('keydown', onKeyDown);
        canvas.removeEventListener('pointerdown', onCanvasPointerDown);
      },
      setUp: () => setDirection(0, -1),
      setDown: () => setDirection(0, 1),
      setLeft: () => setDirection(-1, 0),
      setRight: () => setDirection(1, 0),
      togglePause: () => { paused = !paused; render(); },
      restart: () => restart(),
    };

    // initial render and start
    render();
    restartInterval();
  }, []);

  // Mount/unmount game when tab opens/closes
  useEffect(() => {
    if (activeTab === 'game_valentine') {
      startGame();
      const handleResize = () => {
        if (gameStateRef.current) gameStateRef.current.stop?.();
        startGame();
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        if (gameStateRef.current) gameStateRef.current.stop?.();
      };
    } else {
      if (gameStateRef.current) gameStateRef.current.stop?.();
    }
  }, [activeTab, startGame]);

  return (
    <>
      <NavMobile />
      <Header />
      <div className="valentine-cny-event_valentine">
        {/* Hearts effect */}
        <div className="hearts-container_valentine">
          {renderHearts()}
        </div>

        {/* Floating lanterns */}
        <div className="cny-lanterns_valentine" ref={lanternsRef}></div>

        {/* Header with cover art and player */}
        <header className="event-header_valentine">
          <div className="header-content_valentine">
            <div className="cover-art-container_valentine">
              <img
                src={valentineCNYEvent.coverImage}
                alt={`${valentineCNYEvent.title} Cover`}
                className={`cover-art_valentine ${coverImageLoaded ? 'loaded' : 'loading'}`}
                onLoad={() => setCoverImageLoaded(true)}
              />
              {!coverImageLoaded && (
                <div className="cover-art-placeholder_valentine">
                  <span className="placeholder-icon_valentine">❤️🏮</span>
                </div>
              )}
              <div className="cover-art-decoration_valentine">
                <span className="heart-decoration_valentine">❤️</span>
                <div className="gold-decoration_valentine"></div>
              </div>
            </div>

            <div className="event-info_valentine">
              <h1 className="event-title_valentine">
                <span className="title-text_valentine">{valentineCNYEvent.title}</span>
                <span className="title-decoration_valentine">🏮</span>
              </h1>
              <p className="event-subtitle_valentine">{valentineCNYEvent.subtitle}</p>
            </div>

            <div className="audio-player_valentine">
              <div className="progress-container_valentine">
                <input
                  type="range"
                  className="progress-bar_valentine"
                  value={progress}
                  min={0}
                  max={100}
                  step={0.1}
                  onChange={handleProgressChange}
                  style={{ '--progress': `${progress}%` }}
                  aria-label="Track progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                />
                <div className="time-display_valentine">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="player-controls_valentine">
                <button className="control-btn_valentine" aria-label="Previous track">
                  <span>⏮</span>
                </button>
                <button
                  className={`control-btn_valentine play-btn_valentine ${isPlaying ? 'playing' : ''}`}
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  <span>{isPlaying ? '⏸' : '⏵'}</span>
                </button>
                <button className="control-btn_valentine" aria-label="Next track">
                  <span>⏭</span>
                </button>

                {/* <div className="volume-control_valentine">
                  <button
                    className="mute-btn_valentine"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    <span>{isMuted ? '🔇' : '🔊'}</span>
                  </button>
                  <input
                    type="range"
                    className="volume-slider_valentine"
                    value={volume}
                    min={0}
                    max={1}
                    step="0.01"
                    onChange={handleVolumeChange}
                    style={{ '--volume': `${volume * 100}%` }}
                    aria-label="Volume control"
                    aria-valuemin={0}
                    aria-valuemax={1}
                    aria-valuenow={volume}
                  />
                </div> */}
              </div>
            </div>
          </div>

          <div className="header-decoration_valentine">
            <div className="ornament_valentine left_valentine"></div>
            <div className="ornament_valentine right_valentine"></div>
            <div className="floral-garland_valentine"></div>
          </div>
        </header>

        {/* Main content area */}
        <main className="event-main_valentine">
          <nav className="content-nav_valentine">
            <button
              className={`nav-btn_valentine ${activeTab === 'about_valentine' ? 'active' : ''}`}
              onClick={() => setActiveTab('about_valentine')}
            >
              About
            </button>
            <button
              className={`nav-btn_valentine ${activeTab === 'gallery_valentine' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery_valentine')}
            >
              Gallery
            </button>
            <button
              className={`nav-btn_valentine ${activeTab === 'game_valentine' ? 'active' : ''}`}
              onClick={() => setActiveTab('game_valentine')}
            >
              Game
            </button>
            <button
              className={`nav-btn_valentine ${activeTab === 'settings_valentine' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings_valentine')}
            >
              Settings
            </button>
          </nav>

          <div className="content-container_valentine">
            {activeTab === 'about_valentine' && (
              <section className="about-section_valentine">
                <h2>
                  <span className="section-icon_valentine">❤️</span>
                  About This Event
                  <span className="section-icon_valentine">🏮</span>
                </h2>

                <p>
                  Welcome to the <strong>Valentine & Chinese New Year Celebration</strong> — a fusion of love and prosperity. 
                  This event combines the romance of Valentine's Day with the festive spirit of Lunar New Year, creating a unique experience filled with joy and good fortune.
                </p>
              </section>
            )}

            {activeTab === 'gallery_valentine' && (
              <section className="gallery-section_valentine">
                <h2>
                  <span className="section-icon_valentine">🏮</span>
                  Event Gallery
                </h2>
                <div className="gallery-grid_valentine">
                  {valentineCNYEvent.galleryImages.map((img, index) => (
                    <div
                      className="gallery-item_valentine"
                      key={index}
                      style={{ '--delay': `${index * 0.1}s` }}
                    >
                      {!loadedImages.has(index) && (
                        <div className="image-placeholder_valentine">
                          <span className="placeholder-icon_valentine">❤️</span>
                        </div>
                      )}
                      <img
                        src={img.src}
                        alt={img.alt}
                        loading={index < 3 ? "eager" : "lazy"}
                        className={`gallery-image_valentine ${loadedImages.has(index) ? 'loaded' : 'loading'}`}
                        onLoad={() => handleImageLoad(index)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'game_valentine' && (
              <section className="game-section_valentine">
                <h2>
                  <span className="section-icon_valentine">❤️</span>
                  Snake: Love & Fortune
                </h2>
                <p className="game-hint_valentine">
                  PC: Use <b>Arrow Keys</b> or <b>W/A/S/D</b>. &nbsp;|&nbsp; 
                  Mobile: Tap the buttons below. &nbsp;|&nbsp; 
                  <b>Space/P</b> to Pause, <b>Enter</b> to Restart.
                </p>
                <div className="game-container_valentine" style={{ position: 'relative' }}>
                  <canvas ref={gameCanvasRef} className="valentine-game-canvas_valentine"></canvas>

                  {/* Mobile controls (always rendered; CSS can choose to hide on desktop) */}
                  <div
                    className="mobile-controls_valentine"
                    style={{
                      position: 'absolute',
                      inset: 'auto 0 -6px 0',
                      display: 'grid',
                      placeItems: 'center',
                      gap: '6px',
                      gridTemplateColumns: 'repeat(3, 64px)',
                      justifyContent: 'center',
                      pointerEvents: 'none', // container ignores events; buttons re-enable
                    }}
                  >
                    <div style={{ gridColumn: '2', pointerEvents: 'auto' }}>
                      <button
                        className="dir-btn_valentine up_valentine"
                        aria-label="Up"
                        onPointerDown={(e) => { e.preventDefault(); gameStateRef.current?.setUp?.(); }}
                        style={dirBtnStyle}
                      >▲</button>
                    </div>
                    <div style={{ gridColumn: '1', pointerEvents: 'auto' }}>
                      <button
                        className="dir-btn_valentine left_valentine"
                        aria-label="Left"
                        onPointerDown={(e) => { e.preventDefault(); gameStateRef.current?.setLeft?.(); }}
                        style={dirBtnStyle}
                      >◀</button>
                    </div>
                    <div style={{ gridColumn: '2', pointerEvents: 'auto' }}>
                      <button
                        className="dir-btn_valentine pause_valentine"
                        aria-label="Pause/Resume"
                        onPointerDown={(e) => { e.preventDefault(); gameStateRef.current?.togglePause?.(); }}
                        style={{ ...dirBtnStyle, fontSize: 18 }}
                      >⏯</button>
                    </div>
                    <div style={{ gridColumn: '3', pointerEvents: 'auto' }}>
                      <button
                        className="dir-btn_valentine right_valentine"
                        aria-label="Right"
                        onPointerDown={(e) => { e.preventDefault(); gameStateRef.current?.setRight?.(); }}
                        style={dirBtnStyle}
                      >▶</button>
                    </div>
                    <div style={{ gridColumn: '2', pointerEvents: 'auto' }}>
                      <button
                        className="dir-btn_valentine down_valentine"
                        aria-label="Down"
                        onPointerDown={(e) => { e.preventDefault(); gameStateRef.current?.setDown?.(); }}
                        style={dirBtnStyle}
                      >▼</button>
                    </div>
                    <div style={{ gridColumn: '3', pointerEvents: 'auto' }}>
                      <button
                        className="dir-btn_valentine restart_valentine"
                        aria-label="Restart"
                        onPointerDown={(e) => { e.preventDefault(); gameStateRef.current?.restart?.(); }}
                        style={{ ...dirBtnStyle, fontSize: 18 }}
                      >↻</button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'settings_valentine' && (
              <section className="settings-section_valentine">
                <h2>
                  <span className="section-icon_valentine">🏮</span>
                  Event Settings
                </h2>
                <div className="settings-options_valentine">
                  <div className="setting-option_valentine">
                    <label>
                      <input
                        type="checkbox"
                        checked={showHearts}
                        onChange={() => setShowHearts(!showHearts)}
                      />
                      Floating Hearts
                    </label>
                  </div>
                  <div className="setting-option_valentine">
                    <label>
                      <input
                        type="checkbox"
                        checked={showLanterns}
                        onChange={() => setShowLanterns(!showLanterns)}
                      />
                      Chinese Lanterns
                    </label>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="event-footer_valentine">
          <div className="footer-content_valentine">
            <p>© {new Date().getFullYear()} {valentineCNYEvent.title}. All rights reserved.</p>
            <div className="footer-decoration_valentine">
              <div className="footer-floral_valentine"></div>
            </div>
          </div>
        </footer>

        {/* Audio element */}
        <audio
          ref={audioRef}
          loop
          src={valentineCNYEvent.audioSrc}
          preload="metadata"
        />
      </div>
    </>
  );
};

// simple inline style for control buttons; you can move this into valentine-cny.css
const dirBtnStyle = {
  width: 56,
  height: 56,
  borderRadius: 14,
  border: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  background: 'linear-gradient(180deg,#fff,#f8f8f8)',
  fontSize: 22,
  cursor: 'pointer',
  userSelect: 'none',
};

export default ValentineCNYEvent;