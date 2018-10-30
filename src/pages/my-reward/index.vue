<template>
  <div class="container">
    <open-data type="userNickName" class="userName"></open-data>
    <div class="my-tab">
      <div class="my-tab-top">
        <div class="my-tab-top-left">
          <img src="https://gw.alicdn.com/tfs/TB1Krl6k3HqK1RjSZFgXXa7JXXa-111-76.png" class="icon-stage">
          <div class="icon-stage-text">第 <span>{{score}}</span> 关</div>
        </div>
        <div class="my-tab-top-right">
          <img src="https://gw.alicdn.com/tfs/TB1Ww4Yk9rqK1RjSZK9XXXyypXa-110-72.png" class="icon-reward">
          <div class="icon-reward-text">勋章 <span>{{score}}</span> 枚</div>
        </div>
      </div>
      <div class="my-tab-btm">
        <div class="my-tab-btm-head">闯关记录</div>
        <div class="my-tab-btm-main">
          <div class="my-tab-btm-item relative mrgin70">
            <img src="https://gw.alicdn.com/tfs/TB1wtV2kY2pK1RjSZFsXXaNlXXa-110-80.png" class="icon-noclear" v-if="score<1" >
            <img src="https://gw.alicdn.com/tfs/TB1ir86k3HqK1RjSZFgXXa7JXXa-110-80.png" class="icon-clear" v-else>
            <div class="my-tab-btm-item-name">第一关</div>
            <!-- <div class="my-tab-btm-item-time">(******)</div> -->
            <div class="my-tab-btm-item-line"></div>
          </div>
          <div class="my-tab-btm-item relative mrgin70">
            <img src="https://gw.alicdn.com/tfs/TB1wtV2kY2pK1RjSZFsXXaNlXXa-110-80.png" class="icon-noclear" v-if="score<2" >
            <img src="https://gw.alicdn.com/tfs/TB1ir86k3HqK1RjSZFgXXa7JXXa-110-80.png" class="icon-clear" v-else>
            <div class="my-tab-btm-item-name">第二关</div>
            <!-- <div class="my-tab-btm-item-time">(******)</div> -->
            <div class="my-tab-btm-item-line"></div>
          </div>
          <div class="my-tab-btm-item relative">
            <img src="https://gw.alicdn.com/tfs/TB1wtV2kY2pK1RjSZFsXXaNlXXa-110-80.png" class="icon-noclear" v-if="score<3" >
            <img src="https://gw.alicdn.com/tfs/TB1ir86k3HqK1RjSZFgXXa7JXXa-110-80.png" class="icon-clear" v-else>
            <div class="my-tab-btm-item-name">第三关</div>
            <!-- <div class="my-tab-btm-item-time">(******)</div> -->
          </div>
          <div class="my-tab-btm-item relative mrgin70">
            <img src="https://gw.alicdn.com/tfs/TB1wtV2kY2pK1RjSZFsXXaNlXXa-110-80.png" class="icon-noclear" v-if="score<4" >
            <img src="https://gw.alicdn.com/tfs/TB1ir86k3HqK1RjSZFgXXa7JXXa-110-80.png" class="icon-clear" v-else>
            <div class="my-tab-btm-item-name">第四关</div>
            <!-- <div class="my-tab-btm-item-time">(******)</div> -->
            <div class="my-tab-btm-item-line"></div>
          </div>
          <div class="my-tab-btm-item relative">
            <img src="https://gw.alicdn.com/tfs/TB1wtV2kY2pK1RjSZFsXXaNlXXa-110-80.png" class="icon-noclear" v-if="score<5" >
            <img src="https://gw.alicdn.com/tfs/TB1ir86k3HqK1RjSZFgXXa7JXXa-110-80.png" class="icon-clear" v-else>
            <div class="my-tab-btm-item-name">第五关</div>
            <!-- <div class="my-tab-btm-item-time">(******)</div> -->
          </div>
        </div>
        <img src="../../assets/bg-my-reward.png" class="my-tab-btm-bg">
      </div>
    </div>
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
    bindTab(url) {
      wx.navigateTo({ url: url });
    }
  },

  created() {
    this.userCode = wx.getStorageSync('userCode');
  },
  mounted() {
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
.center{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.relative{
  position: relative;
  z-index: 2;
}
.mrgin70{
  margin-right:70rpx;
}
.container {
  width: 100%;
  height: 100%;
  position: relative;
  background: url('https://gw.alicdn.com/tfs/TB1_p0GkZfpK1RjSZFOXXa6nFXa-640-1008.png') no-repeat top/cover;
  .center();
}
.userName{
  padding:0 60rpx;
  line-height: 70rpx;
  background: #ff9899;
  color:#fff;
  border-radius: 38rpx;
  position: absolute;
  top: 24%;
}
.my-tab{
  position: absolute;
  top: 40%;
  width: 100%;
  &-top{
    display: flex;
    justify-content: space-around;
    align-items: center;
    &-left,&-right{
      display: flex;
      align-items: center;
    }
  }
  &-btm{
    margin:34rpx 24rpx;
    position: relative;
    &-head{
      position: absolute;
      z-index: 2;
      top: 12rpx;
      font-size: 34rpx;
      text-align: center;
      left: 0;right: 0;margin: auto;
      color:#fff;
      background: #4d2e0f;
      width: 166rpx;
      line-height: 60rpx;
      border-bottom-left-radius: 12rpx;
      border-bottom-right-radius: 12rpx;
    }
    &-main{
      padding:96rpx 84rpx 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
    }
    &-item{
      .center();
      font-size: 20rpx;
      margin-bottom: 64rpx;
      &-name{
        margin-top: 6rpx;
      }
      &-line{
        position: absolute;
        z-index: 2;
        right: -94rpx; top: 44rpx;
        width: 100rpx;
        height: 0;
        border-top:3px dotted #d5aa80;
      }
    }
    &-bg{
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      height: 560rpx;
    }
  }
}
.icon-stage{
  width: 130rpx;
  height: 88rpx;
  position: relative;
  z-index: 2;
}
.icon-reward{
  width: 128rpx;
  height: 84rpx;
  position: relative;
  z-index: 2;
}
.icon-clear{
  width: 128rpx;
  height: 94rpx;
}
.icon-noclear{
  width: 128rpx;
  height: 94rpx;
}
.icon-stage-text,.icon-reward-text{
  width: 160rpx;
  line-height: 70rpx;
  padding-left:60rpx;
  background: #fff;
  position: relative;
  left: -50rpx;
  z-index:1;
  font-size: 28rpx;
  border-top-right-radius: 40rpx;
  border-bottom-right-radius: 40rpx;
  span{
    font-size:34rpx;
  }
}
</style>
