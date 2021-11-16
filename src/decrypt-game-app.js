import "./index.css";

const loginForm = document.querySelector("#loginForm");
const userNameInput = document.querySelector("#userName");
const userPwdInput = document.querySelector("#userPwd");
const signInBtn = document.querySelector("#signin-submit");

const resetPasswordForm = document.querySelector("#reset-pw");
const newPassword = document.querySelector("#newPwd");
const newPasswordCheck = document.querySelector("#newPwdCheck");
const resetPasswordBtn = document.querySelector("#reset-password-submit");

const userUI = document.querySelector("#userUI");
const decryptTextSM = document.querySelectorAll(".decrypt-text-sm");
const decryptTextMD = document.querySelectorAll(".decrypt-text-md");

const loadingUI = document.querySelector("#loadingUI");

let ip = "";

window.addEventListener("DOMContentLoaded", async function () {
  try {
    ip = await getIp();
  } catch (e) {
    console.log(e);
    alert("抓取 ip 過程中發生問題\n請聯繫系統管理員");
  }
});

signInBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  if (userNameInput.value == "" || userPwdInput.value == "") {
    alert("請輸入帳號密碼!");
    return;
  }
  try {
    let requestData = {
      account: userNameInput.value,
      password: userPwdInput.value,
      ip: ip,
    };
    let requestType = "SignIn";
    userPwdInput.value = "";
    loginForm.classList.add("hidden");
    loadingUI.classList.remove("hidden");
    const responseData = await apiFetch(requestType, requestData);
    if (await checkStatusFromResponse(responseData.status)) {
      userNameInput.value = "";
      await storeToLocalStorage("token", responseData.token);
      await storeToLocalStorage("account", responseData.account);
      await storeToSessionStorage("isFirstSignIn", responseData.isFirstSignIn);
    } else {
      alert("帳號密碼驗證錯誤，請重新輸入或是詢問系統管理員");
      loadingUI.classList.add("hidden");
      loginForm.classList.remove("hidden");
      return;
    }
  } catch (e) {
    console.log(e);
    alert("帳號密碼驗證過程出現問題\n請詢問系統管理員");
    loadingUI.classList.add("hidden");
    loginForm.classList.remove("hidden");
    return;
  }
  let isFirstSignIn = JSON.parse(
    window.sessionStorage.getItem("isFirstSignIn")
  );
  if (isFirstSignIn) {
    loadingUI.classList.add("hidden");
    resetPasswordForm.classList.remove("hidden");
    return;
  }

  await showGameCodes();
});

resetPasswordBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  if (newPassword.value == "" || newPasswordCheck.value == "") {
    alert("不能有空白喔!");
    return;
  }
  if (newPassword.value != newPasswordCheck.value) {
    alert("密碼確認與欲修改之密碼不相符");
    return;
  }
  try {
    let requestType = "ChangePassword";
    let requestData = {
      account: window.localStorage.getItem("account"),
      token: window.localStorage.getItem("token"),
      ip: ip,
      newPassword: newPassword.value,
    };
    loadingUI.classList.remove("hidden");
    resetPasswordForm.classList.add("hidden");
    newPassword.value = "";
    newPasswordCheck.value = "";
    const responseData = await apiFetch(requestType, requestData);
    if (await checkStatusFromResponse(responseData.status)) {
      alert("更變密碼成功！");
      resetPasswordForm.classList.add("hidden");
      loadingUI.classList.remove("hidden");
    } else {
      alert("更變密碼失敗\n請跟系統管理員確認");
      return;
    }
    await storeToSessionStorage("isFirstSignIn", "false");
    await showGameCodes();
  } catch (e) {
    console.log(e);
    alert("重置密碼發生了點問題\n請詢問系統管理員");
    loadingUI.classList.add("hidden");
    loginForm.classList.remove("hidden");
    return;
  }
});

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
  requestData["requestType"] = requestType;
  const url =
    "https://script.google.com/macros/s/AKfycbxwECLronCkZoHt4YCSkXfJryEncPxHTsIo1NC9ZUWNi7TY3TpOx7hLpBUFww3XWprGBg/exec";
  const fetchOption = {
    header: headers,
    method: "POST",
    body: JSON.stringify(requestData),
  };
  const res = await fetch(url, fetchOption);
  const responseJson = await res.json();
  return responseJson;
}

/**
 *
 * @returns {String} ip address
 */
async function getIp() {
  const res = await fetch("https://api.ipify.org/?format=json");
  const ipObject = await res.json();
  return ipObject.ip;
}

/**
 *
 * @param {String} key
 * @param {String} value
 * @returns {promise}
 */
function storeToLocalStorage(key, value) {
  return new Promise((resolve) => {
    window.localStorage.setItem(key, value);
    resolve();
  });
}

/**
 *
 * @param {String} key
 * @param {String} value
 * @returns {promise}
 */
function storeToSessionStorage(key, value) {
  return new Promise((resolve) => {
    window.sessionStorage.setItem(key, value);
    resolve();
  });
}

/**
 *
 * @param {String} status
 * @returns {boolean}
 */
function checkStatusFromResponse(status) {
  return new Promise((resolve) => {
    if (status == "success") {
      resolve(true);
    } else if (status == "fail") {
      resolve(false);
    }
  });
}

async function showGameCodes() {
  if (window.sessionStorage.getItem("gameCodes")) {
    const gameCodes = JSON.parse(window.sessionStorage.getItem("gameCodes"));
    for (let i = 0; i < gameCodes.length; i++) {
      decryptTextSM[i].innerText = gameCodes[i];
      decryptTextMD[i].innerText = gameCodes[i];
    }
    loadingUI.classList.add("hidden");
    userUI.classList.remove("hidden");
    return;
  }

  try {
    let requestType = "GetGameCodes";
    let requestData = {
      account: window.localStorage.getItem("account"),
      token: window.localStorage.getItem("token"),
      ip: await getIp(),
    };
    let responseData = await apiFetch(requestType, requestData);
    console.log(responseData);
    if (await checkStatusFromResponse(responseData.status)) {
      await storeToSessionStorage(
        "gameCodes",
        JSON.stringify(responseData.gameCodes)
      );
    } else {
      throw "get game codes fail";
    }
    const gameCodes = responseData.gameCodes;
    for (let i = 0; i < gameCodes.length; i++) {
      decryptTextSM[i].innerText = gameCodes[i];
      decryptTextMD[i].innerText = gameCodes[i];
    }
    loadingUI.classList.add("hidden");
    userUI.classList.remove("hidden");
  } catch (e) {
    console.log(e);
    alert("抓取資料時出現問題\n請詢問系統管理員");
    loadingUI.classList.add("hidden");
    loginForm.classList.remove("hidden");
    return;
  }
}
