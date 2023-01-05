export default {
    SETTINGS: {
        GET_TOKEN_TIP: '使用 Plugin name 必须获取 token，获取方式如下',
        STEP_1: 'Step 1: 点击“获取 token”按钮',
        STEP_2: 'Step 2: 前往 iHost 中控台点击“获取凭证弹框”的“确认”按钮',
        TIP_1: '当Homebridge未运行在iHost上时，可点击“添加iHost”按钮，输入IP来连接你要去获取token的iHost',
        TIP_2: '如果更换了iHost，需要重新获取token，同时会清除已添加到HomeKit里的配件',
        INVALID_TOKEN: 'token已失效，请重新获取token',
        GET_TOKEN: '获取 token',
        RE_GET_TOKEN: '重新获取',
        ALREADY_GET_TOKEN: '已获取 token',
        QUERY_IHOST: 'IP查找iHost',
        ADD_IHOST_PLACEHOLDER: '请输入要添加的iHost的IP',
        INPUT_NULL: '*IP 不能为空',
        NOT_MATCH_IPV4: '*不符合ipv4',
        LINK_FAILED: '*IP 连接失败',
        EXISTED_IP: '*IP 已存在',
        LOG_FEAT: '日志中显示设备事件',
        LOG_DESC: '选中后将会在日志中记录设备事件更改'
    },
    DEVICES: {
        UNABLE_GET_DEVICE: '无法获取设备，请先获取token',
        NO_DEVICE: '暂无设备',
        TIP: '取消选中设备，设备将不会显示在 HomeKit',
        SWITCH: '开关插座',
        LIGHT: '灯',
        SENSOR: '传感器',
        CURTAIN: '窗帘',
        OTHER_DEVICES: '其他设备',
        TEMP_NOT_SUPPORT: '暂不支持'
    }
}