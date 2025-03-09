/*
射手座星座运势（今日+明日）
借鉴 NobyDa 大佬的脚本作为入门模版 https://raw.githubusercontent.com/NobyDa/Script/master/Bilibili-DailyBonus/ExchangePoints.js

脚本作者：@DJ
更新时间：2025/03/09
平台兼容：Surge, QuantumultX, Loon

*************************
【 Surge & Loon 脚本配置 】:
*************************

[Script]
cron "0 0 7 * * *" script-path=https://raw.githubusercontent.com/wen704/rules/master/js/constellaction.js, wake-system=1, timeout=60

*************************
【 QX 1.0.10+ 脚本配置 】 :
*************************

[task_local]
0 0 7 * * * * * * https://raw.githubusercontent.com/wen704/rules/master/js/constellaction.js, tag=射手座星座运势（今日+明日）, enabled=true

*/

// 新建一个实例对象, 把兼容函数定义到$中, 以便统一调用
let $ = new dj();

// 读取Surge脚本参数并转成对象（暂时没有考虑配置其他星座的想法，可以考虑添加参数调整星座）
let args = argsList(typeof $argument == "string" && $argument || '');

// 读取星座参数
let consName = args.consName || $.read('DJ_consName') || '射手座';

// 请求 vivo 日历中的地址所需 Cookie（暂时用不到）
// let cookie = $.read('CookieDJ');

// 预留的空对象, 便于函数之间读取数据
let memorySP = {};

(async function() {
	await QueryConstellaction();
	$.done();
})();

function QueryConstellaction() {
	// https://subscribe.vivo.com.cn/constellation/getInfo?consName=%E5%B0%84%E6%89%8B%E5%BA%A7&type=tomorrow&model=V2056A&elapsedtime=111829798&pixel=1080*1827&av=30&adrVerName=11&appVersion=6374&appVersionName=6.3.7.4&appPkgName=com.bbk.calendar&timestamp=1741510792257&cs=0
	const reqObj = {
		url: `https://subscribe.vivo.com.cn/constellation/getInfo?consName=${encodeURIComponent(consName)}&type=today`,
		headers: {
			'User-Agent': 'okhttp/4.8.1'
		}
	}
	return new Promise((resolve) => {
		$.postReq(reqObj, (error, resp, data) => {
			try {
				if (error) {
					throw new Error(error);
				} else {
					// {"code":0,"data":{"name":"射手座","color":"青色","datetime":"2025年03月09日","date":"20250309","summary":"整体运势对你来说可能比较平淡，但这并不意味着你要因此而泄气。这一天，你可能会感受到一种平淡的节奏，似乎缺乏一些激情和动力。但请记住，平淡的日子也有它的美好之处，它给了你一个机会去反思和沉淀自己。试着用一颗平静的心去面对这一天，你会发现，其实生活中有很多值得你去珍惜和感激的小确幸。你可以把注意力放在自己的内心世界上，做一些能够让自己感到平静和满足的事情，比如阅读一本好书，或者进行一次冥想。在生活方面，你可以考虑安排一些能够让你放松身心的活动，比如去公园散步，或者参加一次瑜伽课程，这些都能帮助你保持内心的平和与宁静。","all":"80%","health":"73%","love":"80%","money":"80%","work":"80%","number":"6","qfriend":"摩羯座"}}

					const body = JSON.parse(data);
					if (body.code == 0 && body.data) {
						const _data = body.data;
						$.notify(`今日(${_data.datetime})星座运势`, `幸运色:${_data.color}\t\t速配:${_data.number} + ${_data.qfriend}`, `整体运势:${_data.all}（工作:${_data.work}｜爱情:${_data.love}｜财运:${_data.money}｜健康:${_data.health}）`);
						// console.log(``); //打印日志
					} else {
						// throw new Error(body.msg || data);
						$.notify('今日星座运势获取异常', '', `错误码:${body.code}\n${body.msg}`);
					}
				}
			} catch (e) {
				// console.log(`执行错误: ${e.message}`);
				$.notify('今日星座运势获取异常', '', `执行错误: ${e.message}`);
			} finally {
				resolve();
			}
		})
	})
}

function argsList(data) {
    return Array.from(
        data.split("&")
            .map((i) => i.split("="))
            .map(([k, v]) => [k, decodeURIComponent(v)])
    )
        .reduce((a, [k, v]) => Object.assign(a, { [k]: v }), {})
}

function dj() {
	const isSurge = typeof $httpClient != "undefined";
	const isQuanX = typeof $task != "undefined";
	const isNode = typeof require == "function";
	const node = (() => {
		if (isNode) {
			const request = require('request');
			return {
				request
			}
		} else {
			return null;
		}
	})()
	const adapterStatus = (response) => {
		if (response) {
			if (response.status) {
				response["statusCode"] = response.status
			} else if (response.statusCode) {
				response["status"] = response.statusCode
			}
		}
		return response
	}
	this.read = (key) => {
		if (isQuanX) return $prefs.valueForKey(key)
		if (isSurge) return $persistentStore.read(key)
	}
	this.notify = (title, subtitle, message) => {
		if (isQuanX) $notify(title, subtitle, message)
		if (isSurge) $notification.post(title, subtitle, message)
		if (isNode) console.log(`${title}\n${subtitle}\n${message}`)
	}
	this.getReq = (options, callback) => {
		if (isQuanX) {
			if (typeof options == "string") options = {
				url: options
			}
			options["method"] = "GET"
			$task.fetch(options).then(response => {
				callback(null, adapterStatus(response), response.body)
			}, reason => callback(reason.error, null, null))
		}
		if (isSurge) {
			options.headers['X-Surge-Skip-Scripting'] = false
			$httpClient.get(options, (error, response, body) => {
				callback(error, adapterStatus(response), body)
			})
		}
		if (isNode) {
			node.request.get(options, (error, response, body) => {
				callback(error, adapterStatus(response), body)
			})
		}
	}
	this.postReq = (options, callback) => {
		// options.headers['User-Agent'] = 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 13_6_1 like Mac OS X) AppleWebKit/609.3.5.0.2 (KHTML, like Gecko) Mobile/17G80 BiliApp/822 mobi_app/ios_comic channel/AppStore BiliComic/822'
		if (isQuanX) {
			if (typeof options == "string") options = {
				url: options
			}
			options["method"] = "POST"
			$task.fetch(options).then(response => {
				callback(null, adapterStatus(response), response.body)
			}, reason => callback(reason.error, null, null))
		}
		if (isSurge) {
			options.headers['X-Surge-Skip-Scripting'] = false
			$httpClient.post(options, (error, response, body) => {
				callback(error, adapterStatus(response), body)
			})
		}
		if (isNode) {
			node.request.post(options, (error, response, body) => {
				callback(error, adapterStatus(response), body)
			})
		}
	}
	this.done = () => {
		if (isQuanX || isSurge) {
			$done()
		}
	}
};
