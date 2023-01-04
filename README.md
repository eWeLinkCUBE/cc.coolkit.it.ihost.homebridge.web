**queryMdns服务开启时机**
- 无token
- token存在但过期
- 获取token的轮询倒计时结束

**queryMdns服务关闭时机**
- 轮询开启
- 根据ip搜索iHost