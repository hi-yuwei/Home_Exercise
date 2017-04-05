/**
 * Created by Administrator on 2016/6/19.
 */
window._bd_share_config = {
    common : {
        bdText : document.title,
        bdDesc : $('.con').html(),
        //注意本地测试时，如果地址是locathost无效，可以将地址改为127.0.0.1
        bdUrl : location.href
    },
    share : [{
        "bdSize" : 16
    }]
}
with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion='+~(-new Date()/36e5)];