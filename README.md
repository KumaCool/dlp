**此仓库为项目前端**

**负责人**：熊俊杰

[TOC]

##相关文档
[API文档](https://www.apiview.com/p/5156#/api/list "API文档") 联系负责人查看

[架构分析图](https://www.processon.com/view/link/596c804ce4b064b2bffd4598 "架构分析图")

##使用环境
- node 6.11.0
- npm 3.10.10
- ie9+

##应用技术
- ES6
- Less
- Vue2 / Vue-Router
- ElementUI

##命令行
`npm i` 初始化安装模块

`npm run dev` or `npm run start` 开发环境

`npm run build` 打包

##项目结构
>+ src / *开发目录*
 + asset / *静态资源*
   + css /
   + images /
 + components / *公共组件*
   - com-middle.vue *功能组件调用*
   - menu.vue *左导航*
 + function / *功能组件*
 + router / *路由*
 - App.vue *主框架*
 - main.js *入口文件*