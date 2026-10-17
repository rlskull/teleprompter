(() => {
  const input = document.querySelector('#scriptInput');
  const readingWindow = document.querySelector('#readingWindow');
  const readingText = document.querySelector('#readingText');
  const playButton = document.querySelector('#playButton');
  const playLabel = document.querySelector('#playLabel');
  const restartButton = document.querySelector('#restartButton');
  const clearButton = document.querySelector('#clearButton');
  const mirrorButton = document.querySelector('#mirrorButton');
  const fullscreenButton = document.querySelector('#fullscreenButton');
  const fullscreenLabel = document.querySelector('#fullscreenLabel');
  const speedInput = document.querySelector('#speedInput');
  const speedValue = document.querySelector('#speedValue');
  const fontInput = document.querySelector('#fontInput');
  const fontValue = document.querySelector('#fontValue');
  const wordCount = document.querySelector('#wordCount');
  const progressText = document.querySelector('#progressText');
  const readerState = document.querySelector('#readerState');
  const liveIndicator = document.querySelector('#liveIndicator');
  const STORAGE_KEY = 'roteiro-teleprompter-script';

  let isPlaying = false;
  let offset = 0;
  let animationFrame = 0;
  let previousTime = 0;
  let mirrored = false;
  const readingLine = 0.4;

  function wordTotal(text) {
    const words = text.trim().match(/\S+/g) || [];
    return `${words.length} ${words.length === 1 ? 'palavra' : 'palavras'}`;
  }

  function setSliderFill(slider) {
    const percent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(90deg, var(--accent) ${percent}%, #3a3c43 ${percent}%)`;
  }

  function updateProgress() {
    const maxOffset = Math.max(0, readingText.scrollHeight - readingWindow.clientHeight * readingLine);
    const percent = maxOffset > 0 ? Math.min(100, Math.round((offset / maxOffset) * 100)) : 0;
    progressText.textContent = `${percent}% concluído`;
  }

  function stop() {
    isPlaying = false;
    cancelAnimationFrame(animationFrame);
    previousTime = 0;
    playButton.classList.remove('is-playing');
    playButton.setAttribute('aria-label', 'Começar leitura');
    playLabel.textContent = 'Começar leitura';
    readerState.textContent = 'PRONTO PARA LER';
    liveIndicator.classList.remove('playing');
  }

  function tick(time) {
    if (!isPlaying) return;
    if (previousTime) offset += (time - previousTime) * Number(speedInput.value) / 1000;
    previousTime = time;
    const maxOffset = Math.max(0, readingText.scrollHeight - readingWindow.clientHeight * readingLine);
    if (offset >= maxOffset) {
      offset = maxOffset;
      stop();
    }
    readingText.style.transform = `translateY(${readingWindow.clientHeight * readingLine - offset}px)${mirrored ? ' scaleX(-1)' : ''}`;
    updateProgress();
    if (isPlaying) animationFrame = requestAnimationFrame(tick);
  }

  function start() {
    if (!input.value.trim()) {
      input.focus();
      return;
    }
    if (offset >= Math.max(0, readingText.scrollHeight - readingWindow.clientHeight * readingLine)) offset = 0;
    isPlaying = true;
    playButton.classList.add('is-playing');
    playButton.setAttribute('aria-label', 'Pausar leitura');
    playLabel.textContent = 'Pausar leitura';
    readerState.textContent = 'LEITURA EM ANDAMENTO';
    liveIndicator.classList.add('playing');
    animationFrame = requestAnimationFrame(tick);
  }

  function togglePlayback() {
    if (isPlaying) stop();
    else start();
  }

  function renderText() {
    const text = input.value.trim();
    wordCount.textContent = wordTotal(input.value);
    try { localStorage.setItem(STORAGE_KEY, input.value); } catch (_) { /* Storage may be disabled. */ }
    stop();
    offset = 0;
    readingText.style.transform = `translateY(${readingWindow.clientHeight * readingLine}px)${mirrored ? ' scaleX(-1)' : ''}`;
    if (text) {
      readingText.textContent = text;
      readingText.classList.remove('is-empty');
    } else {
      readingText.innerHTML = '<span class="placeholder-icon" aria-hidden="true">✳</span><p>Seu roteiro aparecerá aqui.</p><span class="placeholder-caption">Adicione seu texto ao lado para começar.</span>';
    }
    updateProgress();
  }

  input.addEventListener('input', renderText);
  playButton.addEventListener('click', togglePlayback);
  restartButton.addEventListener('click', () => {
    stop();
    offset = 0;
    readingText.style.transform = `translateY(${readingWindow.clientHeight * readingLine}px)${mirrored ? ' scaleX(-1)' : ''}`;
    updateProgress();
  });
  clearButton.addEventListener('click', () => {
    input.value = '';
    renderText();
    input.focus();
  });
  mirrorButton.addEventListener('click', () => {
    mirrored = !mirrored;
    mirrorButton.setAttribute('aria-pressed', String(mirrored));
    readingText.style.transform = `translateY(${readingWindow.clientHeight * readingLine - offset}px)${mirrored ? ' scaleX(-1)' : ''}`;
  });
  fullscreenButton.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.querySelector('.reader-panel').requestFullscreen();
    } catch (_) {
      readerState.textContent = 'TELA CHEIA INDISPONÍVEL NESTE NAVEGADOR';
      window.setTimeout(() => { if (!isPlaying) readerState.textContent = 'PRONTO PARA LER'; }, 2500);
    }
  });
  document.addEventListener('fullscreenchange', () => {
    const active = document.fullscreenElement === document.querySelector('.reader-panel');
    fullscreenButton.setAttribute('aria-pressed', String(active));
    fullscreenButton.title = active ? 'Sair da tela cheia' : 'Abrir leitura em tela cheia';
    fullscreenLabel.textContent = active ? 'Sair da tela cheia' : 'Tela cheia';
    requestAnimationFrame(() => {
      readingText.style.transform = `translateY(${readingWindow.clientHeight * readingLine - offset}px)${mirrored ? ' scaleX(-1)' : ''}`;
      updateProgress();
    });
  });
  speedInput.addEventListener('input', () => {
    const value = Number(speedInput.value);
    speedValue.textContent = value < 32 ? 'Lenta' : value < 70 ? 'Média' : 'Rápida';
    setSliderFill(speedInput);
  });
  fontInput.addEventListener('input', () => {
    document.documentElement.style.setProperty('--font-size', `${fontInput.value}px`);
    fontValue.textContent = `${fontInput.value} px`;
    setSliderFill(fontInput);
    updateProgress();
  });
  document.addEventListener('keydown', (event) => {
    const typing = event.target.matches('textarea, input, [contenteditable="true"]');
    if (!typing && event.code === 'Space') {
      event.preventDefault();
      togglePlayback();
    }
    if (!typing && event.key.toLowerCase() === 'r') restartButton.click();
    if (event.key === 'Escape' && isPlaying) stop();
  });
  window.addEventListener('resize', () => {
    readingText.style.transform = `translateY(${readingWindow.clientHeight * readingLine - offset}px)${mirrored ? ' scaleX(-1)' : ''}`;
    updateProgress();
  });

  try { input.value = localStorage.getItem(STORAGE_KEY) || ''; } catch (_) { input.value = ''; }
  setSliderFill(speedInput);
  setSliderFill(fontInput);
  renderText();
  readingText.style.transform = `translateY(${readingWindow.clientHeight * readingLine}px)`;
})();
