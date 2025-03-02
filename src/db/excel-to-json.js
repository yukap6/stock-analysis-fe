const fs = require('fs');
const XLSX = require('xlsx');

// 读取 Excel 文件
const excelFilePath = './db.xlsx'; // 替换为你的 Excel 文件路径
const workbook = XLSX.readFile(excelFilePath);

// 获取第一个工作表
const sheetName = workbook.SheetNames[0]; // 默认读取第一个工作表
const sheet = workbook.Sheets[sheetName];

// 将工作表数据转换为 JSON
const jsonData = XLSX.utils.sheet_to_json(sheet);

// 将 JSON 数据写入文件
const jsonFilePath = './db.json'; // 输出的 JSON 文件路径
fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

console.log('Excel 文件已成功转换为 JSON 文件！');
console.log(`JSON 文件路径：${jsonFilePath}`);