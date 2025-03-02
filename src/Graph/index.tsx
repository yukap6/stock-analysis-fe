import { useEffect, useReducer } from 'react';
import classnames from 'classnames';
import { Select } from 'antd';
import * as echarts from 'echarts/core';
import {
  BarChart,
  LineChart
} from 'echarts/charts';
import {
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  // 数据集组件
  DatasetComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
  ToolboxComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import dbSource from '../db/db';
import './index.scss';
import type { IStock } from './types';
import { getStockEveryYearValueByKey } from './functions';
import { reducers, initState } from './reducers';
import { colKeys } from './const';
import NetCashFlowVersusRetainedProfitsChart from './components/NetCashFlowVersusRetainedProfitsChart';
import SellGoodsOrServiceCashFlowVersusOperatingReceiptChart from './components/SellGoodsOrServiceCashFlowVersusOperatingReceiptChart';
import CashDoesCoverCostChart from './components/CashDoesCoverCostChart';

// 注册必须的组件
echarts.use([
  ToolboxComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

export default function Graph() {
  const [state, dispatch] = useReducer(reducers, initState);
  const {
    stocks,
    activedStockCode,
    netCashFlowVersusRatinedProfitsData,
    sellGoodsOrServiceCashFlowVersusOperatingReceiptData,
    cashDoesCoverCostData,
  } = state;

  useEffect(() => {
    const stocksObj = dbSource.reduce((prev: any, cur) => {
      const currentStockCode = cur['股票代码'];
      if (!prev[currentStockCode]) {
        prev[currentStockCode] = { data: [], name: cur['股票简称'] };
      }
      prev[currentStockCode].data.push(cur);
      return prev;
    }, {});
    const allStocks = Object.entries(stocksObj).map(([key, value]) => ({ code: key as string, name: (value as any)?.name as string, data: ((value as any)?.data || []).sort((a: any, b: any) => Number(a['年份'] - b['年份'])) }));
    const tmpActivedStock = allStocks[0];
    const tmpYearsDataOfActiveStock = tmpActivedStock.data;
    const isNeedConvertedToNumber = false;
    const years = getStockEveryYearValueByKey(tmpYearsDataOfActiveStock, colKeys.year, isNeedConvertedToNumber);
    const tmpNetCashFlow = getStockEveryYearValueByKey(tmpYearsDataOfActiveStock, colKeys.netCashFlow);
    const tmpRetainedProfits = getStockEveryYearValueByKey(tmpYearsDataOfActiveStock, colKeys.retainedProfits);
    dispatch({ type: 'setStocks', payload: allStocks });
    dispatch({ type: 'setActivedStockCode', payload: tmpActivedStock.code });
    dispatch({
      type: 'setNetCashFlowVersusRatinedProfitsData',
      payload: {
        xAxisData: years,
        netCashFlowData: tmpNetCashFlow,
        retainedProfitsData: tmpRetainedProfits,
        rateData: tmpNetCashFlow.map((item: number, itemIndex: number) => Number(item / tmpRetainedProfits[itemIndex]  * 100).toFixed(2) ),
      },
    });

    const tmpSellGoodsOrServiceCashFlowData = getStockEveryYearValueByKey(tmpYearsDataOfActiveStock, colKeys.sellGoodsOrServiceCashFlow);
    const tmpOperatingReceiptData = getStockEveryYearValueByKey(tmpYearsDataOfActiveStock, colKeys.operatingReceipt);
    dispatch({
      type: 'setSellGoodsOrServiceCashFlowVersusOperatingReceiptData',
      payload: {
        xAxisData: years,
        sellGoodsOrServiceCashFlowData: tmpSellGoodsOrServiceCashFlowData,
        operatingReceiptData: tmpOperatingReceiptData,
        rateData: tmpSellGoodsOrServiceCashFlowData.map((item: number, itemIndex: number) => Number(item / tmpOperatingReceiptData[itemIndex]  * 100).toFixed(2) ),
      },
    });

    const tmpCashAll = getStockEveryYearValueByKey(tmpActivedStock.data, colKeys.cashAll);
    const tmpInvestmentCost = getStockEveryYearValueByKey(tmpActivedStock.data, colKeys.investmentCost);
    const tmpCashBonus = getStockEveryYearValueByKey(tmpActivedStock.data, colKeys.cashBonus);
    const tmpLiabilityWithIntrest = getStockEveryYearValueByKey(tmpActivedStock.data, colKeys.liabilityWithIntrest);
    dispatch({
      type: 'setCashDoesCoverCostData',
      payload: {
        xAxisData: years,
        investmentCost: tmpInvestmentCost,
        cashBonus: tmpCashBonus,
        liabilityWithIntrest: tmpLiabilityWithIntrest,
        cashAll: tmpCashAll,
      },
    });
  }, []);

  return (
    <section className={classnames('graph', 'p-2')}>
      <div className="p-2 flex gap-2">
        <Select value={activedStockCode} onChange={(v) => { dispatch({ type: 'setActivedStockCode', payload: v }); }} className="w-48" options={stocks.map((item: IStock) => ({ label: item.name, value: item.code }))} />
      </div>
      <CashDoesCoverCostChart stockCode={activedStockCode} data={cashDoesCoverCostData} />
      <NetCashFlowVersusRetainedProfitsChart stockCode={activedStockCode} data={netCashFlowVersusRatinedProfitsData} />
      <SellGoodsOrServiceCashFlowVersusOperatingReceiptChart stockCode={activedStockCode} data={sellGoodsOrServiceCashFlowVersusOperatingReceiptData} />
    </section>
  )
}