// Custom Background Feature for Rise
(function() {
    const backgroundColour = '#fdfdfd';
    let finalCustomCSS = `#page-wrap { background-color: ${backgroundColour}; background-attachment: fixed; } .page__wrapper--white, .page__header, .blocks-lesson, .lesson-nav--full { background: transparent !important; }`;
    if (finalCustomCSS) {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = finalCustomCSS;
        document.head.appendChild(styleSheet);
    }
})();
