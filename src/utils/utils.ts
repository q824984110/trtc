/**
 * 从 window.location.href 中获取指定key的value
 * @param {*} key 要获取的 key
 * @returns window.location.href 中指定key对应的value
 * @example
 * const value = getUrlParam(key);
 */
export function getUrlParam(key: string): string {
  const url = decodeURI(window.location.href.replace(/^[^?]*\?/, ''));
  const regexp = new RegExp(`(^|&)${key}=([^&#]*)(&|$|)`, 'i');
  const paramMatch = url.match(regexp);

  return paramMatch ? paramMatch[2] : '';
}

export const getParamKey: any = (key: string) => {
  if (getUrlParam(key)) {
    return getUrlParam(key);
  }
  switch (key) {
    case 'userId':
      return `user_${Math.floor(Math.random() * 100000000)}`;
    case 'roomId':
      return Math.floor(Math.random() * 100000);
    case 'sdkAppId':
      return undefined;
    case 'secretKey':
      return undefined;
    default:
      return undefined;
  }
};

/**
 * 当前浏览器是否为移动端浏览器
 */
export const isMobile: boolean = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/**
 * 判断设备是否连接网络
 */
 export function isOnline() {
  const url = 'https://web.sdk.qcloud.com/trtc/webrtc/assets/trtc-logo.png';
  return new Promise((resolve) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(true);
      };
      xhr.onerror = function () {
        resolve(false);
      };
      xhr.open('GET', url, true);
      xhr.send();
    } catch (err) {
      // console.log(err);
    }
  });
}