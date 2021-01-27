---
title: 'Warning: Prop ''href'' did not match'
date: 2021-01-26 19:11:00
updated: 2021-01-27 13:45:13
categories: 技术
tags: 
 - Nextjs
 - React
 - Bug
---

### Warning: Prop 'href' did not match.

#### from

```jsx
<Link href="link.html"></Link>
```

#### to

```jsx
<Link href="/link.html" as="/link.html"></Link>
```