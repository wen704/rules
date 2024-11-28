const scriptName = "一汽丰田";
let magicJS = MagicJS(scriptName, "INFO");

(() => {
  let response = null;
  if (magicJS.isResponse) {
    switch (true) {
      // 去除APP升级提示
      case /^https:\/\/newsuperapp\.ftms\.com\.cn\/app-bff\/v1\/version\/latestupdate/.test(magicJS.request.url):
        try {
          let obj = JSON.parse(magicJS.response.body);
          obj.data = {};
          response = { body: JSON.stringify(obj) };
        } catch (err) {
          magicJS.logError(`去除APP升级提示出现异常：${err}`);
        }
        break;
      default:
        magicJS.notify("触发意外的请求处理，请确认脚本或复写配置正常。");
        break;
    }
  } else {
    magicJS.notify("触发意外的请求处理，请确认脚本或复写配置正常。");
  }
  if (response) {
    magicJS.done(response);
  } else {
    magicJS.done();
  }
})();
