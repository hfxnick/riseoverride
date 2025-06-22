// Cover Page Padding Feature for Rise
(function() {
    const coverPagePadding = '4rem 7rem';
    const finalCustomCSS = `@media(min-width: 62em) {
        .organic .cover--layout-split-left .cover__header-content,
        .organic .cover--layout-split-left-image .cover__header-content {
            padding-block: ${coverPagePadding} !important;
        }
    }`;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = finalCustomCSS;
    document.head.appendChild(styleSheet);
})();
