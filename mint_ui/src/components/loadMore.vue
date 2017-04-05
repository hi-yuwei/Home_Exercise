<template>

  <mt-loadmore :topPullText="uptxt" :bottomPullText="downtxt" :autoFill="auto" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
    <div class="hello">
    <ul>
      <li>1</li>
      <li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li><li>1</li>
    </ul>
      </div>
    </mt-loadmore>

</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      uptxt:'',
      downtxt:'',
      allLoaded:false,
      auto:true
    }
  },
  methods:{
    loadTop:function(){
      console.log(1);
      this.$refs.loadmore.onTopLoaded();
    },
    loadBottom:function(){
      console.log(2)
       this.$refs.loadmore.onBottomLoaded();
    },
    allLoaded:function(){

    }
  }
}
</script>
<style>
  *{
    margin:0;
    padding:0;
  }
  ul li {
    list-type:none;
    margin-top:10px;
  }
</style>