// Text-to-Speech (Text Reader) Feature for Rise
(function() {
    const buttonColour = '#0070a3';
    const buttonColourInactive = '#636363';
    const buttonSize = '50px';
    let ttsInitialized = false;
    let ttsActive = false;
    function initializeTextReader() {
        if (ttsInitialized) return;
        const synth = window.speechSynthesis;
        if (!synth) {
            console.warn("Rise mods.js: Text-to-Speech not supported by this browser.");
            return;
        }
        const ttsButton = document.createElement('button');
        ttsButton.className = 'tts-toggle-button';
        ttsButton.setAttribute('aria-label', 'Activate text reader');
        ttsButton.setAttribute('title', 'Activate text reader');
        ttsButton.innerHTML = `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" fill=\"${buttonColourInactive}\"><path d=\"M115.008,486.216v-103.76H0V25.784h512v356.672H242.752L115.008,486.216z M32,350.456h115.008V419l84.352-68.544H480V57.784H32V350.456z\"/></svg>`;
        document.body.appendChild(ttsButton);
        const toggleTTS = () => {
            ttsActive = !ttsActive;
            document.body.classList.toggle('tts-active-mode', ttsActive);
            ttsButton.classList.toggle('active', ttsActive);
            if (!ttsActive && synth.speaking) {
                synth.cancel();
            }
        };
        ttsButton.addEventListener('click', toggleTTS);
        document.addEventListener('click', (event) => {
            if (!ttsActive) return;
            const targetBlock = event.target.closest('.block-wrapper');
            if (targetBlock) {
                event.stopPropagation();
                event.preventDefault();
                synth.cancel();
                const textSelector = '.fr-view p, .fr-view li, .fr-view h1, .fr-view h2, .fr-view h3, .fr-view h4, .fr-view h5, .fr-view h6, .block-quote__text, .timeline-card__title, .timeline-card__date, .continue-btn';
                const textElements = targetBlock.querySelectorAll(textSelector);
                if (textElements.length > 0) {
                    const textToSpeak = Array.from(textElements).map(el => el.textContent.trim()).filter(Boolean).join('. ');
                    if (textToSpeak) {
                        const utterance = new SpeechSynthesisUtterance(textToSpeak);
                        synth.speak(utterance);
                    }
                }
            }
        }, true);
        ttsInitialized = true;
    }
    const finalCustomCSS = `
        .tts-toggle-button {
            position: fixed; bottom: 1.2rem; right: 2.6rem;
            width: ${buttonSize}; height: ${buttonSize};
            background-color: #fff; border: 2px solid ${buttonColourInactive};
            border-radius: 50%; cursor: pointer; display: flex; align-items: center;
            justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000; transition: border-color 0.3s ease;
        }
        .tts-toggle-button.active { border-color: ${buttonColour}; border-width: 4px; }
        .tts-toggle-button svg { transition: fill 0.3s ease; padding: 22%; }
        body.tts-active-mode .block-wrapper { cursor: pointer; transition: outline 0.2s ease-out; }
        body.tts-active-mode .block-wrapper:hover {
            outline: 2px solid ${buttonColour};
            outline-offset: 4px;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = finalCustomCSS;
    document.head.appendChild(styleSheet);
    window.addEventListener('load', initializeTextReader);
})();
