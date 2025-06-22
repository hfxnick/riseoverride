// Reflection Shortcode Feature for Rise
(function() {
    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    function runShortcodeReplacement() {
        const contentAreas = document.querySelectorAll('.fr-view.rise-tiptap');
        if (!contentAreas.length) return;
        const shortcodeRegex = /\[([A-Z0-9_]+)\]/g;
        contentAreas.forEach(area => {
            if (shortcodeRegex.test(area.innerHTML) && !area.querySelector('.summary-shortcode-text')) {
                area.innerHTML = area.innerHTML.replace(shortcodeRegex, (match, shortcodeId) => {
                    const storageKey = `reflection-${shortcodeId}`;
                    const savedData = localStorage.getItem(storageKey);
                    const replacementText = savedData ? escapeHtml(atob(savedData)) : 'You may not have yet provided an answer to this reflection activity. You can go back and complete this now if you wish.';
                    return `<span class=\"summary-shortcode-text\" data-shortcode-id=\"${shortcodeId}\">${replacementText.replace(/\n/g, '<br>')}</span>`;
                });
            }
        });
    }
    const finalCustomCSS = `
        .summary-shortcode-text {
            font-style: italic; background-color: #f0f0f0; padding: 0.2rem 0.6rem;
            border-radius: 4px; border: 1px solid #e0e0e0; white-space: pre-wrap;
        }`;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = finalCustomCSS;
    document.head.appendChild(styleSheet);
    window.addEventListener('load', runShortcodeReplacement);
})();
