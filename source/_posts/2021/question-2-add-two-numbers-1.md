---
title: question 2. add two numbers
categories: 技术
tags:
  - Python
  - Leetcode
date: 2021-01-27 19:29:19
updated: 2021-01-27 19:29:19
---

## 题目描述

## [add two numbers](https://leetcode-cn.com/problems/add-two-numbers/)

给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

```
例1:
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807.

例2:
输入：l1 = [0], l2 = [0]
输出：[0]

例3:
输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
输出：[8,9,9,9,0,0,0,1]
```

## 思路

由题知, 两个链表相加
1. 将链表的节点依次相加, 存到新的链表中
2. 满十进一
4. 根据例3可知, 位数不足补零

所以需要中间变量存储需要进的值<br>

## 解题方法

### Python

```Python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:
        dummy = p = ListNode(None)
        midNum = 0
        while l1 or l2 or midNum:
            midNum += (l1.val if l1 else 0) + (l2.val if l2 else 0)
            p.next = ListNode(midNum % 10)
            p = p.next
            midNum //= 10
            l1 = l1.next if l1 else None 
            l2 = l2.next if l2 else None 
        return dummy.next
```

