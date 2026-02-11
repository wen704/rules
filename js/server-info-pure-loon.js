/**
 * 节点纯净度查询
 * 感谢并修改自 https://ddgksf2013.top/scripts/server-info-pure.js
 * 脚本功能：检查节点的地理位置,纯净度
 * 原作者：ddgksf2013
*/

// $environment.params with input params
console.log($environment.params);
var url = "https://my.ippure.com/v1/info";

/**
 * build 411 版本后 添加$environment.params.nodeInfo对象，表示简单的节点信息
 * 注意：由于安全限制，nodeInfo对象中仅有一下信息
 {
    address = "example.com";
    name = "节点名称";
    port = 12443;
    tls = 1;
    type = Vmess;
}
 */
var inputParams = $environment.params;
var nodeName = inputParams.node;

/**
 * node: Specify network activity on this node
 */
var requestParams = {
    "url":url,
    "node":nodeName
}

var message = ""

$httpClient.get(requestParams, (error, response, data) => {
    if (error) {
        message = "</br></br>🔴 查询超时"
        message = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: bold;">` + message + `</p>`
        $done({"title": "节点纯净度查询", "htmlMessage": message});
    } else {
        console.log(data);
        message = data ? json2info(data) : "";
        $done({"title": "节点纯净度查询", "htmlMessage": message});
    }
})

function json2info(cnt) {
    var res = "-------------------------------";
    cnt = JSON.parse(cnt);
    console.log(cnt);

    const flag = getFlagEmoji(cnt.countryCode);
    const ip = cnt.ip || "N/A";
    const isp = cnt.asOrganization || "N/A";
    const asn = cnt.asn ? `AS${cnt.asn}` : "N/A";
    const country = `${flag} ${cnt.country} ${flags.get(cnt.countryCode.toUpperCase())}`
    const city = cnt.city || "N/A";
    const timezone = cnt.timezone || "N/A";
    const longitudeLatitude = `${cnt.longitude}, ${cnt.latitude}`;
    const postalCode = cnt.postalCode || "N/A";
    const typeStr = cnt.isResidential ? "住宅网络 🏠" : "数据中心 🏢";
    const score = cnt.fraudScore || 0;
    const riskInfo = `${score}（${getRiskLevel(score)}）`;
    const isBroadcastStr = cnt.isBroadcast ? "是" : "否";
    const ua = cnt.userAgent || "N/A";

    const infos = [
        ["远端 IP 地址", ip],
        ["远端 IP ASN", asn],
        ["ASN 所属机构", isp],
        ["远端 IP 国家", country],
        ["远端 IP 城市", city],
        ["远端 IP 时区", timezone],
        ["远端 IP 经纬度", longitudeLatitude],
        ["远端 IP 邮编", postalCode],
        ["远端 IP 类型", typeStr],
        ["远端 IP 纯净度", riskInfo],
        ["是否为广播 IP", isBroadcastStr],
        ["User-Agent", ua]
    ];

    infos.forEach(item => {
        res += `</br><b><font color=>${item[0]}：</font></b><font color=>${item[1]}</font></br>`;
    });

    res = res + "-------------------------------" + "</br>" + "<font color=#6959CD>" + "<b>节点</b> ➟ " + $environment.params.node + "</font>";
    res = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + res + `</p>`;
    return res;
}

function getRiskLevel(score) {
    if (score <= 25) return "<font color='#28a745'>低风险 ✅</font>"; // 0-25 绿色
    if (score <= 50) return "<font color='#ffc107'>中风险 🟡</font>"; // 26-50 黄色
    if (score <= 75) return "<font color='#ff8c00'>高风险 ⚠️</font>"; // 51-75 橙色
    return "<font color='#dc3545'>极高风险 ‼️</font>"; // 76-100 红色
}

function getFlagEmoji(countryCode) {
    if (!countryCode) return "🌍";
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

var flags = new Map([[ "AC" , "🇦🇨" ] ,["AE","🇦🇪"], [ "AF" , "🇦🇫" ] , [ "AI" , "🇦🇮" ] , [ "AL" , "🇦🇱" ] , [ "AM" , "🇦🇲" ] , [ "AQ" , "🇦🇶" ] , [ "AR" , "🇦🇷" ] , [ "AS" , "🇦🇸" ] , [ "AT" , "🇦🇹" ] , [ "AU" , "🇦🇺" ] , [ "AW" , "🇦🇼" ] , [ "AX" , "🇦🇽" ] , [ "AZ" , "🇦🇿" ] , ["BA", "🇧🇦"], [ "BB" , "🇧🇧" ] , [ "BD" , "🇧🇩" ] , [ "BE" , "🇧🇪" ] , [ "BF" , "🇧🇫" ] , [ "BG" , "🇧🇬" ] , [ "BH" , "🇧🇭" ] , [ "BI" , "🇧🇮" ] , [ "BJ" , "🇧🇯" ] , [ "BM" , "🇧🇲" ] , [ "BN" , "🇧🇳" ] , [ "BO" , "🇧🇴" ] , [ "BR" , "🇧🇷" ] , [ "BS" , "🇧🇸" ] , [ "BT" , "🇧🇹" ] , [ "BV" , "🇧🇻" ] , [ "BW" , "🇧🇼" ] , [ "BY" , "🇧🇾" ] , [ "BZ" , "🇧🇿" ] , [ "CA" , "🇨🇦" ] , [ "CF" , "🇨🇫" ] , [ "CH" , "🇨🇭" ] , [ "CK" , "🇨🇰" ] , [ "CL" , "🇨🇱" ] , [ "CM" , "🇨🇲" ] , [ "CN" , "🇨🇳" ] , [ "CO" , "🇨🇴" ] , [ "CP" , "🇨🇵" ] , [ "CR" , "🇨🇷" ] , [ "CU" , "🇨🇺" ] , [ "CV" , "🇨🇻" ] , [ "CW" , "🇨🇼" ] , [ "CX" , "🇨🇽" ] , [ "CY" , "🇨🇾" ] , [ "CZ" , "🇨🇿" ] , [ "DE" , "🇩🇪" ] , [ "DG" , "🇩🇬" ] , [ "DJ" , "🇩🇯" ] , [ "DK" , "🇩🇰" ] , [ "DM" , "🇩🇲" ] , [ "DO" , "🇩🇴" ] , [ "DZ" , "🇩🇿" ] , [ "EA" , "🇪🇦" ] , [ "EC" , "🇪🇨" ] , [ "EE" , "🇪🇪" ] , [ "EG" , "🇪🇬" ] , [ "EH" , "🇪🇭" ] , [ "ER" , "🇪🇷" ] , [ "ES" , "🇪🇸" ] , [ "ET" , "🇪🇹" ] , [ "EU" , "🇪🇺" ] , [ "FI" , "🇫🇮" ] , [ "FJ" , "🇫🇯" ] , [ "FK" , "🇫🇰" ] , [ "FM" , "🇫🇲" ] , [ "FO" , "🇫🇴" ] , [ "FR" , "🇫🇷" ] , [ "GA" , "🇬🇦" ] , [ "GB" , "🇬🇧" ] , [ "HK" , "🇭🇰" ] ,["HU","🇭🇺"], [ "ID" , "🇮🇩" ] , [ "IE" , "🇮🇪" ] , [ "IL" , "🇮🇱" ] , [ "IM" , "🇮🇲" ] , [ "IN" , "🇮🇳" ] , [ "IS" , "🇮🇸" ] , [ "IT" , "🇮🇹" ] , [ "JP" , "🇯🇵" ] , [ "KR" , "🇰🇷" ] , [ "LU" , "🇱🇺" ] , [ "MO" , "🇲🇴" ] , [ "MX" , "🇲🇽" ] , [ "MY" , "🇲🇾" ] , [ "NL" , "🇳🇱" ] , [ "PH" , "🇵🇭" ] , [ "RO" , "🇷🇴" ] , [ "RS" , "🇷🇸" ] , [ "RU" , "🇷🇺" ] , [ "RW" , "🇷🇼" ] , [ "SA" , "🇸🇦" ] , [ "SB" , "🇸🇧" ] , [ "SC" , "🇸🇨" ] , [ "SD" , "🇸🇩" ] , [ "SE" , "🇸🇪" ] , [ "SG" , "🇸🇬" ] , [ "TH" , "🇹🇭" ] , [ "TN" , "🇹🇳" ] , [ "TO" , "🇹🇴" ] , [ "TR" , "🇹🇷" ] , [ "TV" , "🇹🇻" ] , [ "TW" , "🇨🇳" ] , [ "UK" , "🇬🇧" ] , [ "UM" , "🇺🇲" ] , [ "US" , "🇺🇸" ] , [ "UY" , "🇺🇾" ] , [ "UZ" , "🇺🇿" ] , [ "VA" , "🇻🇦" ] , [ "VE" , "🇻🇪" ] , [ "VG" , "🇻🇬" ] , [ "VI" , "🇻🇮" ] , [ "VN" , "🇻🇳" ] , [ "ZA" , "🇿🇦"]])