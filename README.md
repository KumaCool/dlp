**此仓库为项目前端**

**负责人**：熊俊杰

[TOC]

##相关文档
[API文档](https://www.apiview.com/p/5156#/api/list "API文档") 联系负责人查看

[架构分析图](https://www.processon.com/view/link/598abc74e4b02783dc34f58a "架构分析图")

[开发平台页面原型图](https://www.processon.com/view/link/598abcb7e4b0d7c12dfd6b03 "开发平台页面原型图")

##使用环境
- node 6+
- npm 3+
- ie 9+

##应用技术范畴
- ES6
- Less
- Vue 2.x 全家桶 *(主体框架)*
- ElementUI *(负责视图层展示)*
- Axios *(ajax)*
- Echarts 3.x *(图表、地图数据可视化展示)*
- LeafletJS *(地图服务)*

##命令行
`npm i` 初始化安装模块

`npm run dev` or `npm run start` 开发环境

`npm run build` 打包

##项目结构
+ src / *开发目录*
  + asset / *资源*
    + css /
    + images /
  + components / *公共组件*
    - com-middle.vue *功能组件调用*
    - menu.vue *左导航*
  + function / *功能组件*
  + router / *路由*
  + store / *状态管理*
  - App.vue *主框架*
  - main.js *入口文件*
+ static / *静态资源*
  + data / *模拟数据*
