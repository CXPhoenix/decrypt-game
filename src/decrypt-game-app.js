import './index.css'

const loginForm = document.querySelector('#loginForm');
const userNameInput = document.querySelector('#userName');
const userPwdInput = document.querySelector('#userPwd');
const signInBtn = document.querySelector('#signin-submit');

const resetPasswordForm = document.querySelector('#reset-pw');
const newPassword = document.querySelector('#newPwd');
const newPasswordCheck = document.querySelector('#newPwdCheck');
const resetPasswordBtn = document.querySelector('#reset-password-submit');

const userUI = document.querySelector('#userUI');
const decryptTextSM = document.querySelectorAll('.decrypt-text-sm');
const decryptTextMD = document.querySelectorAll('.decrypt-text-md');







/**
 * 
 * @param {string} requestType requestType only for 3 things: "SignIn", "ChangePassword", "GetGameCodes"
 * @param {object} requestData 
 * @postBody {string} requestData.account {necessary}
 * @postBody {string} requestData.password
 * @postBody {string} requestData.ip {necessary}
 * @postBody {string} requestData.token
 * @postBody {string} requestData.newPassword, if need to set new password
 */
async function apiFetch(requestType, requestData) {
    let headers = new Headers();
    headers.append("Content-Type", "text/plain");
    requestData['requestType'] = requestType;
    const url = 'https://script.google.com/macros/s/AKfycbxwECLronCkZoHt4YCSkXfJryEncPxHTsIo1NC9ZUWNi7TY3TpOx7hLpBUFww3XWprGBg/exec';
    const fetchOption = {
        header: headers,
        method: 'POST',
        body: JSON.stringify(requestData)
    }
    const res = await fetch(url, fetchOption);
    const responseJson = await res.json();
    return responseJson;
}

async function ip() {
    const res = await fetch('https://api.ipify.org/?format=json');
    const ipObject = await res.json();
    return ipObject.ip;
}