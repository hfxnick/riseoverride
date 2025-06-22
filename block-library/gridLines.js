// Grid Lines Feature for Rise
(function() {
    const backgroundColour = '#fdfdfd';
    const gridLineColour = 'rgba(0, 0, 0, 0.04)';
    const gridSize = 30;
    let bgLayers = [], bgSizes = [], bgPositions = [], bgRepeats = [];
    bgLayers.push(`linear-gradient(${gridLineColour} 1px, transparent 1px)`);
    bgSizes.push(`${gridSize}px ${gridSize}px`);
    bgPositions.push('top left'); bgRepeats.push('repeat');
    bgLayers.push(`linear-gradient(90deg, ${gridLineColour} 1px, transparent 1px)`);
    bgSizes.push(`${gridSize}px ${gridSize}px`);
    bgPositions.push('top left'); bgRepeats.push('repeat');
    bgLayers.reverse(); bgSizes.reverse(); bgPositions.reverse(); bgRepeats.reverse();
    let pageWrapCSS = `background-color: ${backgroundColour}; background-attachment: fixed;`;
    if (bgLayers.length > 0) {
        pageWrapCSS += `background-image: ${bgLayers.join(', ')}; background-size: ${bgSizes.join(', ')}; background-position: ${bgPositions.join(', ')}; background-repeat: ${bgRepeats.join(', ')};`;
    }
    let finalCustomCSS = `#page-wrap { ${pageWrapCSS} } .page__wrapper--white, .page__header, .blocks-lesson, .lesson-nav--full { background: transparent !important; }`;
    if (finalCustomCSS) {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = finalCustomCSS;
        document.head.appendChild(styleSheet);
    }
})();
