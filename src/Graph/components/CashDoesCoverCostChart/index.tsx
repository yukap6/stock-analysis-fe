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
import type { ICashDoesCoverCostData } from '../../types';

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
  data: ICashDoesCoverCostData,
}

export default function CashDoesCoverCostChart(props: IProps) {
  const {
    className,
    stockCode,
    data: {
      xAxisData,
      cashAll,
      investmentCost,
      cashBonus,
      liabilityWithIntrest,
    },
  } = props;
  const chartRef = useRef(null);

  useEffect(() => {
    if (!stockCode) {
      return;
    }
    
    const myChart = echarts.init(chartRef.current);
    const legends: string[] = [
      colKeys.cashAll,
      colKeys.investmentCost,
      colKeys.cashBonus,
      colKeys.liabilityWithIntrest,
    ];
    const legendRight = `比率（${colKeys.cashAll}/现金支出）`;
    const rateData: number[] = cashAll.map((cashAllItem, cashAllItemIndex) => {
      return Number((cashAllItem / (investmentCost[cashAllItemIndex] + cashBonus[cashAllItemIndex] + liabilityWithIntrest[cashAllItemIndex]) * 100).toFixed(2));
    });

    // 绘制图表
    myChart.setOption({
      title: {
        text: `${legends.join('、')}对比`,
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
          interval: 80,
          axisLabel: {
            formatter: '{value} %'
          },
          splitLine: {
            show: false  // 隐藏横向的参考线
          }
        },
      ],
      series: [
        {
          name: legends[0],
          type: 'line',
          data: cashAll,
        },
        {
          name: legends[1],
          type: 'line',
          data: investmentCost,
        },
        {
          name: legends[2],
          type: 'line',
          data: cashBonus,
        },
        {
          name: legends[3],
          type: 'line',
          data: liabilityWithIntrest,
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
  }, [stockCode, xAxisData, cashAll, liabilityWithIntrest, cashBonus, investmentCost]);

  return (
    <section className={classnames('chart-box', { className: !!className })}>
      <div className="chart-canvas" ref={chartRef} />
    </section>
  )
}