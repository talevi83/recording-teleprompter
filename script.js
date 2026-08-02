(() => {
  const editorView = document.getElementById('editor-view');
  const prompterView = document.getElementById('prompter-view');
  const scriptInput = document.getElementById('script-input');

  const fontSizeInput = document.getElementById('font-size');
  const fontSizeValue = document.getElementById('font-size-value');
  const speedInput = document.getElementById('speed');
  const speedValue = document.getElementById('speed-value');
  const lineHeightInput = document.getElementById('line-height');
  const lineHeightValue = document.getElementById('line-height-value');
  const marginInput = document.getElementById('margin');
  const marginValue = document.getElementById('margin-value');
  const directionSelect = document.getElementById('direction-select');
  const mirrorToggle = document.getElementById('mirror-toggle');
  const flipVerticalToggle = document.getElementById('flip-vertical-toggle');

  const startBtn = document.getElementById('start-btn');
  const prompterText = document.getElementById('prompter-text');
  const prompterTextWrapper = document.getElementById('prompter-text-wrapper');
  const prompterControls = document.getElementById('prompter-controls');

  const playPauseBtn = document.getElementById('play-pause-btn');
  const restartBtn = document.getElementById('restart-btn');
  const slowerBtn = document.getElementById('slower-btn');
  const fasterBtn = document.getElementById('faster-btn');
  const speedReadout = document.getElementById('speed-readout');
  const fontSmallerBtn = document.getElementById('font-smaller-btn');
  const fontLargerBtn = document.getElementById('font-larger-btn');
  const exitBtn = document.getElementById('exit-btn');
  const recordBtn = document.getElementById('record-btn');
  const cameraFrame = document.getElementById('camera-frame');
  const cameraPreview = document.getElementById('camera-preview');
  const recIndicator = document.getElementById('rec-indicator');
  const recTimer = document.getElementById('rec-timer');
  const languageSelect = document.getElementById('language-select');

  const STORAGE_KEY = 'teleprompter-settings';

  const i18n = {
    en: {
      title: "Teleprompter",
      placeholder: "Paste or type your script here...",
      textSize: "Text size:",
      scrollSpeed: "Scroll speed:",
      lineSpacing: "Line spacing:",
      sideMargin: "Side margin:",
      textDirection: "Text direction",
      ltr: "Left to right (LTR)",
      rtl: "Right to left (RTL)",
      mirror: "Mirror text (horizontal flip)",
      flipVertical: "Flip vertically",
      startBtn: "Start Teleprompter",
      playPause: "Play/Pause (Space)",
      restart: "Restart to top (R)",
      slower: "Slower (Down arrow)",
      faster: "Faster (Up arrow)",
      smallerText: "Smaller text",
      largerText: "Larger text",
      recBtn: "⏺ Rec",
      stopRecBtn: "⏹ Stop",
      recordTitle: "Record video with sound (V)",
      exitBtn: "✕ Exit",
      exitTitle: "Back to editor (Esc)"
    },
    he: {
      title: "טלפרומפטר",
      placeholder: "הדבק או הקלד את התסריט שלך כאן...",
      textSize: "גודל טקסט:",
      scrollSpeed: "מהירות גלילה:",
      lineSpacing: "ריווח שורות:",
      sideMargin: "שוליים:",
      textDirection: "כיוון תסריט",
      ltr: "משמאל לימין (LTR)",
      rtl: "מימין לשמאל (RTL)",
      mirror: "כתב מראה (היפוך אופקי)",
      flipVertical: "היפוך אנכי",
      startBtn: "התחל טלפרומפטר",
      playPause: "נגן/השהה (רווח)",
      restart: "חזור להתחלה (R)",
      slower: "לאט יותר (חץ למטה)",
      faster: "מהר יותר (חץ למעלה)",
      smallerText: "הקטן טקסט",
      largerText: "הגדל טקסט",
      recBtn: "⏺ הקלטה",
      stopRecBtn: "⏹ עצור",
      recordTitle: "הקלט וידאו עם סאונד (V)",
      exitBtn: "✕ חזור",
      exitTitle: "חזור לעורך (Esc)"
    }
  };

  let state = {
    fontSize: 48,
    speed: 5,
    lineHeight: 1.4,
    margin: 10,
    direction: 'ltr',
    mirror: false,
    flipVertical: false,
    appLang: 'en'
  };

  let isRecording = false; // Moved here to prevent ReferenceError during initialization

  // Restore saved settings
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    Object.assign(state, saved);
  } catch (e) { /* ignore corrupt storage */ }

  function applySettingsToInputs() {
    fontSizeInput.value = state.fontSize;
    fontSizeValue.textContent = state.fontSize;
    speedInput.value = state.speed;
    speedValue.textContent = state.speed;
    lineHeightInput.value = state.lineHeight;
    lineHeightValue.textContent = state.lineHeight;
    marginInput.value = state.margin;
    marginValue.textContent = state.margin;
    directionSelect.value = state.direction;
    scriptInput.dir = state.direction;
    mirrorToggle.checked = state.mirror;
    flipVerticalToggle.checked = state.flipVertical;
    languageSelect.value = state.appLang;
    applyLanguage(state.appLang);
  }

  function applyLanguage(lang) {
    const dict = i18n[lang] || i18n['en'];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.placeholder = dict[key];
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key]) el.title = dict[key];
    });
    
    // Update dynamic record button text if recording state is active
    const recSpan = recordBtn.querySelector('span');
    if (recSpan) recSpan.textContent = isRecording ? dict['stopRecBtn'] : dict['recBtn'];
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function applySettingsToPrompter() {
    prompterText.style.fontSize = state.fontSize + 'px';
    prompterText.style.lineHeight = state.lineHeight;
    prompterText.style.padding = `0 ${state.margin}%`;
    prompterText.dir = state.direction;
    speedReadout.textContent = state.speed;
  }

  applySettingsToInputs();

  fontSizeInput.addEventListener('input', () => {
    state.fontSize = Number(fontSizeInput.value);
    fontSizeValue.textContent = state.fontSize;
    saveSettings();
  });
  speedInput.addEventListener('input', () => {
    state.speed = Number(speedInput.value);
    speedValue.textContent = state.speed;
    saveSettings();
  });
  lineHeightInput.addEventListener('input', () => {
    state.lineHeight = Number(lineHeightInput.value);
    lineHeightValue.textContent = state.lineHeight;
    saveSettings();
  });
  marginInput.addEventListener('input', () => {
    state.margin = Number(marginInput.value);
    marginValue.textContent = state.margin;
    saveSettings();
  });
  directionSelect.addEventListener('change', () => {
    state.direction = directionSelect.value;
    scriptInput.dir = state.direction;
    saveSettings();
  });
  mirrorToggle.addEventListener('change', () => {
    state.mirror = mirrorToggle.checked;
    saveSettings();
  });
  flipVerticalToggle.addEventListener('change', () => {
    state.flipVertical = flipVerticalToggle.checked;
    saveSettings();
  });
  languageSelect.addEventListener('change', () => {
    state.appLang = languageSelect.value;
    applyLanguage(state.appLang);
    saveSettings();
  });

  // ---------- Scrolling engine ----------

  let scrollPos = 0; // px scrolled from start
  let isPlaying = false;
  let lastFrameTime = null;
  let rafId = null;

  function resetScroll() {
    scrollPos = 0;
    updateTransform();
  }

  function updateTransform() {
    // Base translate to bring text up from below the fold, then move up further as scrollPos grows.
    const wrapperHeight = prompterTextWrapper.clientHeight;
    const y = wrapperHeight - scrollPos;
    let transform = `translateY(${y}px)`;
    if (state.mirror && state.flipVertical) transform += ' scale(-1, -1)';
    else if (state.mirror) transform += ' scaleX(-1)';
    else if (state.flipVertical) transform += ' scaleY(-1)';
    prompterText.style.transform = transform;
  }

  function tick(now) {
    if (!isPlaying) return;
    if (lastFrameTime === null) lastFrameTime = now;
    const dt = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    const pixelsPerSecond = state.speed * 25; // tuning factor
    scrollPos += pixelsPerSecond * dt;

    const maxScroll = prompterText.scrollHeight + prompterTextWrapper.clientHeight;
    if (scrollPos >= maxScroll) {
      scrollPos = maxScroll;
      pause();
    }

    updateTransform();
    rafId = requestAnimationFrame(tick);
  }

  function play() {
    if (isPlaying) return;
    isPlaying = true;
    lastFrameTime = null;
    playPauseBtn.textContent = '⏸';
    rafId = requestAnimationFrame(tick);
  }

  function pause() {
    isPlaying = false;
    playPauseBtn.textContent = '▶';
    if (rafId) cancelAnimationFrame(rafId);
  }

  function togglePlay() {
    if (isPlaying) pause();
    else play();
  }

  function changeSpeed(delta) {
    state.speed = Math.min(20, Math.max(1, state.speed + delta));
    speedInput.value = state.speed;
    speedValue.textContent = state.speed;
    speedReadout.textContent = state.speed;
    saveSettings();
  }

  // ---------- Touch/Drag Scrolling ----------
  let isDragging = false;
  let startY = 0;
  let startScrollPos = 0;

  prompterView.addEventListener('touchstart', (e) => {
    isDragging = true;
    startY = e.touches[0].clientY;
    startScrollPos = scrollPos;
    pause(); // Auto-pause when user starts dragging
  }, { passive: true });

  prompterView.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dy = e.touches[0].clientY - startY;
    // If dragging down (positive dy), we want to scroll up (decrease scrollPos)
    scrollPos = Math.max(0, startScrollPos - dy);
    updateTransform();
  }, { passive: true });

  prompterView.addEventListener('touchend', () => {
    isDragging = false;
  });

  function changeFontSize(delta) {
    state.fontSize = Math.min(140, Math.max(16, state.fontSize + delta));
    fontSizeInput.value = state.fontSize;
    fontSizeValue.textContent = state.fontSize;
    prompterText.style.fontSize = state.fontSize + 'px';
    saveSettings();
  }

  // ---------- Camera recording ----------

  let mediaStream = null;
  let mediaRecorder = null;
  let recordedChunks = [];
  let recTimerInterval = null;
  let recStartTime = null;

  const RECORDER_MIME_TYPES = [
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];

  function pickMimeType() {
    return RECORDER_MIME_TYPES.find(
      (type) => window.MediaRecorder && MediaRecorder.isTypeSupported(type)
    );
  }

  function formatTimer(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  function updateRecTimer() {
    recTimer.textContent = formatTimer(Date.now() - recStartTime);
  }

  function downloadRecording(blob, mimeType) {
    const ext = mimeType && mimeType.includes('mp4') ? 'mp4' : 'webm';
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `teleprompter-recording-${stamp}.${ext}`;
    const url = URL.createObjectURL(blob);
    const isHe = state.appLang === 'he';

    // Create a fullscreen overlay for downloading (fixes iOS Safari blockers)
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.95)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';
    if (isHe) overlay.dir = 'rtl';

    const title = document.createElement('h2');
    title.textContent = isHe ? 'ההקלטה הסתיימה!' : 'Recording Finished!';
    title.style.color = '#fff';
    title.style.marginBottom = '24px';

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.textContent = isHe ? '📥 שמור וידאו למכשיר' : '📥 Save Video to Device';
    a.style.padding = '16px 24px';
    a.style.backgroundColor = 'var(--accent)';
    a.style.color = '#000';
    a.style.fontSize = '20px';
    a.style.fontWeight = 'bold';
    a.style.textDecoration = 'none';
    a.style.borderRadius = '8px';
    a.style.marginBottom = '16px';
    a.style.textAlign = 'center';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = isHe ? '✕ סגור' : '✕ Close';
    closeBtn.style.padding = '10px 16px';
    closeBtn.style.backgroundColor = 'transparent';
    closeBtn.style.color = '#fff';
    closeBtn.style.border = '1px solid #fff';
    closeBtn.style.borderRadius = '6px';
    closeBtn.style.fontSize = '16px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.marginTop = '16px';

    closeBtn.onclick = () => {
      document.body.removeChild(overlay);
      URL.revokeObjectURL(url);
    };
    
    a.onclick = () => {
      a.style.display = 'none';
      title.textContent = isHe ? 'נשמר בהצלחה! 🎉' : 'Saved successfully! 🎉';
      title.style.color = 'var(--accent)';
      
      const sub = document.createElement('p');
      sub.textContent = isHe ? 'בדוק בתיקיית ההורדות (Downloads) או באלבום התמונות שלך.' : 'Please check your Downloads folder or Photos app.';
      sub.style.color = '#ddd';
      sub.style.fontSize = '18px';
      sub.style.textAlign = 'center';
      sub.style.maxWidth = '80%';
      overlay.insertBefore(sub, closeBtn);

      setTimeout(() => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
          URL.revokeObjectURL(url);
        }
      }, 5000);
    };

    overlay.appendChild(title);
    overlay.appendChild(a);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
  }

  function releaseCamera() {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
    }
    cameraPreview.srcObject = null;
    cameraFrame.classList.add('hidden');
  }

  async function startRecording() {
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
    } catch (err) {
      alert(`Could not access camera/microphone: ${err.message}`);
      return;
    }

    cameraPreview.srcObject = mediaStream;
    cameraFrame.classList.remove('hidden');

    const mimeType = pickMimeType();
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(mediaStream, mimeType ? { mimeType } : undefined);

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: mimeType || 'video/webm' });
      recordedChunks = [];
      downloadRecording(blob, mimeType);
      releaseCamera();
    };

    mediaRecorder.start();
    isRecording = true;
    recStartTime = Date.now();
    recIndicator.classList.remove('hidden');
    updateRecTimer();
    recTimerInterval = setInterval(updateRecTimer, 500);
    const recSpan = recordBtn.querySelector('span');
    if (recSpan) recSpan.textContent = i18n[state.appLang]['stopRecBtn'];
    recordBtn.classList.add('recording');
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    isRecording = false;
    clearInterval(recTimerInterval);
    recIndicator.classList.add('hidden');
    const recSpan = recordBtn.querySelector('span');
    if (recSpan) recSpan.textContent = i18n[state.appLang]['recBtn'];
    recordBtn.classList.remove('recording');
  }

  function toggleRecording() {
    if (isRecording) stopRecording();
    else startRecording();
  }

  recordBtn.addEventListener('click', toggleRecording);

  // ---------- View switching ----------

  function enterPrompter() {
    const text = scriptInput.value.trim();
    if (!text) {
      scriptInput.focus();
      return;
    }
    prompterText.textContent = text;
    applySettingsToPrompter();
    editorView.classList.add('hidden');
    prompterView.classList.remove('hidden');
    resetScroll();
    // Give layout a tick to settle before enabling scroll math
    requestAnimationFrame(() => requestAnimationFrame(updateTransform));
  }

  function exitPrompter() {
    pause();
    if (isRecording) stopRecording();
    prompterView.classList.add('hidden');
    editorView.classList.remove('hidden');
  }

  startBtn.addEventListener('click', enterPrompter);
  exitBtn.addEventListener('click', exitPrompter);
  playPauseBtn.addEventListener('click', togglePlay);
  restartBtn.addEventListener('click', () => { pause(); resetScroll(); });
  slowerBtn.addEventListener('click', () => changeSpeed(-1));
  fasterBtn.addEventListener('click', () => changeSpeed(1));
  fontSmallerBtn.addEventListener('click', () => changeFontSize(-4));
  fontLargerBtn.addEventListener('click', () => changeFontSize(4));

  window.addEventListener('resize', () => {
    if (!prompterView.classList.contains('hidden')) updateTransform();
  });

  // ---------- Keyboard shortcuts (active only in prompter view) ----------

  document.addEventListener('keydown', (e) => {
    if (prompterView.classList.contains('hidden')) return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowUp':
        e.preventDefault();
        changeSpeed(1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        changeSpeed(-1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        scrollPos = Math.max(0, scrollPos - 200);
        updateTransform();
        break;
      case 'ArrowRight':
        e.preventDefault();
        scrollPos += 200;
        updateTransform();
        break;
      case 'KeyR':
        pause();
        resetScroll();
        break;
      case 'KeyV':
        toggleRecording();
        break;
      case 'Escape':
        exitPrompter();
        break;
    }
  });

  // ---------- Auto-hide controls ----------

  let hideTimer = null;
  function showControls() {
    prompterControls.classList.remove('faded');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (isPlaying) prompterControls.classList.add('faded');
    }, 2500);
  }
  prompterView.addEventListener('mousemove', showControls);
  prompterView.addEventListener('click', showControls);
})();
