// Centre Align Buttons Feature for Rise
(function() {
    const centredButtonHeight = '5rem';
    const finalCustomCSS = `
        .blocks-button__description { display: none !important; }
        .blocks-button__container { max-width: none !important; justify-content: center !important; }
        .blocks-button__button {
            flex: 0 1 auto !important; max-width: 30rem !important; min-width: 15rem !important;
            height: ${centredButtonHeight} !important; line-height: ${centredButtonHeight} !important;
        }`;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = finalCustomCSS;
    document.head.appendChild(styleSheet);
})();
