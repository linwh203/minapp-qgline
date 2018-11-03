<template>
  <div class="container" :style="{height:bodyHeight}">
    <div class="index-tab">
      <div class="index-tab-item icon-map" @click="bindTab('../map/main')">
        <img src="https://gw.alicdn.com/tfs/TB1hOhEmMDqK1RjSZSyXXaxEVXa-90-101.png" alt="">
      </div>
      <div class="index-tab-item icon-list" @click="showRoadName">
        <img src="https://gw.alicdn.com/tfs/TB1gqFKmHvpK1RjSZFqXXcXUVXa-91-101.png" alt="">
      </div>
      <div class="index-tab-item icon-scan" @click="bindTab('../scan/main')">
        <img src="https://gw.alicdn.com/tfs/TB1gWBKmHvpK1RjSZFqXXcXUVXa-91-101.png" alt="">
      </div>
      <div class="index-tab-item icon-audio" @click="playAudio">
        <img src="https://gw.alicdn.com/tfs/TB1PStFmSzqK1RjSZFLXXcn2XXa-91-101.png" alt="">
      </div>
      <div class="index-tab-item icon-quiz" @click="bindTab('../quiz/main')">
        <img src="https://gw.alicdn.com/tfs/TB1mz8HmQvoK1RjSZFNXXcxMVXa-91-101.png" alt="">
      </div>
      <div class="index-tab-item icon-rule" @click="bindTab('../my-rule/main')">
        <img src="https://gw.alicdn.com/tfs/TB1QrFHmSzqK1RjSZFHXXb3CpXa-91-100.png" alt="">
      </div>
      <div class="index-tab-item icon-my" @click="bindTab('../my/main')">
        <img src="https://gw.alicdn.com/tfs/TB1TXlImMHqK1RjSZFgXXa7JXXa-92-99.png" alt="">
      </div>
      <div class="index-tab-line"></div>
    </div>
    <div scroll-y class="scroll" >
      <div class="scroll-title">
        <img :src="titleSrc" class="scroll-title-pic">
        <img src="https://gw.alicdn.com/tfs/TB1ZJh6mSzqK1RjSZPxXXc4tVXa-245-52.png" class="scroll-title-text">
        <img src="https://gw.alicdn.com/tfs/TB1jUCamRLoK1RjSZFuXXXn0XXa-343-214.png" class="scroll-title-body">
      </div>
      <div class="spot">
        <div class="spot-first" :class="activeIndex == 1?'active':''">1</div>
        <div class="spot-item" v-for="(item,index) in fullSpot" :key="index">{{item}}</div>
      </div>
      <img src="https://gw.alicdn.com/tfs/TB1IvF1mSzqK1RjSZFHXXb3CpXa-580-9295.png" mode="widthFix" class="scroll-road">
      <img src="https://gw.alicdn.com/tfs/TB1xbXBmSzqK1RjSZFpXXakSXXa-532-8080.png" mode="widthFix" class="scroll-bg">
    </div>
  </div>
</template>

<script>
import { config } from '../../utils/index';

export default {
  data() {
    return {
      activeIndex:1,
      titleSrc:'https://gw.alicdn.com/tfs/TB1K_SBi4jaK1RjSZFAXXbdLFXa-222-146.png',
      fullSpot:[]
    };
  },

  computed: {
    bodyHeight() {
      let l = this.fullSpot.length
      let full_h = 1000,full_s = 89
      let h = parseInt(l*full_h/full_s)
      return `${h}%`
    }
  },

  components: {},

  methods: {
    setStorage(key, val) {
      try {
        wx.setStorageSync(key,val)
      } catch(e) {
        wx.setStorage(key,val)
      }
    },
    getStorage(key) {
      try {
        wx.getStorageSync(key)
      } catch(e) {
        wx.getStorage(key)
      }
    },
    bindTab(url) {
      wx.navigateTo({ url: url });
    },
    showRoadName() {

    },
    playAudio() {

    },
    login(code) {
      const userInfo = wx.getStorageSync('userInfo');
      wx.request({
        url: config.base + 'wxlogin/login',
        data: {
          code: code,
          lineId: config.lineId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          city: userInfo.city,
          province: userInfo.province,
          country: userInfo.country
        }, 
        method: 'GET',
        dataType: 'json', 
        success: res => {
          // console.log('login',res.data.data)
          this.setStorage('userCode',res.data.data)
        },
        fail: err => {
          console.log('hasError',err)
        }
      });
    },
    getSpot() {
      const self = this
      wx.request({
        url: config.base + 'attraction/list', //开发者服务器接口地址",
        data: {
          lineId:config.lineId
        }, //请求的参数",
        method: 'GET',
        dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          // console.log(res)
          // self.GLOBAL.spot_list = res.data.data
          this.setStorage('spotList',res.data.data)
        },
        fail: () => {},
        complete: () => {}
      });
    }
  },

  created() {
    wx.login({
      success: (res) => {
        console.log(res)
        this.login(res.code);
      }
    }); 
    for(let i=2; i<90;i++){
      this.fullSpot.push(i)
    }
  },
  mounted() {
    this.getSpot();
    // console.log(this.GLOBAL);
  },
  onLoad() {
    // 判断是否第一次使用
    const firsttime = wx.getStorageSync("firsttime");
    if (!firsttime) {
      const url = "../first/main";
      wx.redirectTo({ url: url });
    } else {
      console.log(firsttime);
    }
  },
  onShow() {
  }
};
</script>

<style scoped lang="less">
// z-index: 右上角菜单，21,顶部标题图，21
.container {
  position: relative;
  overflow: hidden;
}
.spot{
  width: 100%;
  position: absolute;
  top: 2.8%;
  &-first{
    position: relative;
    z-index:2;
    width: 64rpx;
    height: 64rpx;
    line-height: 64rpx;
    text-align: center;
    color:#fff;
    font-size: 34rpx;
    background: url('https://gw.alicdn.com/tfs/TB1LC9gmH2pK1RjSZFsXXaNlXXa-60-70.png') no-repeat center/contain;
    margin-bottom: 56rpx;
    margin-left: 400rpx;
  }
  &-first.active{
    background: red;
  }
  &-item{
    position: relative;
    z-index:2;
    width: 64rpx;
    height: 64rpx;
    line-height: 64rpx;
    text-align: center;
    color:#fff;
    font-size: 34rpx;
    background: url('https://gw.alicdn.com/tfs/TB1LC9gmH2pK1RjSZFsXXaNlXXa-60-70.png') no-repeat center/contain;
    margin-bottom: 7.4%;
  }
  &-item:nth-of-type(6n+2){
    margin-left: 520rpx;
  }
  &-item:nth-of-type(6n+3){
    margin-left: 400rpx;
  }
  &-item:nth-of-type(6n+1){
    margin-left: 400rpx;
  }
  &-item:nth-of-type(6n+4){
    margin-left: 260rpx;
  }
  &-item:nth-of-type(6n){
    margin-left: 260rpx;
  }
  &-item:nth-of-type(6n+5){
    margin-left: 140rpx;
  }
}
.scroll{
  position: relative;
  &-title{
    width: 402rpx;
    height: 234rpx;
    position: fixed;
    top:0.1%;  
    left: 0;right: 0;margin:auto;
    z-index: 21;
    &-body{
      width: 402rpx;
      height: 230rpx;
      position: absolute;
      top: 68rpx;
      z-index:22;
    }
    &-text{
      width: 286rpx;
      height: 60rpx;
      position: absolute;
      top: 180rpx;left: 0;right: 0;margin:auto;
      z-index:23;
    }
    &-pic{
      width: 210rpx;
      height: 210rpx;
      border-radius: 50%;
      overflow: hidden;
      position: absolute;
      top: 0;left: 0;right: 0;margin:auto;
      border:12rpx solid #292770;
    }
  }
  &-road{
    width:90%;
    position: absolute;
    top:2%;  

  }
  &-bg{
    width: 100%;
  }
}
.index-tab {
  position: fixed;
  top: 15rpx;
  right: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  z-index:21;
  &-item {
    width: 100rpx;
    height: 110rpx;
    margin-bottom:36rpx;
    position: relative;
    z-index: 23;
  }
  &-line {
    width: 1px;
    height:90%;
    background-image: url('https://gw.alicdn.com/tfs/TB1B10KmFzqK1RjSZSgXXcpAVXa-2-762.png');
    background-repeat: repeat-y;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 10rpx;
    right: 32rpx;
    z-index:22;
  }
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
