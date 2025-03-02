import { useEffect, useRef, } from 'react';
import classnames from 'classnames';
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
  TransformComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import './index.scss';
import { colKeys } from '../../const';
import type { ISellGoodsOrServiceCashFlowVersusOperatingReceiptData } from '../../types';

// 注册必须的组件
echarts.use([
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

interface IProps {
  className?: string;
  stockCode: string;
  data: ISellGoodsOrServiceCashFlowVersusOperatingReceiptData,
}

export default function SellGoodsOrServiceCashFlowVersusOperatingReceiptChart(props: IProps) {
  const {
    className,
    stockCode,
    data: {
      xAxisData,
      sellGoodsOrServiceCashFlowData,
      operatingReceiptData,
      rateData,
    },
  } = props;
  const chartRef = useRef(null);

  useEffect(() => {
    if (!stockCode) {
      return;
    }
    
    const myChart = echarts.init(chartRef.current);
    const legends: string[] = [colKeys.sellGoodsOrServiceCashFlow, colKeys.operatingReceipt];
    const legendRight = `比率（${colKeys.sellGoodsOrServiceCashFlow}/${colKeys.operatingReceipt}）`;
    // 绘制图表
    myChart.setOption({
      title: {
        text: `${legends[0]}与${legends[1]}对比`,
        left: 'center',
        bottom: 'bottom',
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: [...legends, legendRight],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        data: xAxisData,
      },
      yAxis: [
        {
          type: 'value',
          name: '数据',
          axisLabel: {
              formatter: '{value} 亿'
          }
        },
        {
          type: 'value',
          name: '比率',
          min: 0,
          position: 'right', // 将此y轴放置在右侧
          interval: 20,
          axisLabel: {
              formatter: '{value} %'
          },
          splitLine: {
            show: false  // 隐藏横向的参考线
          },
        },
      ],
      series: [
        {
          name: legends[0],
          type: 'line',
          data: sellGoodsOrServiceCashFlowData,
        },
        {
          name: legends[1],
          type: 'line',
          data: operatingReceiptData,
        },
        {
          yAxisIndex: 1,
          name: legendRight,
          type: 'line',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1, // 渐变方向，从左上角到右下角
              [
                  { offset: 0, color: 'rgba(255, 192, 203, 0.5)' }, // 渐变起始颜色，粉色半透明
                  { offset: 1, color: 'rgba(255, 192, 203, 0)' } // 渐变结束颜色，粉色完全透明
              ]
            )
          },
          data: rateData,
        },
      ],
    });
  }, [stockCode, xAxisData, operatingReceiptData, rateData, sellGoodsOrServiceCashFlowData]);

  return (
    <section className={classnames('chart-box', { className: !!className })}>
      <div className="chart-canvas" ref={chartRef} />
    </section>
  )
}