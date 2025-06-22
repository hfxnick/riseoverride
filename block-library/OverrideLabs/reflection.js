// --- RiseOverride Reflection Block Visual Tool ---
    // Developer note: The PDF download functionality in the extension now uses the local jsPDF.min.js file. 
    // When the user exports their customized template from the extension, it includes the CDN version for simplicity. 
    // The CDN no longer runs within the extension itself, it simply needs to be present in the final template that is produced by our tool.

document.addEventListener('DOMContentLoaded', () => {
    // --- Global DOM Elements ---
    const elements = {
        generateBtn: document.getElementById('generate-btn'),
        preview: document.getElementById('reflection-preview'),
        formInputs: [
            'blockId', 'promptText', 'placeholderText', 'enablePdfDownload', 'showAccentBar', 'accentColor',
            'pdfBtnColor', 'pdfBtnTextColor', 'pdfBtnLabel', 'buttonRadius',
            'pdfBtnBorder', 'pdfBtnBorderColor', 'pdfBtnBorderWidth',
            'pdfBtnHoverBgColor', 'pdfBtnHoverTextColor', 'pdfBtnHoverBorderColor', 'pdfBtnHoverUnderline',
            'blockBgColor', 'blockFontColor', 'blockPadding',
            'promptFontColor', 'textareaFontColor'
        ].map(id => document.getElementById(id)),
        blockPadding: document.getElementById('blockPadding'),
        blockPaddingValue: document.getElementById('blockPaddingValue'),
        buttonRadius: document.getElementById('buttonRadius'),
        buttonRadiusValue: document.getElementById('buttonRadiusValue'),
        buttonWidth: document.getElementById('buttonWidth'),
        buttonWidthValue: document.getElementById('buttonWidthValue')
    };

    // --- Event Listeners ---
    if (elements.generateBtn) {
        elements.generateBtn.addEventListener('click', handleGenerateClick);
    }

    // --- PDF Download Handler for Preview ---
    function handleDownloadPDF(text, statusEl) {
        if (!text.trim()) {
            statusEl.textContent = 'Please write a reflection before downloading.';
            statusEl.style.color = '#dc2626';
            statusEl.style.opacity = '1';
            return;
        }
        
        statusEl.textContent = 'Generating PDF...';
        statusEl.style.color = '#555';
        statusEl.style.opacity = '1';
        
        const loadJsPDF = () => new Promise((resolve, reject) => {
            if (window.jspdf) return resolve();
            
            const script = document.createElement('script');
            // In Chrome extension environment, use local jsPDF file
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
                script.src = chrome.runtime.getURL('jspdf.min.js');
            } else {
                // When exported as a template, use CDN version
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            }
            
            script.onload = resolve;
            script.onerror = () => {
                console.error("RiseOverride: Failed to load jsPDF library.");
                reject();
            };
            document.head.appendChild(script);
        });
        
        loadJsPDF().then(() => {
            const { jsPDF } = window.jspdf;
            const config = getFormConfig();
            
            const doc = new jsPDF();
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text('My Course Reflection', 105, 20, { align: 'center' });
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            const promptLines = doc.splitTextToSize(config.promptText, 180);
            doc.text(promptLines, 15, 35);
            
            doc.setLineWidth(0.5);
            const promptHeight = (promptLines.length * 5) + 3;
            doc.line(15, 35 + promptHeight, 195, 35 + promptHeight);
            
            doc.setFont('helvetica', 'normal');
            const yStart = 50 + promptHeight;
            const responseLines = doc.splitTextToSize(text, 180);
            doc.text(responseLines, 15, yStart);
            
            doc.save('my_reflection.pdf');
            statusEl.style.opacity = '0';
        }).catch(() => {
            statusEl.textContent = 'Error: Could not load PDF library.';
            statusEl.style.color = '#dc2626';
        });
    }

    // --- Live Preview Logic ---
    function renderPreview() {
        if (!elements.preview) return;
        const config = getFormConfig();
        let buttonsHtml = '';
        if (config.enablePdfDownload) {
            // Compose button style
            let btnStyle = `background-color:${config.pdfBtnColor}; color:${config.pdfBtnTextColor}; padding: 10px 18px; border-radius: ${config.buttonRadius}; font-size: .9em; font-weight: 700; cursor: pointer; width: ${config.buttonWidth};`;
            if (config.pdfBtnBorder) {
                btnStyle += ` border: ${config.pdfBtnBorderWidth}px solid ${config.pdfBtnBorderColor};`;
            } else {
                btnStyle += ' border: none;';
            }
            // Add hover style as a <style> tag INSIDE the preview block, so it applies to the previewed button
            let hoverStyle = '';
            if (config.enablePdfDownload) {
                hoverStyle = `<style>.ro-download-btn:hover { background-color: ${config.pdfBtnHoverBgColor} !important; color: ${config.pdfBtnHoverTextColor} !important; border-color: ${config.pdfBtnHoverBorderColor} !important;${config.pdfBtnHoverUnderline ? ' text-decoration: underline;' : ' text-decoration: none;'} }</style>`;
            }
            buttonsHtml += `${hoverStyle}<button class="ro-download-btn" style="${btnStyle}">${config.pdfBtnLabel}</button>`;
        }
        const accentStyle = config.showAccentBar ? `border-left: 4px solid ${config.accentColor};` : 'border-left: none;';
        elements.preview.innerHTML = `
            <div style="width: 100%; background-color: #fff; padding: 24px; font-family: sans-serif; box-sizing: border-box;">
                <div style="background-color: ${config.blockBgColor}; color: ${config.blockFontColor}; ${accentStyle} padding: ${config.blockPadding}; border-radius: 4px;">
                    <p style="font-size: 1.1em; font-weight: 700; margin-bottom: 16px; line-height: 1.5; color: ${config.promptFontColor};">${config.promptText || '(Your prompt will appear here)'}</p>
                    <textarea style="width: 100%; min-height: 150px; border: 1px solid #ccc; border-radius: 4px; padding: 12px; font: inherit; resize: vertical; margin-bottom: 16px; background-color: #fff; box-sizing: border-box; color: ${config.textareaFontColor};" placeholder="${config.placeholderText}" id="preview-textarea"></textarea>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">${buttonsHtml}</div>
                    <p style="margin-top: 12px; font-size: .9em; opacity: 0; transition: opacity .3s;" id="preview-status">(Status messages will appear here)</p>
                </div>
            </div>
        `;
        
        // Add click event listener to the preview download button
        const previewDownloadBtn = elements.preview.querySelector('.ro-download-btn');
        const previewTextarea = document.getElementById('preview-textarea');
        const previewStatus = document.getElementById('preview-status');
        
        if (previewDownloadBtn && config.enablePdfDownload) {
            previewDownloadBtn.addEventListener('click', () => {
                handleDownloadPDF(previewTextarea.value, previewStatus);
            });
        }
    }

    // --- Helper Functions ---
    function getFormConfig() {
        const valueById = id => document.getElementById(id).value.trim();
        const checkedById = id => document.getElementById(id).checked;
        // Detect max value for button width
        const buttonWidthInput = document.getElementById('buttonWidth');
        const buttonWidthValue = buttonWidthInput ? parseInt(buttonWidthInput.value, 10) : 140;
        const buttonWidthMax = buttonWidthInput ? parseInt(buttonWidthInput.max, 10) : 320;
        // Smooth transition to 100% for last 20px
        let buttonWidth;
        if (buttonWidthValue >= buttonWidthMax - 20) {
            const percent = (buttonWidthValue - (buttonWidthMax - 20)) / 20;
            if (percent >= 1) {
                buttonWidth = '100%';
            } else {
                buttonWidth = Math.round((1 - percent) * (buttonWidthMax - 20) + percent * buttonWidthMax) + 'px';
            }
        } else {
            buttonWidth = buttonWidthValue + 'px';
        }
        return {
            blockId: valueById('blockId'),
            enablePdfDownload: checkedById('enablePdfDownload'),
            promptText: valueById('promptText'),
            placeholderText: valueById('placeholderText'),
            showAccentBar: checkedById('showAccentBar'),
            accentColor: valueById('accentColor'),
            pdfBtnColor: valueById('pdfBtnColor'),
            pdfBtnTextColor: valueById('pdfBtnTextColor'),
            pdfBtnLabel: valueById('pdfBtnLabel'),
            buttonRadius: valueById('buttonRadius') + 'px',
            buttonWidth: buttonWidth,
            pdfBtnBorder: checkedById('pdfBtnBorder'),
            pdfBtnBorderColor: valueById('pdfBtnBorderColor'),
            pdfBtnBorderWidth: valueById('pdfBtnBorderWidth'),
            pdfBtnHoverBgColor: valueById('pdfBtnHoverBgColor'),
            pdfBtnHoverTextColor: valueById('pdfBtnHoverTextColor'),
            pdfBtnHoverBorderColor: valueById('pdfBtnHoverBorderColor'),
            pdfBtnHoverUnderline: checkedById('pdfBtnHoverUnderline'),
            blockBgColor: valueById('blockBgColor'),
            blockFontColor: valueById('blockFontColor'),
            blockPadding: valueById('blockPadding') + 'px',
            promptFontColor: valueById('promptFontColor'),
            textareaFontColor: valueById('textareaFontColor')
        };
    }

    function handleGenerateClick() {
        const config = getFormConfig();
        if (!config.blockId || !config.promptText) {
            alert('Please fill out all required fields (*).');
            return;
        }
        const scriptContent = generateScript(config);
        const blob = new Blob([scriptContent], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-reflection.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // --- Initialization ---
    elements.formInputs.forEach(el => {
        if (el) {
            el.addEventListener('input', renderPreview);
            el.addEventListener('change', renderPreview);
        }
    });
    if (elements.blockPadding && elements.blockPaddingValue) {
        elements.blockPadding.addEventListener('input', e => {
            elements.blockPaddingValue.textContent = e.target.value + 'px';
            renderPreview();
        });
    }
    if (elements.buttonRadius && elements.buttonRadiusValue) {
        elements.buttonRadius.addEventListener('input', e => {
            elements.buttonRadiusValue.textContent = e.target.value + 'px';
            renderPreview();
        });
    }
    if (elements.buttonWidth) {
        elements.buttonWidth.addEventListener('input', () => {
            renderPreview();
        });
    }
    renderPreview();
});

// --- Remember user preferences in localStorage ---
(function () {
    // List of all input IDs to persist
    const persistIds = [
        'blockId', 'promptText', 'placeholderText', 'enablePdfDownload', 'showAccentBar', 'accentColor',
        'pdfBtnColor', 'pdfBtnTextColor', 'pdfBtnLabel', 'buttonRadius',
        'buttonWidth', 'pdfBtnBorder', 'pdfBtnBorderColor', 'pdfBtnBorderWidth',
        'pdfBtnHoverBgColor', 'pdfBtnHoverTextColor', 'pdfBtnHoverBorderColor', 'pdfBtnHoverUnderline',
        'blockBgColor', 'blockFontColor', 'blockPadding', 'promptFontColor', 'textareaFontColor'
    ];
    // Restore values
    persistIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const saved = localStorage.getItem('reflection_' + id);
        if (saved !== null) {
            if (el.type === 'checkbox') {
                el.checked = saved === 'true';
            } else {
                el.value = saved;
            }
        }
    });
    // Save on change
    persistIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', function () {
            if (el.type === 'checkbox') {
                localStorage.setItem('reflection_' + id, el.checked);
            } else {
                localStorage.setItem('reflection_' + id, el.value);
            }
        });
        el.addEventListener('change', function () {
            if (el.type === 'checkbox') {
                localStorage.setItem('reflection_' + id, el.checked);
            } else {
                localStorage.setItem('reflection_' + id, el.value);
            }
        });
    });
})();

// --- SCRIPT GENERATION TEMPLATE ---
function generateScript(config) {
    const clean = (text) => text.replace(/`/g, '\`').replace(/\$/g, '\$');
    return `
/**
 * RiseOverride Reflection Block
 * Generated by the RiseOverride Visual Tool
 * Version: 1.6.0
 */
(function () {
    'use strict';
    // --- THIS CONFIGURATION WAS GENERATED BY THE RISEOVERRIDE TOOL ---
    const REFLECTION_CONFIG = {
        blockId: "${config.blockId}",
        enablePdfDownload: ${config.enablePdfDownload},
        promptText: \`${clean(config.promptText)}\`,
        placeholderText: \`${clean(config.placeholderText)}\`,
        pdfBtnLabel: \`${clean(config.pdfBtnLabel)}\`,
        downloadingMessage: 'Generating PDF...',
        showAccentBar: ${config.showAccentBar},
        accentColor: "${config.accentColor}",
        pdfBtnColor: "${config.pdfBtnColor}",
        pdfBtnTextColor: "${config.pdfBtnTextColor}",
        buttonRadius: "${config.buttonRadius}",
        buttonWidth: "${config.buttonWidth}",
        pdfBtnBorder: ${!!config.pdfBtnBorder},
        pdfBtnBorderColor: "${config.pdfBtnBorderColor}",
        pdfBtnBorderWidth: "${config.pdfBtnBorderWidth}",
        pdfBtnHoverBgColor: "${config.pdfBtnHoverBgColor}",
        pdfBtnHoverTextColor: "${config.pdfBtnHoverTextColor}",
        pdfBtnHoverBorderColor: "${config.pdfBtnHoverBorderColor}",
        pdfBtnHoverUnderline: ${!!config.pdfBtnHoverUnderline},
        blockBgColor: "${config.blockBgColor}",
        blockFontColor: "${config.blockFontColor}",
        blockPadding: "${config.blockPadding}",
        promptFontColor: "${config.promptFontColor}",
        textareaFontColor: "${config.textareaFontColor}"
    };
    // --- SCRIPT CORE ---
    function injectReflectionBlock(targetBlock) {
        let buttonsHtml = '';
        if (REFLECTION_CONFIG.enablePdfDownload) {
            let btnStyle = 'border-radius: ' + REFLECTION_CONFIG.buttonRadius + '; background-color: ' + REFLECTION_CONFIG.pdfBtnColor + '; color: ' + REFLECTION_CONFIG.pdfBtnTextColor + '; padding: 10px 18px; font-size: .9em; font-weight: 700; cursor: pointer; width: ' + REFLECTION_CONFIG.buttonWidth + ';';
            if (REFLECTION_CONFIG.pdfBtnBorder) {
                btnStyle += ' border: ' + REFLECTION_CONFIG.pdfBtnBorderWidth + 'px solid ' + REFLECTION_CONFIG.pdfBtnBorderColor + ';';
            } else {
                btnStyle += ' border: none;';
            }
            buttonsHtml += '<button class="ro-reflection-button ro-download-btn" style="' + btnStyle + '">' + REFLECTION_CONFIG.pdfBtnLabel + '</button>';
        }
        var accentStyle = REFLECTION_CONFIG.showAccentBar ? 'border-left: 4px solid ' + REFLECTION_CONFIG.accentColor + ';' : '';
        targetBlock.innerHTML =
            '<style>' +
            '.ro-reflection-content {' +
                accentStyle +
                'background-color: ' + REFLECTION_CONFIG.blockBgColor + ';' +
                'color: ' + REFLECTION_CONFIG.blockFontColor + ';' +
                'padding: ' + REFLECTION_CONFIG.blockPadding + ';' +
                'border-radius: 4px;' +
            '}' +
            '.ro-reflection-prompt {' +
                'font-size: 1.1em;' +
                'font-weight: 700;' +
                'margin-bottom: 16px;' +
                'line-height: 1.5;' +
                'color: ' + REFLECTION_CONFIG.promptFontColor + ';' +
            '}' +
            '.ro-reflection-textarea {' +
                'width: 100%;' +
                'min-height: 150px;' +
                'border: 1px solid #ccc;' +
                'border-radius: 4px;' +
                'padding: 12px;' +
                'resize: vertical;' +
                'margin-bottom: 16px;' +
                'box-sizing: border-box;' +
                'font: inherit;' +
                'color: ' + REFLECTION_CONFIG.textareaFontColor + ';' +
                'background-color: #fff;' +
            '}' +
            '.ro-reflection-buttons { display: flex; gap: 12px; flex-wrap: wrap; }' +
            '.ro-reflection-button { transition: background-color .2s, color .2s, border-color .2s, text-decoration .2s; }' +
            '.ro-download-btn {' +
                'background-color: ' + REFLECTION_CONFIG.pdfBtnColor + ';' +
                'color: ' + REFLECTION_CONFIG.pdfBtnTextColor + ';' +
                'border-radius: ' + REFLECTION_CONFIG.buttonRadius + ';' +
                (REFLECTION_CONFIG.pdfBtnBorder ? ('border: ' + REFLECTION_CONFIG.pdfBtnBorderWidth + 'px solid ' + REFLECTION_CONFIG.pdfBtnBorderColor + ';') : 'border: none;') +
            '}' +
            '.ro-download-btn:hover {' +
                'background-color: ' + REFLECTION_CONFIG.pdfBtnHoverBgColor + ';' +
                'color: ' + REFLECTION_CONFIG.pdfBtnHoverTextColor + ';' +
                'border-color: ' + REFLECTION_CONFIG.pdfBtnHoverBorderColor + ';' +
                (REFLECTION_CONFIG.pdfBtnHoverUnderline ? 'text-decoration: underline;' : 'text-decoration: none;') +
            '}' +
            '.ro-reflection-status { margin-top: 12px; font-size: .9em; color: #059669; opacity: 0; transition: opacity .3s; }' +
            '</style>' +
            '<div class="block-wrapper">' +
                '<div class="block-text--onecol">' +
                    '<div class="block-text__container">' +
                        '<div class="block-text__row">' +
                            '<div class="block-text__col">' +
                                '<div class="ro-reflection-content">' +
                                    '<p class="ro-reflection-prompt">' + REFLECTION_CONFIG.promptText + '</p>' +
                                    '<textarea class="ro-reflection-textarea" placeholder="' + REFLECTION_CONFIG.placeholderText + '"></textarea>' +
                                    '<div class="ro-reflection-buttons">' + buttonsHtml + '</div>' +
                                    '<p class="ro-reflection-status"></p>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        var textarea = targetBlock.querySelector('.ro-reflection-textarea');
        var status = targetBlock.querySelector('.ro-reflection-status');        var downloadBtn = targetBlock.querySelector('.ro-download-btn');
        if (downloadBtn) downloadBtn.addEventListener('click', function() { handleDownloadPDF(textarea.value, status); });
    }
    
    function handleDownloadPDF(text, statusEl) {
        if (!text.trim()) {
            statusEl.textContent = 'Please write a reflection before downloading.';
            statusEl.style.color = '#dc2626';
            statusEl.style.opacity = '1';
            return;
        }
        
        statusEl.textContent = REFLECTION_CONFIG.downloadingMessage;
        statusEl.style.color = '#555';
        statusEl.style.opacity = '1';
        
        const loadJsPDF = () => new Promise((resolve, reject) => {
            if (window.jspdf) return resolve();
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = resolve;
            script.onerror = () => {
                console.error("RiseOverride: Failed to load jsPDF library.");
                reject();
            };
            document.head.appendChild(script);
        });
        
        loadJsPDF().then(() => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text('My Course Reflection', 105, 20, { align: 'center' });
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            const promptLines = doc.splitTextToSize(REFLECTION_CONFIG.promptText, 180);
            doc.text(promptLines, 15, 35);
            
            doc.setLineWidth(0.5);
            const promptHeight = (promptLines.length * 5) + 3;
            doc.line(15, 35 + promptHeight, 195, 35 + promptHeight);
            
            doc.setFont('helvetica', 'normal');
            const yStart = 50 + promptHeight;
            const responseLines = doc.splitTextToSize(text, 180);
            doc.text(responseLines, 15, yStart);
            
            doc.save('my_reflection.pdf');
            statusEl.style.opacity = '0';
        }).catch(() => {
            statusEl.textContent = 'Error: Could not load PDF library.';
            statusEl.style.color = '#dc2626';
        });
    }
    
    function findAndInjectBlock() {
        var blockId = REFLECTION_CONFIG.blockId.trim();
        if (!blockId) {
            console.error('RiseOverride Error: blockId is not configured.');
            return false;
        }
        var targetBlock = document.getElementById(blockId) || document.querySelector('[data-block-id="' + blockId + '"]');
        if (targetBlock) {
            injectReflectionBlock(targetBlock);
            return true;
        }
        return false;
    }
    function init() {
        if (findAndInjectBlock()) return;
        const observer = new MutationObserver(() => {
            if (findAndInjectBlock()) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
`;
}