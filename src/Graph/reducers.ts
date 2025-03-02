import type { IAction, IState } from './types';

export const initState: IState = {
  cashDoesCoverCostData: {
    cashAll: [],
    investmentCost: [],
    cashBonus: [],
    liabilityWithIntrest: [],
    xAxisData: [],
  },
  netCashFlowVersusRatinedProfitsData: {
    xAxisData: [],
    netCashFlowData: [],
    retainedProfitsData: [],
    rateData: [],
  },
  sellGoodsOrServiceCashFlowVersusOperatingReceiptData: {
    xAxisData: [],
    sellGoodsOrServiceCashFlowData: [],
    operatingReceiptData: [],
    rateData: [],
  },
  stocks: [],
  activedStockCode: '',
};

export function reducers(prevState: IState, action: IAction) {
  const { type, payload } = action;
  switch (type) {
    case 'setCashDoesCoverCostData':
      return { ...prevState, cashDoesCoverCostData: payload };
    case 'setActivedStockCode':
      return { ...prevState, activedStockCode: payload };
    case 'setStocks':
      return { ...prevState, stocks: payload };
    case 'setNetCashFlowVersusRatinedProfitsData':
      return { ...prevState, netCashFlowVersusRatinedProfitsData: payload };
    case 'setSellGoodsOrServiceCashFlowVersusOperatingReceiptData':
      return { ...prevState, sellGoodsOrServiceCashFlowVersusOperatingReceiptData: payload };
    default:
      return prevState;
  }
}