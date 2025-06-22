// Menu Visibility On Start Feature for Rise
(function() {
    function hideMenuOnStart() {
        const menuButton = document.querySelector('.nav-control__menu .nav-control__button');
        if (menuButton && menuButton.getAttribute('aria-expanded') === 'true') {
            menuButton.click();
        }
    }
    window.addEventListener('load', hideMenuOnStart);
})();
