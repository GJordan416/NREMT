var notificationRedirect = "";
const loginForm = document.querySelector('.login-form');
const LOGGING_IN = 1;
const LOGGING_OUT = 2;

if (loginForm) {
    loginForm.addEventListener('submit', handleSubmit);
    const logout = loginForm.querySelector('.login-form__logout');
    logout && logout.addEventListener('click', handleLogout);
}

function isNullOrWhitespace(s) {
    if (typeof s === undefined
        || s == null
        || s.replace(/s/g, '').length == 0) {
        return true;
    }
    else {
        return false;
    }
}

function clearLoginErrorMessage() {
    displayLoginErrorMessage('');
}

function displayLoginErrorMessage(s) {
    const loginError = document.querySelector('.login-form__error');

    loginError.innerHTML = s;
}

function handleSubmit(evt) {
    evt.preventDefault();
    clearLoginErrorMessage();
    setFormLoading(LOGGING_IN);

    var user_name = document.getElementById('login-form__username').value;
    const username = encodeURIComponent(user_name);
    var pass_word = document.getElementById('login-form__password').value;
    var password = encodeURIComponent(pass_word);

    let urlParams = '';
    if (typeof URLSearchParams !== 'undefined') {
        urlParams = new URLSearchParams(window.location.search);
    }
    const redirect = typeof(pvRedirect) != 'undefined' ? pvRedirect : (urlParams && urlParams.get('redirect')) || getUrlParameter('redirect');

    if (isNullOrWhitespace(username)) {
        displayLoginErrorMessage(errorMessages[ACTION_NOTIFY_OF_MISSING_USER_NAME]);
        document.getElementById('login-form__username').focus();
        return;
    }
    else if (isNullOrWhitespace(password)) {
        displayLoginErrorMessage(errorMessages[ACTION_NOTIFY_OF_MISSING_PASSWORD]);
        document.getElementById('login-form__password').focus();
        return;
    }

    fetch(loginForm.getAttribute('action'), {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: "username=" + username + "&password=" + password + "&redirect=" + redirect
    })
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            handleError();
        }
    })
    .then(handleResponse)
    .catch(handleError);

    return false;
}

function handleResponse(data) {
    if (data.success) {

        if (window.location.search.includes("pv=")) {
            document.querySelectorAll(`.login-form__submit`).forEach((el) => {
                const successMessage = document.createElement('div');
                successMessage.style = 'text-align: center; color: #34C759; font-weight:600';
                successMessage.textContent = `Sign in successful! Navigating to Candidate Dashboard...`;
                el.replaceWith(successMessage);
            });
        }

        //Set cookies
        document.cookie = "kentico-NREMTsessionAccountId=" + data.userId + ";path=/";
        document.cookie = "kentico-NREMTidentity=" + data.token + ";path=/";
        document.cookie = "kentico-NREMTroles=" + data.permissions + ";path=/";
        document.cookie = "kentico-NREMTrights=" + data.rights + ";path=/";
        document.cookie = "kentico-NREMTcurrentUserName=" + data.name + ";path=/";
        document.cookie = "kentico-NREMThomePage=" + data.homePage + ";path=/";
        document.cookie = "kentico-NREMTsessionTimeout=" + data.sessionTimeout + ";path=/";
        if (data.displayNotification) {
            // nothing?
        } else {
            //Set cookies
            document.cookie = "kentico-NREMTsessionAccountId=" + data.userId + ";path=/";
            document.cookie = "kentico-NREMTidentity=" + data.token + ";path=/";
            document.cookie = "kentico-NREMTroles=" + data.permissions + ";path=/";
            document.cookie = "kentico-NREMTrights=" + data.rights + ";path=/";
            document.cookie = "kentico-NREMTcurrentUserName=" + data.name + ";path=/";
            document.cookie = "kentico-NREMThomePage=" + data.homePage + ";path=/";
            document.cookie = "kentico-NREMTsessionTimeout=" + data.sessionTimeout + ";path=/";

            if (location.pathname.indexOf('/store') == 0) {
                location.reload();
                return;
            }
            if (data.redirect) {
                location.href = "/login/landing?redirect=" + data.redirect;
            } else {
                location.reload();
            }
            return;
        }
    }
    else {
        var messageId = ACTION_SHOW_INTERNAL_ERROR_MESSAGE;

        switch (data.code) {
            case ACTION_NOTIFY_USER_OF_LOCKOUT:
                var message = errorMessages[data.code];
                message = message.replace("{MINUTES_REMAINING}", data.minutes);
                displayLoginErrorMessage(message);
                break;

            case ACTION_SHOW_INVALID_LOGIN_MESSAGE:
                messageId = data.code;

            case ACTION_SHOW_INTERNAL_ERROR_MESSAGE:
            default:
                displayLoginErrorMessage(errorMessages[messageId]);
                break;
        }
    }
    setFormLoading(0);
}

function getExpiration(token) {
    if (token) {
        try {
            const [, payload] = token.split('.');
            const { exp: expires } = JSON.parse(window.atob(payload));
            if (typeof expires === 'number') {
                return new Date(expires * 1000);
            }
        } catch (err) {
            console.log(err)
        }
    }
    return null;
}

function handleError() {
    setFormLoading(0);

    displayLoginErrorMessage(errorMessages[ACTION_SHOW_INTERNAL_ERROR_MESSAGE]);
}

function handleLogout() {
    setFormLoading(LOGGING_OUT);
}

function setFormLoading(status) {
    var form = document.querySelector('.login-form');
    switch (status) {
        case LOGGING_IN:
            form.classList.add('login-form--logging-in');
            break;
        case LOGGING_OUT:
            form.classList.add('login-form--logging-out');
            break;
        default:
            form.classList.remove('login-form--logging-in', 'login-form--logging-out');
    }
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

// login form password reveal
const revealPasswordIcon = document.querySelector('.login-form__reveal-password-label');
revealPasswordIcon && revealPasswordIcon.addEventListener('click', function () {
    this.innerHTML = this.querySelectorAll('.bxs-show').length ? '<i class="bx bxs-hide" ></i>' : '<i class="bx bxs-show"></i>';
    document.getElementById('login-form__password').setAttribute('type', this.querySelectorAll('.bxs-show').length ? 'password' : 'text');
});

// enums
var ACTION_NOTIFY_OF_MISSING_USER_NAME = -1;
var ACTION_NOTIFY_OF_MISSING_PASSWORD = -2;
var ACTION_NONE = 0;
var ACTION_REDIRECT_TO_SPECIFIED_PAGE = 1;
var ACTION_REDIRECT_TO_HOME_PAGE = 2;
var ACTION_ENTER_DEMOGRAPHICS = 3;
var ACTION_CHANGE_PASSWORD = 4;
var ACTION_SHOW_INVALID_LOGIN_MESSAGE = 5;
var ACTION_SHOW_INTERNAL_ERROR_MESSAGE = 6;
var ACTION_NOTIFY_USER_OF_LOCKOUT = 7;
var ACTION_REDIRECT_TO_ACCOUNT_CREATION = 8;

var errorMessages = [];
errorMessages[ACTION_NOTIFY_OF_MISSING_USER_NAME] = "You must enter your user name.";
errorMessages[ACTION_NOTIFY_OF_MISSING_PASSWORD] = "You must enter your password.";
errorMessages[ACTION_SHOW_INVALID_LOGIN_MESSAGE] = "Your user name and password did not match.";
errorMessages[ACTION_SHOW_INTERNAL_ERROR_MESSAGE] = "An unknown error occurred.";
errorMessages[ACTION_NOTIFY_USER_OF_LOCKOUT] = "Your NREMT account has been locked out due to an excessive number of failed login attempts.  You can login to your account again in {MINUTES_REMAINING} minutes.";

