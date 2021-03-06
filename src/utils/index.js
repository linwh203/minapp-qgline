function formatNumber(n) {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
}

export function formatTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const t1 = [year, month, day].map(formatNumber).join("/");
  const t2 = [hour, minute, second].map(formatNumber).join(":");

  return `${t1} ${t2}`;
}

export const formatDate = (time, YYYY) => {
  let t = parseInt(time);
  let d = new Date(t),
    year = d.getFullYear(),
    month = d.getMonth() + 1,
    date = d.getDate(),
    hour = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours(),
    minute = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes(),
    second = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds();
  if (YYYY) {
    return year + "-" + month + "-" + date + " " + hour + ":" + minute;
  } else {
    return month + "月" + date + "日" + hour + ":" + minute;
  }
};

export const config = {
  prefix: "https://qgx.funsomestudio.com",
  base: "https://qgx.funsomestudio.com/guidewechat/",
  lineId: "F8F6CA62-2B02-4A09-AB50-0575321B0C89",
  appId: "wx64104ee36c863058",
  appSecret: "1b3f1d4dc4d895247c60d0d426aca413"
};
//儿童线
// AppID：wxb6db5e06d4a0078a
// AppSecret：8035eac66a0427e510aedb20b1a3af08

// 青古线
// appid：wx64104ee36c863058
// appsecret：1b3f1d4dc4d895247c60d0d426aca413
