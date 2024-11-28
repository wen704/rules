const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("app-bff/v1/version/latestupdate")) {
  obj.data = {};
} else if (url.includes("ftms-iov-app-car/tlmp/getCarCertificationInfo")) {
  obj.result.realnameStatus = "1";
} else if (url.includes("ftms-iov-app-user/user/getUserInfo")) {
  obj.result.userDefaultCarInfo.realnameStatus = "1";
} else if (url.includes("ftms-iov-app-gbook/carFunction/config/getCarFunctionConfig")) {
  obj.result.serviceAvailability.dkey = {
    "status": "1",
    "availability": "1"
  };
  obj.result.remoteControll = {
    "doorlockcancel": "1",
    "doorlock": "1",
    "hazard": "1",
    "carfinder": "1",
    "window": "1",
    "remotestart": "1"
  };
}

$done({ body: JSON.stringify(obj) });
