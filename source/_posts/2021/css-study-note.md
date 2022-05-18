---
title: CSS Study Note
categories: 技术
tags:
  -  CSS
date: 2021-03-01 16:30:00
updated: 2022-05-19 02:12:22
---

1. 关于`display:inline-block;` 
   - 行内块，会导致有行间距，并且不在盒子模型上显示

2. `background: rgba(#fff, 0.1);`

3. self-close tag  `<img src="http://img.png" />` 
   - 这样一眼就可以看出这个标签已经结束了

4. `last-child`和`last-of-type`的区别
   - 使用div p:last-of-type，只会从p元素中找，会忽略其他类型元素，推荐此种方法
   - div p:last-child，这个选择器的生效条件其实是div最后一个子元素必须是p，但实际HTML结构中，总会各种类型元素夹杂穿插在一起

5. `I-C-E`特指度计算方法
