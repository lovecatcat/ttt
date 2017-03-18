var SHA256 = require('crypto-js/SHA256')

var str = 'channel_id=000032&channel_order_no=99000000000155573&goods_desc='+encodeURIComponent('平安e生保')+'&notify_url='+encodeURIComponent('https://www.baidu.com')+'&return_url='+encodeURIComponent('https://www.baidu.com')+'&total_fee=24900KOGVURQHB2V369GS2Q6FZD3ZPY15ZK3I'
console.log(str)
console.log(SHA256(str)+'')