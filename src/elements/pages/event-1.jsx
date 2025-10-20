import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import './css/christmas.css';
import eventData from '../json/events.json';
import NavMobile from './landing-page/Nav-mobile.jsx'
import Header from './landing-page/Header.jsx'
import { FaPlay, FaPause } from "react-icons/fa";

const ChristmasEvent = () => {
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
  const [activeTab, setActiveTab] = useState('about');
  const [showSnow, setShowSnow] = useState(true);
  const [showLights, setShowLights] = useState(true);

  // Refs
  const audioRef = useRef(null);
  const lightsRef = useRef(null);

  // Game refs/state
  const gameCanvasRef = useRef(null);
  const gameRAFRef = useRef(null);
  const gameStateRef = useRef(null); // mutable state for game loop

  // Get event data from JSON
  const christmasEvent = eventData.events.christmas;

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

  // Snowflakes (pure CSS/HTML)
  const renderSnowflakes = () => {
    if (!showSnow) return null;
    const flakes = [];
    for (let i = 0; i < 10; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        animationDuration: `${5 + Math.random() * 10}s`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.5 + 0.5,
        fontSize: `${Math.random() * 10 + 10}px`,
      };
      flakes.push(
        <div key={i} className="snowflake" style={style}>
          {['❄', '❅', '❆'][Math.floor(Math.random() * 3)]}
        </div>
      );
    }
    return flakes;
  };

  // Twinkling lights (pure CSS/HTML)
  useEffect(() => {
    if (!showLights || !lightsRef.current) return;
    const container = lightsRef.current;
    const lightCount = Math.random(10, 15);
    while (container.firstChild) container.removeChild(container.firstChild);
    for (let i = 0; i < lightCount; i++) {
      const light = document.createElement('div');
      light.className = 'christmas-light';
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const colors = ['#ff0000', '#00ff00', '#ffff00', '#ff00ff', '#00ffff'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      light.style.left = `${posX}%`;
      light.style.top = `${posY}%`;
      light.style.backgroundColor = color;
      light.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(light);
    }
    return () => {
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, [showLights]);

  // Image loading handler
  const handleImageLoad = useCallback((index) => {
    setLoadedImages(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  // ========= GAME: Christmas Run =========
  const startGame = useCallback(() => {
    const canvas = gameCanvasRef.current;
    if (!canvas) return;

    // HiDPI scaling
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const baseWidth = 800;
    const baseHeight = 220; // a bit taller for ground/snow
    canvas.style.width = '100%';
    canvas.width = baseWidth * dpr;
    canvas.height = baseHeight * dpr;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels

    const GRAVITY = 0.6;
    const JUMP_VELOCITY = -11.5;
    const GROUND_Y = 180; // baseline
    const GROUND_HEIGHT = 4;

    // Player (Santa)
    const santa = {
      x: 60,
      y: GROUND_Y - 36,
      width: 40,
      height: 36,
      vy: 0,
      isOnGround: true,
      hatWave: 0,
    };

    // World
    let obstacles = [];
    let particles = []; // snow particles foreground
    let score = 0;
    let best = Number(localStorage.getItem('christmas_run_best') || 0);
    let speed = 6; // increases over time
    let spawnTimer = 0;
    let spawnInterval = 90; // frames
    let gameOver = false;
    let started = true;

    // Input
    let pressed = false;
    const jump = () => {
      if (gameOver) return;
      if (santa.isOnGround) {
        santa.vy = JUMP_VELOCITY;
        santa.isOnGround = false;
      }
    };

    const onKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        if (!started) {
          started = true;
        }
        if (gameOver) {
          // restart
          obstacles = [];
          particles = [];
          score = 0;
          speed = 6;
          spawnTimer = 0;
          spawnInterval = 90;
          gameOver = false;
          santa.y = GROUND_Y - santa.height;
          santa.vy = 0;
          santa.isOnGround = true;
        } else {
          jump();
        }
      }
    };

    const onPointerDown = (e) => {
      e.preventDefault();
      pressed = true;
      if (gameOver) {
        // restart
        obstacles = [];
        particles = [];
        score = 0;
        speed = 6;
        spawnTimer = 0;
        spawnInterval = 90;
        gameOver = false;
        santa.y = GROUND_Y - santa.height;
        santa.vy = 0;
        santa.isOnGround = true;
      } else {
        jump();
      }
    };
    const onPointerUp = () => { pressed = false; };

    window.addEventListener('keydown', onKeyDown);
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    // Helpers: drawing
    const drawBackground = () => {
      // sky
      ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--christmas-dark') || '#1a1a2e';
      ctx.fillRect(0, 0, baseWidth, baseHeight);

      // distant snow (parallax)
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 40; i++) {
        const x = (i * 21 + (score * 0.2)) % (baseWidth + 30) - 30;
        const y = 40 + (i * 7 % 60);
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ground gradient
      const grd = ctx.createLinearGradient(0, GROUND_Y, 0, baseHeight);
      grd.addColorStop(0, '#e8f6ff');
      grd.addColorStop(1, '#ffffff');
      ctx.fillStyle = grd;
      ctx.fillRect(0, GROUND_Y, baseWidth, baseHeight - GROUND_Y);

      // ground line
      ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--christmas-gold') || '#f1c40f';
      ctx.fillRect(0, GROUND_Y, baseWidth, GROUND_HEIGHT);
    };

    const drawSanta = () => {
      const { x, y, width, height } = santa;

      // body (red coat)
      ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--christmas-red') || '#e74c3c';
      ctx.fillRect(x + 6, y + 8, width - 12, height - 8);

      // face
      ctx.fillStyle = '#ffd7b5';
      ctx.fillRect(x + width / 2 - 8, y + 6, 16, 16);

      // beard (white)
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(x + width / 2 - 10, y + 16);
      ctx.quadraticCurveTo(x + width / 2, y + 30, x + width / 2 + 10, y + 16);
      ctx.closePath();
      ctx.fill();

      // belt (gold)
      ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--christmas-gold') || '#f1c40f';
      ctx.fillRect(x + 6, y + height - 14, width - 12, 4);

      // hat (red + white)
      santa.hatWave += 0.2;
      const hatTilt = Math.sin(santa.hatWave) * 2;
      ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--christmas-red') || '#e74c3c';
      ctx.beginPath();
      ctx.moveTo(x + width / 2 - 12 + hatTilt, y + 6);
      ctx.lineTo(x + width / 2 + 12 + hatTilt, y + 6);
      ctx.lineTo(x + width / 2 + 2 + hatTilt, y - 10);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.fillRect(x + width / 2 - 12 + hatTilt, y + 6, 24, 3); // hat trim
      ctx.beginPath();
      ctx.arc(x + width / 2 + 2 + hatTilt, y - 10, 3, 0, Math.PI * 2);
      ctx.fill(); // pom-pom

      // boots
      ctx.fillStyle = '#222';
      ctx.fillRect(x + 8, y + height - 6, 10, 6);
      ctx.fillRect(x + width - 18, y + height - 6, 10, 6);
    };

    const spawnObstacle = () => {
      // obstacle types: tree or gift
      const isTree = Math.random() < 0.6;
      if (isTree) {
        const h = 24 + Math.floor(Math.random() * 24);
        obstacles.push({
          type: 'tree',
          x: baseWidth + 20,
          y: GROUND_Y,
          w: 18 + Math.floor(Math.random() * 8),
          h,
        });
      } else {
        // gift box
        obstacles.push({
          type: 'gift',
          x: baseWidth + 20,
          y: GROUND_Y - 16,
          w: 18,
          h: 16,
        });
      }
    };

    const drawObstacle = (o) => {
      if (o.type === 'tree') {
        // trunk
        ctx.fillStyle = '#8b5a2b';
        ctx.fillRect(o.x + o.w / 2 - 3, o.y - o.h, 6, 8);
        // triangle foliage
        ctx.fillStyle = getComputedStyle(document.documentElement)
          .getPropertyValue('--christmas-green') || '#2ecc71';
        ctx.beginPath();
        ctx.moveTo(o.x, o.y - 8);
        ctx.lineTo(o.x + o.w, o.y - 8);
        ctx.lineTo(o.x + o.w / 2, o.y - o.h);
        ctx.closePath();
        ctx.fill();

        // tiny ornament
        ctx.fillStyle = getComputedStyle(document.documentElement)
          .getPropertyValue('--christmas-gold') || '#f1c40f';
        ctx.beginPath();
        ctx.arc(o.x + o.w / 2, o.y - o.h + 6, 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // gift
        ctx.fillStyle = getComputedStyle(document.documentElement)
          .getPropertyValue('--christmas-blue') || '#3498db';
        ctx.fillRect(o.x, o.y - o.h, o.w, o.h);

        // ribbon
        ctx.fillStyle = getComputedStyle(document.documentElement)
          .getPropertyValue('--christmas-gold') || '#f1c40f';
        ctx.fillRect(o.x + o.w / 2 - 2, o.y - o.h, 4, o.h);
        ctx.fillRect(o.x, o.y - o.h / 2 - 2, o.w, 4);
      }
    };

    const addSnowParticle = () => {
      particles.push({
        x: Math.random() * baseWidth,
        y: -10,
        r: 1 + Math.random() * 2,
        vy: 1 + Math.random() * 1.5,
        vx: -speed * 0.15,
        life: 300 + Math.random() * 200,
      });
    };

    const drawParticles = () => {
      ctx.fillStyle = '#fff';
      particles.forEach(p => {
        ctx.globalAlpha = Math.max(0.3, Math.min(1, p.life / 400));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    };

    const rectsOverlap = (ax, ay, aw, ah, bx, by, bw, bh) =>
      ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;

    const loop = () => {
      // save loop handle for cleanup
      gameRAFRef.current = requestAnimationFrame(loop);

      drawBackground();

      // spawn particles (snow)
      if (Math.random() < 0.6) addSnowParticle();

      // update particles
      particles.forEach(p => {
        p.x += p.vx * 0.5;
        p.y += p.vy;
        p.life -= 1;
      });
      particles = particles.filter(p => p.life > 0 && p.y < baseHeight + 10);

      // update santa
      santa.y += santa.vy;
      santa.vy += GRAVITY;
      if (santa.y + santa.height >= GROUND_Y) {
        santa.y = GROUND_Y - santa.height;
        santa.vy = 0;
        santa.isOnGround = true;
      }

      // spawn obstacles
      spawnTimer++;
      if (spawnTimer >= spawnInterval) {
        spawnTimer = 0;
        spawnObstacle();
        // make it a bit random
        if (Math.random() < 0.3) spawnTimer -= 20;
      }

      // move & draw obstacles
      obstacles.forEach(o => {
        o.x -= speed;
        drawObstacle(o);
      });
      obstacles = obstacles.filter(o => o.x + (o.w || 0) > -30);

      // collision
      for (let o of obstacles) {
        const ox = o.x;
        const oy = o.type === 'tree' ? o.y - o.h : o.y - o.h;
        const ow = o.w;
        const oh = o.h;
        if (rectsOverlap(santa.x, santa.y, santa.width, santa.height, ox, oy, ow, oh)) {
          gameOver = true;
          break;
        }
      }

      // draw santa after obstacles for clarity
      drawSanta();

      // score & difficulty
      if (!gameOver) {
        score += 1;
        if (score % 180 === 0) {
          speed = Math.min(speed + 0.5, 15);
          spawnInterval = Math.max(55, spawnInterval - 2);
        }
      } else {
        best = Math.max(best, score);
        localStorage.setItem('christmas_run_best', String(best));
      }

      // HUD
      ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--christmas-gold') || '#f1c40f';
      ctx.font = '18px Poppins, sans-serif';
      ctx.fillText(`Score: ${score}`, 10, 24);
      ctx.fillText(`Best: ${best}`, 10, 44);

      if (gameOver) {
        // overlay
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, baseWidth, baseHeight);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 26px var(--font-primary), cursive';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over ❄', baseWidth / 2, baseHeight / 2 - 10);
        ctx.font = '16px Poppins, sans-serif';
        ctx.fillText('Press Space / Tap to Restart', baseWidth / 2, baseHeight / 2 + 18);
        ctx.textAlign = 'start';
      }
    };

    // expose for cleanup (not strictly needed but handy)
    gameStateRef.current = {
      stop: () => {
        if (gameRAFRef.current) cancelAnimationFrame(gameRAFRef.current);
        window.removeEventListener('keydown', onKeyDown);
        canvas.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointerup', onPointerUp);
      },
    };

    loop();
  }, []);

  // Mount/unmount game when tab opens/closes
  useEffect(() => {
    if (activeTab === 'game') {
      startGame();
      const handleResize = () => {
        // restart to rescale
        if (gameStateRef.current) gameStateRef.current.stop?.();
        startGame();
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        if (gameStateRef.current) gameStateRef.current.stop?.();
      };
    } else {
      // ensure game loop cleaned if user switches tabs
      if (gameStateRef.current) gameStateRef.current.stop?.();
    }
  }, [activeTab, startGame]);

  return (
    <>
    <NavMobile />
    <Header />
    <div className="christmas-event">
      {/* Snowfall effect */}
      <div className="snowfall-container">
        {renderSnowflakes()}
      </div>

      {/* Twinkling lights */}
      <div className="christmas-lights" ref={lightsRef}></div>

      {/* Header with cover art and player */}
      <header className="event-header">
        <div className="header-content">
          <div className="cover-art-container">
            <img
              src={christmasEvent.coverImage}
              alt={`${christmasEvent.title} Cover`}
              className={`cover-art ${coverImageLoaded ? 'loaded' : 'loading'}`}
              onLoad={() => setCoverImageLoaded(true)}
            />
            {!coverImageLoaded && (
              <div className="cover-art-placeholder">
                <span className="placeholder-icon">🎄</span>
              </div>
            )}
            <div className="cover-art-decoration">
              <span className="star-decoration">★</span>
              <div className="holly-decoration"></div>
            </div>
          </div>

          <div className="event-info">
            <h1 className="event-title">
              <span className="title-text">{christmasEvent.title}</span>
            </h1>
            <p className="event-subtitle">{christmasEvent.subtitle}</p>
          </div>

          <div className="audio-player">
            <div className="progress-container">
              <input
                type="range"
                className="progress-bar"
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
              <div className="time-display">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="player-controls">
              <button className="control-btn" aria-label="Previous track">
                <span>⏮</span>
              </button>
              <button
                className={`control-btn play-btn ${isPlaying ? 'playing' : ''}`}
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                <span>{isPlaying ? <FaPause /> : <FaPlay />}</span>
              </button>
              <button className="control-btn" aria-label="Next track">
                <span>⏭</span>
              </button>

              {/* <div className="volume-control">
                <button
                  className="mute-btn"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  <span>{isMuted ? '🔇' : '🔊'}</span>
                </button>
                <input
                  type="range"
                  className="volume-slider"
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

        <div className="header-decoration">
          <div className="ornament left"></div>
          <div className="ornament right"></div>
          <div className="garland"></div>
        </div>
      </header>

      {/* Main content area */}
      <main className="event-main">
        <nav className="content-nav">
          <button
            className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery
          </button>
          <button
            className={`nav-btn ${activeTab === 'game' ? 'active' : ''}`}
            onClick={() => setActiveTab('game')}
          >
            Game
          </button>
          <button
            className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>

        <div className="content-container">
          {activeTab === 'about' && (
            <section className="about-section">
              <h2>
                <span className="section-icon">❄</span>
                About This Event
                <span className="section-icon">❄</span>
              </h2>

              <p>
                Welcome to the annual <strong>Christmas Celebration</strong> — a magical gathering filled with joy, warmth, and festive spirit. 
                This event is more than just a holiday party; it’s a chance to come together, share memories, and create new traditions.
              </p>
            </section>
          )}

          {activeTab === 'gallery' && (
            <section className="gallery-section">
              <h2>
                <span className="section-icon">❄</span>
                Event Gallery
              </h2>
              <div className="gallery-grid">
                {christmasEvent.galleryImages.map((img, index) => (
                  <div
                    className="gallery-item"
                    key={index}
                    style={{ '--delay': `${index * 0.1}s` }}
                  >
                    {!loadedImages.has(index) && (
                      <div className="image-placeholder">
                        <span className="placeholder-icon">🎁</span>
                      </div>
                    )}
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading={index < 3 ? "eager" : "lazy"}
                      className={`gallery-image ${loadedImages.has(index) ? 'loaded' : 'loading'}`}
                      onLoad={() => handleImageLoad(index)}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'game' && (
            <section className="game-section">
              <h2>
                <span className="section-icon">❄</span>
                Christmas Run
              </h2>
              <p className="game-hint">Press <b>Space</b> / <b>↑</b> / <b>W</b> or <b>tap</b> the canvas to jump. Avoid trees 🎄 and gifts 🎁</p>
              <div className="game-container">
                <canvas ref={gameCanvasRef} className="christmas-game-canvas"></canvas>
              </div>
            </section>
          )}

          {activeTab === 'settings' && (
            <section className="settings-section">
              <h2>
                <span className="section-icon">❄</span>
                Event Settings
              </h2>
              <div className="settings-options">
                <div className="setting-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={showSnow}
                      onChange={() => setShowSnow(!showSnow)}
                    />
                    Snow Effect
                  </label>
                </div>
                <div className="setting-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={showLights}
                      onChange={() => setShowLights(!showLights)}
                    />
                    Twinkling Lights
                  </label>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="event-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} {christmasEvent.title}. All rights reserved.</p>
          <div className="footer-decoration">
            <div className="footer-holly"></div>
          </div>
        </div>
      </footer>

      {/* Audio element */}
      <audio
        ref={audioRef}
        loop
        src={christmasEvent.audioSrc}
        preload="metadata"
      />
    </div>
    </>
  );
};

export default ChristmasEvent;
