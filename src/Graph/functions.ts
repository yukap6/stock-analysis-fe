// import type { IStock } from './types';

export function translateStrToNumber(v: string, baseUnit = 100000000, suffix = 2) {
  return Number((Number(String(v).replaceAll('%', '').replaceAll(",", ''))/baseUnit).toFixed(suffix));
}

export function getStockEveryYearValueByKey(data: { [index: string]: string }[], keyName: string = '', isNumber: boolean = true) { 
  return data.map((item: any) => isNumber ? translateStrToNumber(item[keyName]) : item[keyName]);
}