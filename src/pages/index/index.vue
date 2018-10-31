<template>
  <div class="container">
    <div class="index-tab">
      <div class="index-tab-item icon-list" @click="bindTab('../list/main')">
        <img src="../../assets/icon-index-list.png" alt="">
      </div>
      <div class="index-tab-item icon-map" @click="bindTab('../map/main')">
        <img src="../../assets/icon-index-map.png" alt="">
      </div>
      <div class="index-tab-item icon-scan" @click="bindTab('../scan/main')">
        <img src="../../assets/icon-index-scan.png" alt="">
      </div>
      <div class="index-tab-item icon-quiz" @click="bindTab('../quiz/main')">
        <img src="../../assets/icon-index-quiz.png" alt="">
      </div>
      <div class="index-tab-item icon-my" @click="bindTab('../my/main')">
        <img src="../../assets/icon-index-my.png" alt="">
      </div>
    </div>
    
    <img src="../../assets/bg-index.jpg" alt="" class="index-bg">
  </div>
</template>

<script>
import { config } from '../../utils/index';

export default {
  data() {
    return {

    };
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
        url: config.base + 'spot/list', //开发者服务器接口地址",
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
    // wx.login({
    //   success: (res) => {
    //     console.log(res)
    //     this.login(res.code);
    //   }
    // }); 
    // this.getSpot();
  }
};
</script>

<style scoped lang="less">
.container {
  position: relative;
}
.index-tab {
  position: absolute;
  bottom: 15rpx;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  &-item {
    width: 100rpx;
    height: 110rpx;
  }
}
.index-list-padding{
  position: absolute;
  bottom: 220rpx;
  left: 0;
  height: 40px;
  width: 100%;
  background: transparent;
}
.index-list {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  &-box{
    padding-top: 40rpx;
    height: 180rpx;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  &-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-img {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      background: #fff;
      margin-bottom: 12rpx;
    }
    &-title{
      width: 160rpx;
      color:#fff;
      font-size:20rpx;
      text-align: center;
    }
  }
  &-close{
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    position: fixed;;
    bottom: 180rpx;
    right: 74rpx;
    z-index: 999;
    background: rgba(0, 0, 0, .7);
    display: flex;
    align-items: center;
    justify-content: center;
    &-body{
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      background: rgba(0, 0, 0, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        width: 32rpx;
        height: 32rpx;
        display: block;
      }
    }
  }
}
.index-bg {
  width: 100%;
  height: 100%;
  display: block;
}

img {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
