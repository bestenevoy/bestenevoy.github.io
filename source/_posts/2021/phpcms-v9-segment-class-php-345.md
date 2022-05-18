---
title: phpcms v9 segment.class.php|345 错误解决方法
categories: 技术
tags:
  - PHP
date: 2021-02-04 09:48:23
updated: 2022-05-19 02:12:22
---

这两天服务器环境升级了php到7.1.*，然后使用phpcms V9添加或编辑文章时都会遇到500错误。<br>
查看error_log文件，看到一堆`Illegal string offset ‘**’ | phpcms/libs/classes/segment.class.php | 345`这样的错误。<br>
查看 segment.class.php 文件的345行，附近的代码是：

```diff
  function get_keyword($str,$ilen=-1) {
    if($str=='') return '';
    else $this->split_result($str,true,true);
    $okstr = $this->result_string;
    $ws = explode(' ',$okstr);
    $okstr = $wks = '';
    foreach($ws as $w) {
      $w = trim($w);
      if(strlen($w)<2) continue;
      if(!preg_match("/[^0-9:-]/",$w)) continue;
	  if(strlen($w)==2&&ord($w[0])>0x80) continue;
+	  if($wks=='') $wks=array();
	  if(isset($wks[$w])) $wks[$w]++;
      else $wks[$w] = 1;
    }
    ....
```

看来问题出在`$wks`这个变量上（字符串变量直接当数组使用）。查看前面的代码，`$wks`的赋值是：`$okstr = $wks = '';` ，后来通过搜索得知：PHP7开始，对于数据类型的隐式转换做了调整，String无法隐式转换成Array了。

所以，问题就出在`$wks`一开始是字符串，后面的代码又直接把他当数组用，再新版PHP中就会出错。所以解决方法应该是在344行前面增加一行：`if($wks=="") $wks=array()`;

经过测试，此方法有效。