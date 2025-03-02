import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
// for date-picker i18n
import 'dayjs/locale/zh-cn';
import './App.css';
import Graph from './Graph';

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#00b96b' } }}>
      <div className="App">
        <Graph />
      </div>
    </ConfigProvider>
  );
}

export default App;
