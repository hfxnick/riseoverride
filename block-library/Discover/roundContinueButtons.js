// Round Continue Buttons Feature for Rise
(function() {
    const continueButton_BorderRadius = '50px';
    const finalCustomCSS = `.continue-btn { border-radius: ${continueButton_BorderRadius} !important; }`;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = finalCustomCSS;
    document.head.appendChild(styleSheet);
})();
