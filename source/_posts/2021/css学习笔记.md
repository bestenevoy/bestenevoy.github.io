---
title: css学习笔记
categories: 技术
tags:
  - CSS
date: 2021-03-08 14:25:32
updated: 2021-03-08 14:25:32
---

1. 闭合标签
   - `<img src="http://img.png" />`
  这样一眼就可以看出这个标签已经结束了

2. `last-child`和`last-of-type`的区别
   - 使用div p:last-of-type，只会从p元素中找，会忽略其他类型元素，推荐此种方法
   - div p:last-child，这个选择器的生效条件其实是div最后一个子元素必须是p，但实际HTML结构中，总会各种类型元素夹杂穿插在一起

3. `I-C-E`特指度计算方法