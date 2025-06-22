// Modernise Menu Button Feature for Rise
(function() {
    const blur = '1px';
    const opacity = 0.1;
    const shadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    const hoverScale = 1.1;
    const finalCustomCSS = `
        .nav-control__button {
            background: rgba(255, 255, 255, ${opacity}) !important;
            backdrop-filter: blur(${blur}) !important;
            -webkit-backdrop-filter: blur(${blur}) !important;
            box-shadow: ${shadow} !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 8px !important;
            transition: transform 0.2s ease-in-out !important;
        }
        .nav-control__button:hover { transform: scale(${hoverScale}) !important; }
        .nav-control__button svg { will-change: transform; transform: translateZ(0); }`;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = finalCustomCSS;
    document.head.appendChild(styleSheet);
})();
