// Replace Continue With Line Feature for Rise
(function() {
    const continueLineColour = '#d4d4d4';
    const continueLineWidth = '80%';
    function replaceContinueWithLine() {
        const continueIndicators = document.querySelectorAll('[data-continue-sr]');
        continueIndicators.forEach(indicator => {
            const continueBlock = indicator.closest('.noOutline[data-block-id]');
            if (!continueBlock) return;
            if (continueBlock.classList.contains('continue-divider-mod')) return;
            const hasButton = continueBlock.querySelector('.continue-btn');
            if (!hasButton) {
                continueBlock.classList.add('continue-divider-mod');
                const wrapper = continueBlock.querySelector('.block-wrapper');
                if (wrapper) wrapper.style.display = 'none';
            }
        });
    }
    const finalCustomCSS = `
        .continue-divider-mod {
            padding: 0 !important; height: 0px !important; margin: 3rem auto !important;
            border-top: 1px solid ${continueLineColour} !important;
            width: ${continueLineWidth} !important;
        }`;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = finalCustomCSS;
    document.head.appendChild(styleSheet);
    window.addEventListener('load', replaceContinueWithLine);
})();
