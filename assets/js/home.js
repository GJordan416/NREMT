document.getElementById('login-button').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        e.target.click();
    }
});
document.getElementById('login-drawer-visible').checked = false;
document.getElementById('login-drawer-visible').addEventListener('change', function (e) {
    if (this.checked) {
        document.querySelector('.home-main').setAttribute('aria-hidden', true);
        document.querySelector('.login-drawer__form').querySelectorAll('a, input').forEach(function (e) {
            e.tabIndex = 0;
        });
        const usernameInput = document.getElementById('login-form__username');
        usernameInput && usernameInput.focus();
    } else {
        document.querySelector('.home-main').setAttribute('aria-hidden', false);
        document.querySelector('.login-drawer__form').querySelectorAll('a, input').forEach(function (e) {
            e.tabIndex = -1;
        });
        document.getElementById('login-button').focus();
    }
});
document.querySelector('.home-main').addEventListener('focusin', function (e) {
    if (document.getElementById('login-drawer-visible').checked) {
        document.getElementById('login-button').focus();
        e.preventDefault();
    }
});
