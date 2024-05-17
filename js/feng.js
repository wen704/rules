const scriptName = "威锋";
let magicJS = MagicJS(scriptName, "INFO");

(() => {
  let response = null;
  if (magicJS.isResponse) {
    switch (true) {
      // 去除APP启动广告
      case /^https:\/\/api\.feng\.com\/v2\/yesfeng/.test(magicJS.request.url):
        try {
          let obj = JSON.parse(magicJS.response.body);
          obj.data.dataList = [];
          response = { body: JSON.stringify(obj) };
        } catch (err) {
          magicJS.logError(`去除APP启动广告出现异常：${err}`);
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
