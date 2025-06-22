// Custom Button JS/Confetti Feature for Rise
(function() {
    // User should customize these values:
    const buttonId = 'MYSCRIPT01'; // The ID you set in the Rise button URL (e.g. http://MYSCRIPT01)
    const script = `console.log('Button clicked!');`;
    const confetti = false; // true = show confetti, false = no confetti

    function loadConfettiScript() {
        return new Promise((resolve, reject) => {
            if (window.confettiScriptLoaded) return resolve();
            const scriptEl = document.createElement('script');
            scriptEl.src = 'https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js';
            scriptEl.onload = () => { window.confettiScriptLoaded = true; resolve(); };
            scriptEl.onerror = reject;
            document.head.appendChild(scriptEl);
        });
    }
    function fireConfetti() {
        if (!window.confettiScriptLoaded) return;
        const confettiExecutor = typeof tsParticles !== 'undefined' ? tsParticles.confetti : window.confetti;
        if (confettiExecutor) {
            confettiExecutor({
                particleCount: 150,
                spread: 90,
                startVelocity: 45,
                colors: ['#FFC700', '#FF0000', '#2E3191', '#41BBC7'],
                origin: { x: 0.5, y: 0.7 },
                zIndex: 9999
            });
        }
    }
    function setupButton() {
        if (confetti) loadConfettiScript();
        const selector = `a.blocks-button__button[href*="${buttonId}"]:not([data-button-modded="true"])`;
        document.querySelectorAll(selector).forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                if (confetti) fireConfetti();
                if (script) {
                    try { new Function(script)(); } catch (e) { console.error(`Error in script for "${buttonId}":`, e); }
                }
            });
            button.dataset.buttonModded = 'true';
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupButton);
    } else {
        setupButton();
    }
})();
