export interface IStock {
  name: string;
  code: string;
  data?: {
    [index: string]: any
  };
}

export interface INetCashFlowVersusRetainedProfitsData {
  xAxisData: string[];
  netCashFlowData: number[];
  retainedProfitsData: number[];
  rateData: number[];
}

export interface ISellGoodsOrServiceCashFlowVersusOperatingReceiptData {
  xAxisData: string[];
  sellGoodsOrServiceCashFlowData: number[];
  operatingReceiptData: number[];
  rateData: number[];
}

export interface IAction {
  type: string;
  payload: any;
}

export interface ICashDoesCoverCostData {
  xAxisData: string[];
  cashAll: number[];
  investmentCost: number[];
  cashBonus: number[];
  liabilityWithIntrest: number[];
}

export interface IState {
  netCashFlowVersusRatinedProfitsData: INetCashFlowVersusRetainedProfitsData;
  stocks: IStock[];
  activedStockCode: string;
  sellGoodsOrServiceCashFlowVersusOperatingReceiptData: ISellGoodsOrServiceCashFlowVersusOperatingReceiptData;
  cashDoesCoverCostData: ICashDoesCoverCostData;
}