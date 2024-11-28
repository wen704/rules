const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("v2/yesfeng/yesList")) {
  obj.data.dataList = [];
}

$done({ body: JSON.stringify(obj) });