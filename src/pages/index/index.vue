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
    <!-- <scroll-view scroll-x class="index-list" v-if="listView">
      <div class="index-list-box">
        <div class="index-list-item">
          <div class="index-list-item-img"><img src="../../assets/list-pic-1.png" alt=""></div>
          <div class="index-list-item-title">深圳多样的生命</div>
        </div>
        <div class="index-list-item">
          <div class="index-list-item-img"><img src="../../assets/list-pic-2.png" alt=""></div>
          <div class="index-list-item-title">哦,你就是蝴蝶</div>
        </div>
        <div class="index-list-item">
          <div class="index-list-item-img"><img src="../../assets/list-pic-3.png" alt=""></div>
          <div class="index-list-item-title">生命的互联网故事</div>
        </div>
        <div class="index-list-item">
          <div class="index-list-item-img"><img src="../../assets/list-pic-4.png" alt=""></div>
          <div class="index-list-item-title">看花识蔬菜</div>
        </div>
        <div class="index-list-item">
          <div class="index-list-item-img"><img src="../../assets/list-pic-5.png" alt=""></div>
          <div class="index-list-item-title">农科院基地的候鸟</div>
        </div>
        <div class="index-list-item">
          <div class="index-list-item-img"><img src="../../assets/list-pic-6.png" alt=""></div>
          <div class="index-list-item-title">大眼睛飞行侠蜻蜓</div>
        </div>
        <div class="index-list-item">
          <div class="index-list-item-img"><img src="../../assets/list-pic-7.png" alt=""></div>
          <div class="index-list-item-title">外星人--昆虫</div>
        </div>
        <div class="index-list-item">
          <div class="index-list-item-img"><img src="../../assets/list-pic-8.png" alt=""></div>
          <div class="index-list-item-title">如何种植水稻</div>
        </div>
        <div class="index-list-item">
          <div class="index-list-item-img"><img src="../../assets/list-pic-9.png" alt=""></div>
          <div class="index-list-item-title">飞吧，鸟儿们</div>
        </div>
        <div class="index-list-item">
          <div class="index-list-item-img"><img src="../../assets/list-pic-10.png" alt=""></div>
          <div class="index-list-item-title">听一场自然音乐会</div>
        </div>
      </div>
    </scroll-view>
    <div class="index-list-close" v-if="listView">
      <div class="index-list-close-body" @click="hideList">
        <img src="../../assets/btn-close-list.png" alt="">
      </div>
    </div> -->
    
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
    /* showList() {
      this.listView = true
    },
    hideList() {
      this.listView = false
    }, */
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
          wx.setStorageSync('userCode',res.data.data)
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
          wx.setStorageSync('spotList',res.data.data)
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
    wx.login({
      success: (res) => {
        console.log(res)
        this.login(res.code);
      }
    }); 
    this.getSpot();
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
