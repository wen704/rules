const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("app-bff/v1/version/latestupdate")) {
  obj.data = {};
}

$done({ body: JSON.stringify(obj) });
