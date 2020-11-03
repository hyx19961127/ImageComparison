import { parse } from 'querystring';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export function checkCurrentData(data) {
  if (data === undefined || data === null || data === ''){
    return false
  }
  return true;
}

export function checkDataType(data) {
  if (checkCurrentData(data)){
    let type = Object.prototype.toString.call(data);
    return type.substring(8,type.length-1).toLowerCase();
  }else{
    return '';
  }
}

export function checkIsMethods(func) {
  if (!checkCurrentData(func)){
    return false;
  }else {
    if (checkDataType(func) === 'function'){
      return true;
    }
    return false;
  }
}


export function isNotEmptyArray(arr) {
  if (!checkCurrentData(arr)){
    return false;
  }else {
    if (Array.isArray(arr) && arr.length > 0){
      return true;
    }
    return false;
  }
}

export function changeArrToObj(arr,valueName = 'value',textName = 'text') {
  var getValue = (ele)=>isNotEmptyObject(ele)?ele[valueName] || ele['value'] || ele['key']:'';
  var getText = (ele)=>isNotEmptyObject(ele)?ele[textName] || ele['text'] || ele['label']:'';
  if(isNotEmptyArray(arr)){
    let resObj = {};
    arr.forEach(element=>{
      resObj[getValue(element)] = getText(element);
    })
    return resObj;
  }else {
    return {};
  }
}


export function isNotEmptyObject(obj) {
  if(checkCurrentData(obj)){
    if(checkDataType(obj) === 'object'){
      let arr = Object.getOwnPropertyNames(obj);
      if (isNotEmptyArray(arr)){
        return true;
      }
    }
  }
  return false;
}

