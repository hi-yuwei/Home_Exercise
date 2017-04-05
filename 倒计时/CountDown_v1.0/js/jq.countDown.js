/**
 * Created by yy on 2016/1/26.
 */
function CountDown(startTime){
    //var startTime = "2016/01/26 16:02:00";
    var timer;
    if(startTime){
        //计算时间
        var showTimer = function () {
            var totalTime =getTime(); //当前时间的毫秒数
            var ms = initialDate(startTime);    //开始时间毫秒数
            totalTime = (ms - totalTime) / 1000;   //一共多少秒
            if (totalTime > 0) {
                var hour = Math.floor(totalTime / 3600);
                var minute = Math.floor(totalTime % 3600 / 60);
                var second = Math.floor(totalTime % 3600 % 60);
                dispose(hour, ".countdown-hour li");
                dispose(minute, ".countdown-minute li");
                dispose(second, ".countdown-second li");
            }
        };

        //处理DOM
        var dispose = function (time, element) {
            if (time < 10) {
                $(element).eq(0).text(0);
                $(element).eq(1).text(time);
            } else {
                $(element).eq(0).text(Math.floor(time / 10));
                $(element).eq(1).text(time % 10);
            }
        };

        //初始化日期格式
        function initialDate(time) {
            time = time.replace(new RegExp("-", "gm"), "/");
            return new Date(time).getTime();
        }

        //获得服务器当前时间
        function getTime() {
            var http_request;
            if (window.XMLHttpRequest) {
                http_request = new XMLHttpRequest();
            } else {
                http_request = new ActiveXObject('Microsoft.XMLHTTP');
            }
            http_request.open('HEAD', window.location.href, false);
            http_request.send(null);
            return new Date(http_request.getResponseHeader('Date')).getTime();
        }

        clearInterval(timer);
        timer = setInterval(showTimer, 1000)
    }else{
        //当开始时间为无效值
    }
}