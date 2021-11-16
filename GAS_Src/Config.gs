var UserInfoSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('使用者帳號密碼');
var UserInfoCol = {
  account: 1,
  password: 2,
  token: 3,
  tokenExpiredTime: 4,
  firstTimeSignIn: 5,
  isGameCodeSet: 6,
  isAdmin:7
};
var setExpiredTime = (nowDate, minute = 30) => new Date(nowDate.getTime()+(1000*60*30));
var timeFormat = (date, seperateMonthAndHour='/') => Utilities.formatDate(date, 'GMT+8', `yyyy-MM-dd${seperateMonthAndHour}hh:mm:ss`);

var GameTopicDBSheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[1];
var GameRecordSheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[2];
var LogRecord = SpreadsheetApp.getActiveSpreadsheet().getSheets()[3];