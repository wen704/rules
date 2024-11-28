const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("app-bff/v1/version/latestupdate")) {
  obj.data = {};
} else if (url.includes("ftms-iov-app-car/tlmp/getCarCertificationInfo")) {
  obj.result.realnameStatus = "1";
}

$done({ body: JSON.stringify(obj) });
