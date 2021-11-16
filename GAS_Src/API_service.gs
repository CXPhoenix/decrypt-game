/**
 * @postBody {object} requestData
 * @postBody {string} requestData.requestType
 * @postBody {string} requestData.account {necessary}
 * @postBody {string} requestData.password
 * @postBody {string} requestData.ip {necessary}
 * @postBody {string} requestData.token
 * @postBody {string} requestData.newPassword, if need to set new password
 */
function doPost(e) {
  const requestData = JSON.parse(e.postData.contents);
  const nowTime = new Date()
  let responseData = {
    status: 'fail'
  }

  const contentResponse = function(response) {
    recordLog(nowTime, requestData.ip, response.status, formatEventDescription(requestData.ip, requestData.account, requestData.requestType, nowTime, response.status));
    return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
  };

  if (!requestData.account || !requestData.ip) {
    responseData["error"] = "Loss some necessary information."
    return contentResponse(responseData)
  }

  if (requestData.requestType == 'SignIn') {
    responseData["account"] = requestData.account;
    if (isSignIn(requestData)) {
      responseData.status = 'success';
      responseData['signInTime'] = nowTime;
      const expiredTime = setExpiredTime(nowTime);
      responseData['token'] = createToken(requestData.account, responseData.signInTime, expiredTime);
      responseData['isFirstSignIn'] = isAccountFirstSignIn(requestData.account);
      setSignInToken(requestData.account, responseData.token, expiredTime);

    }
    return contentResponse(responseData);
  }
  if (requestData.requestType == "ChangePassword") {
    if (!isAccountFirstSignIn(requestData.account)) {
      return contentResponse(responseData);
    }
    if (!isTokenCorrespondToAccount(requestData.account ,requestData.token)) {
      return contentResponse(responseData);
    }
    if (isTokenExpired(requestData.token)) {
      return contentResponse(responseData);
    }
    setAccountPassword(requestData.account, requestData.newPassword);
    setAccountFirstSignInStatus(requestData.account);
    responseData.status = 'success';
    responseData['account'] = requestData.account;
    return contentResponse(responseData);
  }
  if (requestData.requestType == "GetGameCodes") {
    if (!isTokenCorrespondToAccount(requestData.account ,requestData.token)) {
      return contentResponse(responseData);
    }
    if (isTokenExpired(requestData.token)) {
      return contentResponse(responseData);
    }
    if (!isAccountGameCodeSet(requestData.account)) {
      setAccountGameCodes(requestData.account);
      setAccountGameCodeSettingStatus(requestData.account);
    }
    responseData.status = 'success';
    responseData['gameCodes'] = getAccountGameCodes(requestData.account);
    return contentResponse(responseData);
  }
}

/**
 * @param {object} account and password
 * @return {boolean} is satisfied for account and password pairing.
 */
function isSignIn({account, password}) {
  const info = getAccountInfo();
  return (info[account] == password);
}
/**
 * @return {object} account and password pairs
 */
function getAccountInfo() {
  const values = UserInfoSheet.getDataRange().getValues();
  let accountDict = {};
  values.forEach((value, index) => {
    if (index == 0) {
      return;
    }
    accountDict[`${value[0]}`] = value[1];
  });
  return accountDict;
}

/**
 * @param {string} account
 * @param {string} token, with base64 encoding
 * @param {Date} tokenExpiredTime
 * @returns {void}
 */
function setSignInToken(account, token, tokenExpiredTime) {
  const row = getAccountRowFromUserInfoSheetByAccount(account);
  if (row) {
    const datas = UserInfoSheet.getDataRange();
    datas.getCell(row, UserInfoCol.token).setValue(token);
    datas.getCell(row, UserInfoCol.tokenExpiredTime).setValue(tokenExpiredTime);
    return;
  }
}
/**
 * @param {string} account
 * @returns {string|null} if account exists, return token. Otherwise, return null
 */
function getSignInToken(account) {
  const row = getAccountRowFromUserInfoSheetByAccount(account);
  if (row) {
    const datas = UserInfoSheet.getDataRange();
    return datas.getCell(row, UserInfoCol.token).getValue();
  }
  return null;
}
/**
 * @param {string} account
 * @returns {integer|null} if the account not exists in the user info sheet 
 */
function getAccountRowFromUserInfoSheetByAccount(account) {
  const datas = UserInfoSheet.getDataRange();
  for (let row = 2; row <= datas.getLastRow(); row++) {
    if (datas.getCell(row, UserInfoCol.account).getValue() == account) {
      return row;
    }
  }
  return null;
}
/**
 * @param {string} token
 * @returns {integer|null} if the token not exists in the user info sheet 
 */
function getAccountRowFromUserInfoSheetByToken(token) {
  const datas = UserInfoSheet.getDataRange();
  for (let row = 2; row <= datas.getLastRow(); row ++) {
    if (datas.getCell(row, UserInfoCol.token).getValue() == token) {
      return row;
    }
  }
  return null;
}

/**
 * @param {object} userData
 * @param {string} userData.account
 * @param {Date} userData.signInTime
 * @param {Date} userData.tokenExpiredTime
 * @returns {string} the token with base64 encoding 
 */
function createToken(account, signInTime, tokenExpiredTime) {
  const tokenStringFormat = `${timeFormat(signInTime)}-${account}-${timeFormat(tokenExpiredTime)}`;
  const tokenBytes = Utilities.newBlob(tokenStringFormat).getBytes();
  const token = Utilities.base64Encode(tokenBytes);
  return token;
}

/**
 * @param {string} account
 * @returns {boolen|null} if account exists, return true/false. Otherwise, return null
 */
function isAccountFirstSignIn(account) {
  const row = getAccountRowFromUserInfoSheetByAccount(account);
  if (row) {
    const datas = UserInfoSheet.getDataRange();
    return datas.getCell(row, UserInfoCol.firstTimeSignIn).getValue();
  }
  return null;
}
/**
 * @param {string} account
 * @param {string} token
 * @returns {boolean|null}
 */
function isTokenCorrespondToAccount(account, token) {
  const row = getAccountRowFromUserInfoSheetByAccount(account);
  if (!row) {
    return null;
  }
  const datas = UserInfoSheet.getDataRange();
  return token == datas.getCell(row, UserInfoCol.token).getValue();
}
/**
 * @param {string} token
 * return {boolean}
 */
function isTokenExpired(token) {
  const row = getAccountRowFromUserInfoSheetByToken(token);
  if (!row) {
    return true;
  }
  const nowTime = new Date();
  const datas = UserInfoSheet.getDataRange();
  return nowTime.getTime() >= datas.getCell(row, UserInfoCol.tokenExpiredTime).getValue().getTime();
}
/**
 * @param {string} account
 * @param {boolean} toStatus, true means it's the first time sign in. Default is set false
 * @returns {void} if the account not exists, there will be null
 */
function setAccountFirstSignInStatus(account, toStatus=false) {
  const row = getAccountRowFromUserInfoSheetByAccount(account);
  if (row) {
    const datas = UserInfoSheet.getDataRange();
    const checkBox = datas.getCell(row, UserInfoCol.firstTimeSignIn);
    if (toStatus) {
      checkBox.check();
    } else {
      checkBox.uncheck();
    }
  }
}

/**
 * @param {string} account
 * @returns {boolean}
 */
function isAccountGameCodeSet(account) {
  const row = getAccountRowFromUserInfoSheetByAccount(account);
  if (row) {
    return UserInfoSheet.getDataRange().getCell(row, UserInfoCol.isGameCodeSet).getValue();
  }
  return false;
}
/**
 * @param {string} account
 * @param {boolean} toStatus, true means the game codes of account is setting.
 * @returns {void}
 */
function setAccountGameCodeSettingStatus(account, toStatus=true) {
  const row = getAccountRowFromUserInfoSheetByAccount(account);
  if (row) {
    const datas = UserInfoSheet.getDataRange();
    const checkBox = datas.getCell(row, UserInfoCol.isGameCodeSet);
    if (toStatus) {
      checkBox.check();
    } else {
      checkBox.uncheck();
    }
  }
}
/**
 * @param {string} account
 * @returns {void}
 */
function setAccountGameCodes(account) {
  const gameCodeDatas = GameTopicDBSheet.getDataRange().getValues().splice(1);
  const gameCodeRecord = [account];
  while (gameCodeRecord.length < 5) {
    const code = gameCodeDatas[parseInt(Math.random()*gameCodeDatas.length)][0];
    if (!gameCodeRecord.includes(code)) {
      gameCodeRecord.push(code);
    }
  }
  GameRecordSheet.appendRow(gameCodeRecord);
}
/**
 * @param {string} account
 * @returns {Interger|null} row or null if account not found
 */
function getAccountRowFromGameRecordSheet(account) {
  const dataRanges = GameRecordSheet.getDataRange();
  for (let row = 2; row <= dataRanges.getLastRow(); row++) {
    if (account == dataRanges.getCell(row, 1).getValue()) {
      return row;
    }
  }
  return null;
}
/**
 * @param {string} account
 * @returns {String[]} 4 game codes in order
 */
function getAccountGameCodes(account) {
  const row = getAccountRowFromGameRecordSheet(account);
  if (!row) {
    return;
  }
  const gameCodesDatas = GameRecordSheet.getDataRange();
  let gameCodes = [];
  for (let i = 2; i < 6; i++) {
    gameCodes.push(gameCodesDatas.getCell(row, i).getValue());
  }
  return gameCodes;
}

/**
 * @param {string} account
 * @param {string} newPassword
 * @returns {void}
 */
function setAccountPassword(account, newPassword) {
  const row = getAccountRowFromUserInfoSheetByAccount(account);
  if (row) {
    const datas = UserInfoSheet.getDataRange();
    datas.getCell(row, UserInfoCol.password).setValue(newPassword);
  }
}


/**
 * @param {Date} timestamp
 * @param {string} ip
 * @param {string} eventToken from createEventToken()
 * @param {string} decription from formatEventDescription()
 * @returns {void}
 */
function recordLog(timestamp, ip, status, description) {
  LogRecord.appendRow([timestamp, ip, status, description]);
}
/**
 * @param {string} ip
 * @param {string} requestAccount
 * @param {string} requestType {SingIn, ChangePassword, GetAccountCryptCode}
 * @param {Date} timestamp
 * @param {string} responseStatus {"fail", "success"}
 * @returns {string} formated String for decription
 */
function formatEventDescription(ip, requestAccount, requestType, timestamp, responseStatus) {
  return `${requestAccount} at ${ip} try to ${requestType} (${timestamp}) is ${responseStatus}`;
}