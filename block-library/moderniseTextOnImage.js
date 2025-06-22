// Modernise Text on Image Feature for Rise
(function() {
    const textBlockWidth = '90%';
    const padding = '4rem 7rem';
    const glassEffect = false;
    const glassBlur = '6px';
    const glassBackground = 'rgba(255, 255, 255, 0.2)';
    const dropShadow = false;
    const shadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    const customHeadlineFont = false;
    const headlineFontFamily = "'Architects Daughter', cursive";
    let glassEffectCSS = glassEffect ? `background: ${glassBackground} !important; backdrop-filter: blur(${glassBlur}) !important; -webkit-backdrop-filter: blur(${glassBlur}) !important; border: 1px solid rgba(255, 255, 255, 0.18);` : '';
    let dropShadowCSS = dropShadow ? `box-shadow: ${shadow} !important;` : '';
    let finalCustomCSS = `
        .block-image--overlay .block-image__paragraph {
            ${glassEffectCSS}
            ${dropShadowCSS}
            padding: ${padding} !important;
            border-radius: 8px;
        }
        @media(min-width: 48em) {
            .block-image--overlay .block-image__col {
                width: ${textBlockWidth} !important;
            }
        }
        .block-image--overlay .block-image__paragraph:before {
            display: none !important;
        }
    `;
    if (customHeadlineFont) {
        finalCustomCSS += `
            .block-image__paragraph.brand--linkColor p:first-of-type {
                font-family: ${headlineFontFamily} !important;
            }`;
    }
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = finalCustomCSS;
    document.head.appendChild(styleSheet);
})();
