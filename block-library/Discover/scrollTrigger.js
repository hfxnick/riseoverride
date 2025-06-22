// Scroll Trigger Feature for Rise
(function() {
    // User should customize these values:
    const blockId = 'YOUR_BLOCK_ID'; // e.g. 'cmbqlx72l000u357cces8vtkm'
    const script = `console.log('Block in view!');`;
    const fireOnce = true; // true = only fire once, false = fire every time

    function observeBlocks() {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.target.dataset.blockId === blockId && entry.isIntersecting) {
                    try { new Function(script)(); } catch (e) { console.error(e); }
                    if (fireOnce) observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.noOutline[data-block-id]').forEach(block => {
            if (block.dataset.blockId === blockId) observer.observe(block);
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeBlocks);
    } else {
        observeBlocks();
    }
})();
