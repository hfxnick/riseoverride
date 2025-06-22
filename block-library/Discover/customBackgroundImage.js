// Custom Background Image Feature for Rise
(function() {
    const backgroundColour = '#fdfdfd';
    const backgroundImageUrl = 'https://images.unsplash.com/photo-1749371930388-50c782b0acea?fm=jpg&q=60&w=3000';
    const backgroundImageOpacity = 0.1;
    let bgLayers = [], bgSizes = [], bgPositions = [], bgRepeats = [];
    bgLayers.push(`url('${backgroundImageUrl}')`);
    bgSizes.push('cover'); bgPositions.push('center center'); bgRepeats.push('no-repeat');
    const overlayOpacity = 1 - backgroundImageOpacity;
    let r=0, g=0, b=0;
    let color = backgroundColour;
    if (color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
        let hex = color.substring(1).split('');
        if (hex.length === 3) { hex = [hex[0], hex[0], hex[1], hex[1], hex[2], hex[2]]; }
        hex = '0x' + hex.join('');
        r = (hex>>16)&255; g = (hex>>8)&255; b = hex&255;
    }
    bgLayers.push(`linear-gradient(rgba(${r},${g},${b},${overlayOpacity}), rgba(${r},${g},${b},${overlayOpacity}))`);
    bgSizes.push('auto'); bgPositions.push('center center'); bgRepeats.push('no-repeat');
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
