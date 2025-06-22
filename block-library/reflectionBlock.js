// Reflection Block Feature for Rise
(function() {
    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    function updateShortcodeDisplay(reflectionId) {
        const storageKey = `reflection-${reflectionId}`;
        const savedData = localStorage.getItem(storageKey);
        const replacementText = savedData ? escapeHtml(atob(savedData)) : 'You may not have yet provided an answer to this reflection activity. You can go back and complete this now if you wish.';
        const targetSpans = document.querySelectorAll(`.summary-shortcode-text[data-shortcode-id="${reflectionId}"]`);
        targetSpans.forEach(span => { span.innerHTML = replacementText.replace(/\n/g, '<br>'); });
    }
    function runReflectionBlock() {
        document.querySelectorAll('.block-statement--note:not([data-reflection-modded="true"])').forEach(noteBlock => {
            const blockText = noteBlock.textContent;
            if (blockText.includes('REFLECTION ID=')) {
                noteBlock.dataset.reflectionModded = 'true';
                const idMatch = blockText.match(/ID="([^"]+)"/);
                if (!idMatch) return;
                const reflectionId = idMatch[1];
                const storageKey = `reflection-${reflectionId}`;
                const titleMatch = blockText.match(/TITLE="([^"]+)"/);
                const instructionMatch = blockText.match(/INSTRUCTION="([^"]+)"/);
                const title = titleMatch ? titleMatch[1] : 'Reflection';
                const instruction = instructionMatch ? instructionMatch[1] : 'Enter your thoughts below:';
                const alignmentClass = false ? 'reflection-block--centred' : '';
                const reflectionHTML = `<div class="reflection-block ${alignmentClass}"><h3>${title}</h3><p>${instruction}</p><textarea class="reflection-textarea" placeholder="Type your response here..."></textarea><button class="reflection-save-btn">Save My Answer</button><div class="reflection-saved-feedback">Answer Saved!</div></div>`;
                const container = noteBlock.querySelector('.block-statement__container');
                if (container) {
                    container.innerHTML = reflectionHTML;
                    const textarea = container.querySelector('.reflection-textarea');
                    const saveButton = container.querySelector('.reflection-save-btn');
                    const feedback = container.querySelector('.reflection-saved-feedback');
                    const savedAnswer = localStorage.getItem(storageKey);
                    if (savedAnswer) { textarea.value = atob(savedAnswer); }
                    saveButton.addEventListener('click', () => {
                        localStorage.setItem(storageKey, btoa(textarea.value));
                        feedback.classList.add('visible');
                        updateShortcodeDisplay(reflectionId);
                        setTimeout(() => feedback.classList.remove('visible'), 2000);
                    });
                }
            }
        });
    }
    const finalCustomCSS = `
        .reflection-block { display: flex; flex-direction: column; width: 100%; gap: 1rem; }
        .reflection-block h3 { font-size: 2.2rem; font-weight: bold; margin: 0; }
        .reflection-block p { font-size: 1.6rem; margin: 0; }
        .reflection-textarea { width: 100%; min-height: 120px; padding: 1rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1.6rem; transition: border-color 0.2s; }
        .reflection-textarea:focus { border-color: #00aff0; outline: none; }
        .reflection-save-btn { padding: 1rem 2rem; border: none; border-radius: 50px; background-color: #00aff0; color: #fff; font-size: 1.6rem; font-weight: bold; cursor: pointer; transition: opacity 0.2s; }
        .reflection-save-btn:hover { opacity: 0.8; }
        .reflection-saved-feedback { margin-top: 1rem; color: #00aff0; font-weight: bold; opacity: 0; transition: opacity 0.3s; }
        .reflection-saved-feedback.visible { opacity: 1; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = finalCustomCSS;
    document.head.appendChild(styleSheet);
    window.addEventListener('load', runReflectionBlock);
})();
