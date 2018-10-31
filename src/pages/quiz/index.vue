<template>
  <div class="container">
    <scroll-view scroll-x class="index-list">
      <div class="index-list-box">
        <div class="index-list-item">
          <div class="index-list-item-img" :class="activeIndex == 1 ? 'index-list-item-img-active':''" @click="startQuiz(1)">
            <div class="stage"> 第<span class="stage-number">1</span>关 </div>
          </div>
          <div class="index-list-item-title">破壳而出</div>
        </div>
        <div class="index-list-item">
          <div class="index-list-item-img" :class="activeIndex == 2 ? 'index-list-item-img-active':''" @click="startQuiz(2)">
            <img src="https://gw.alicdn.com/tfs/TB1x8jwiY2pK1RjSZFsXXaNlXXa-64-79.png" class="unlock" v-if="score<1">
            <div class="stage" v-else> 第<span class="stage-number">2</span>关 </div>
          </div>
          <div class="index-list-item-title">萌力担当</div>
        </div>
        <div class="index-list-item">
          <div class="index-list-item-img" :class="activeIndex == 3 ? 'index-list-item-img-active':''" @click="startQuiz(3)">
            <img src="https://gw.alicdn.com/tfs/TB1x8jwiY2pK1RjSZFsXXaNlXXa-64-79.png" class="unlock" v-if="score<2">
            <div class="stage" v-else> 第<span class="stage-number">3</span>关 </div>
          </div>
          <div class="index-list-item-title">虫虫小将</div>
        </div>
        <div class="index-list-item">
          <div class="index-list-item-img" :class="activeIndex == 4 ? 'index-list-item-img-active':''" @click="startQuiz(4)">
            <img src="https://gw.alicdn.com/tfs/TB1x8jwiY2pK1RjSZFsXXaNlXXa-64-79.png" class="unlock" v-if="score<3">
            <div class="stage" v-else> 第<span class="stage-number">4</span>关 </div>
          </div>
          <div class="index-list-item-title">舞林萌主</div>
        </div>
        <div class="index-list-item">
          <div class="index-list-item-img" :class="activeIndex == 5 ? 'index-list-item-img-active':''" @click="startQuiz(5)">
            <img src="https://gw.alicdn.com/tfs/TB1x8jwiY2pK1RjSZFsXXaNlXXa-64-79.png" class="unlock" v-if="score<4">
            <div class="stage" v-else> 第<span class="stage-number">5</span>关 </div>
          </div>
          <div class="index-list-item-title">一代虫师</div>
        </div>
      </div>
    </scroll-view>
    <div class="index-list-close">
      <div class="index-list-close-body" @click="bindTab">
        <img src="../../assets/btn-close-list.png" alt="">
      </div>
    </div>
    <img src="../../assets/bg-index.jpg" alt="" class="index-bg">
  </div>
</template>

<script>
import { config } from '../../utils/index'
export default {
  data() {
    return {
      userCode:'',
      score:''
    };
  },

  components: {},

  methods: {
    bindTab(e) {
      wx.navigateTo({ url: "../index/main" });
    },
    startQuiz(id) {
      wx.navigateTo({ url: "../quizdetail/main?checkpoint=" + id });
    }
  },

  created() {
    
  },
  mounted() {
    // this.userCode = wx.getStorageSync('userCode');
    // wx.request({
    //   url: config.base + 'quiz/getcheckpoint', 
    //   data: {
    //     LineId: config.lineId,
    //     token: this.userCode
    //   }, 
    //   method: 'GET',
    //   dataType: 'json', 
    //   success: res => {
    //     console.log(res.data)
    //     this.score = res.data.data
    //   },
    //   fail: () => {},
    //   complete: () => {}
    // });
  },
  onShow() {
    this.userCode = wx.getStorageSync('userCode');
    wx.request({
      url: config.base + 'quiz/getcheckpoint', 
      data: {
        LineId: config.lineId,
        token: this.userCode
      }, 
      method: 'GET',
      dataType: 'json', 
      success: res => {
        console.log(res.data)
        this.score = res.data.data
      },
      fail: () => {},
      complete: () => {}
    });
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
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
.index-bg {
  width: 100%;
  height: 100%;
  display: block;
}
.index-list {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
  &-box {
    padding-top: 40rpx;
    padding-left: 14rpx;
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
      width: 138rpx;
      height: 138rpx;
      border-radius: 50%;
      margin: 0 20rpx 4rpx;
      background: url('https://gw.alicdn.com/tfs/TB17GHAi6TpK1RjSZKPXXa3UpXa-135-135.png') no-repeat center/cover;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    &-img-active{
      border:2px solid #00cbff;
    }
    &-title {
      width: 160rpx;
      color: #fff;
      font-size: 24rpx;
      text-align: center;
      overflow: hidden;
    }
  }
  &-close {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    position: fixed;
    bottom: 180rpx;
    right: 74rpx;
    z-index: 999;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    &-body {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      background: rgba(0, 0, 0, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 32rpx;
        height: 32rpx;
        display: block;
      }
    }
  }
  .unlock{
    width: 64rpx;
    height: 78rpx;
  }
  .stage{
    color:#567d17;
    font-size: 24rpx;
    &-number{
      font-size: 80rpx;
    }
  }
}

</style>
