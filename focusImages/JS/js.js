/**
 * Created by Administrator on 2016/3/19.
 */
var images={
    i:0,
    imgs:document.getElementById("imagslist").getElementsByTagName("li"),
    timing:null,
    time:1000,
    run:function(){
        ++this.i;
        for(var j=0;j<this.imgs.length;j++){
            imgs[j].style.display=none;
        }
        imgs[i].style.display=block;
    },
    play:function(){
        console.log(this.imgs.length);
        clearInterval(this.timing);
        //this.timing=setInterval(this.run,this.time);
    }
}