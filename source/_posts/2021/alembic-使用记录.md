---
title: alembic 使用记录
categories: 技术
tags:
  - Python
  - FastApi
  - alembic
  - SQLAlchemy
date: 2021-01-31 22:45:54
updated: 2022-05-19 02:58:40
---

## 1. 安装

`pip install alembic`

在项目根目录

`alembic init alembic`

## 2. 配置

配合 `SQLAlchemy` 使用

```python
# app.db
from sqlalchemy.ext.declarative import as_declarative, declared_attr

SQLALCHEMY_DATABASE_URL = postgres://<user>:<password>@localhost/<dbname>

@as_declarative()
class BaseModel:
    id: Any
    __name__: str
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()
```

修改 `env.py`

```diff
# env.py
+ from app.db import BaseModel, SQLALCHEMY_DATABASE_URL  # noqa
# SQLALCHEMY_DATABASE_URL 和 根目录下 `alembic.ini` 的 sqlalchemy.url 结构相同
# 也可以直接修改 `alembic.ini` 的 sqlalchemy.url
# 导入所有的模型
+ from app.modules import models # noqa
+ target_metadata = BaseModel.metadata

def run_migrations_offline():
-    # url = config.get_main_option("sqlalchemy.url")
+    url = SQLALCHEMY_DATABASE_URL
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
+    configuration = config.get_section(config.config_ini_section)
    # 必须修改这个
+    configuration["sqlalchemy.url"] = SQLALCHEMY_DATABASE_URL
+    connectable = engine_from_config(
+        configuration, prefix="sqlalchemy.", poolclass=pool.NullPool,
+    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata, compare_type=True
        )
        with context.begin_transaction():
            context.run_migrations()
```

## 3. Migrate

### step1

提交的信息最好说明修改内容和日期: `210201 修改 user`

```sh
alembic revision --autogenerate -m "init commit"
```

### step2

`alembic upgrade head`

## 4. 遇到的问题

4.1 第二步卡住假死, 一般是因为数据库锁死

- 可重新启动数据库, 然后重新执行 `alembic upgrade head`

4.2 想删除 `versions` 目录下的迁移文件, 重新开始.

- 将数据库中 `alembic_version`表 删除
