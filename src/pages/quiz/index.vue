<template>
  <div class="container">
    <div class="top">
      <open-data type="userAvatarUrl" class="userPic"></open-data>
      <open-data type="userNickName" class="userName"></open-data>
      <div class="top-btn">
        <div class="top-btn-item">
          <span>5</span>挑战次数
        </div>
        <div class="top-btn-item">
          <span>?</span>挑战规则
        </div>
      </div>
    </div>
    <div class="share"></div>
    <scroll-view scroll-y class="index-list">
      <div class="index-list-item">
        <div class="index-list-item-img" @click="startQuiz(1)">
          <img src="https://gw.alicdn.com/tfs/TB1.Wl8nFzqK1RjSZSgXXcpAVXa-608-208.png">
        </div>
      </div>
      <div class="index-list-item">
        <div class="index-list-item-img" @click="startQuiz(2)">
          <img src="https://gw.alicdn.com/tfs/TB1Wx5XnNTpK1RjSZFMXXbG_VXa-608-208.png">
          <div class="index-list-item-lock" v-if="score<1">
            <img src="https://gw.alicdn.com/tfs/TB19UOdnRLoK1RjSZFuXXXn0XXa-23-29.png">
          </div>
        </div>
      </div>
      <div class="index-list-item">
        <div class="index-list-item-img" @click="startQuiz(3)">
          <img src="https://gw.alicdn.com/tfs/TB1bOh6nIbpK1RjSZFyXXX_qFXa-608-208.png">
          <div class="index-list-item-lock" v-if="score<2">
            <img src="https://gw.alicdn.com/tfs/TB19UOdnRLoK1RjSZFuXXXn0XXa-23-29.png">
          </div>
        </div>
      </div>
      <div class="index-list-item">
        <div class="index-list-item-img" @click="startQuiz(4)">
          <img src="https://gw.alicdn.com/tfs/TB1kNN.nQvoK1RjSZFDXXXY3pXa-608-208.png">
          <div class="index-list-item-lock" v-if="score<3">
            <img src="https://gw.alicdn.com/tfs/TB19UOdnRLoK1RjSZFuXXXn0XXa-23-29.png">
          </div>
        </div>
      </div>
      <div class="index-list-item">
        <div class="index-list-item-img" @click="startQuiz(5)">
          <img src="https://gw.alicdn.com/tfs/TB1An43nNTpK1RjSZR0XXbEwXXa-608-208.png">
          <div class="index-list-item-lock" v-if="score<4">
            <img src="https://gw.alicdn.com/tfs/TB19UOdnRLoK1RjSZFuXXXn0XXa-23-29.png">
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import { config } from '../../utils/index'
export default {
  data() {
    return {
      cross:'https://gw.alicdn.com/tfs/TB14yqPnNTpK1RjSZFKXXa2wXXa-60-132.png',
      notice:'https://gw.alicdn.com/tfs/TB1.U9SnMHqK1RjSZJnXXbNLpXa-460-700.png',
      shareBg:'https://gw.alicdn.com/tfs/TB1IrOQnFYqK1RjSZLeXXbXppXa-460-832.png',
      shareBtn:'https://gw.alicdn.com/tfs/TB1qxG6nNYaK1RjSZFnXXa80pXa-340-80.png',
      chiLun:'https://gw.alicdn.com/tfs/TB1L2OWnQvoK1RjSZPfXXXPKFXa-292-292.png',
      biaoQian:'https://gw.alicdn.com/tfs/TB1VLiZnNTpK1RjSZFMXXbG_VXa-96-21.png',
      daTiBg:'https://gw.alicdn.com/tfs/TB1ASuUnMHqK1RjSZJnXXbNLpXa-640-1084.png',
      gou:'https://gw.alicdn.com/tfs/TB1_2ORnRLoK1RjSZFuXXXn0XXa-36-25.png',
      dacha:'https://gw.alicdn.com/tfs/TB1c4eWnHrpK1RjSZTEXXcWAVXa-30-29.png',
      failMsg:'https://gw.alicdn.com/tfs/TB1RLqUnFzqK1RjSZFvXXcB7VXa-460-700.png',
      failMsgNoChance:'https://gw.alicdn.com/tfs/TB1tIq0nQvoK1RjSZFDXXXY3pXa-460-700.png',
      failMsgBtn:'https://gw.alicdn.com/tfs/TB1Rn9UnHvpK1RjSZPiXXbmwXXa-340-80.png',
      failIcon:'https://gw.alicdn.com/tfs/TB1Lg9UnHPpK1RjSZFFXXa5PpXa-328-251.png',
      successIcon:'https://gw.alicdn.com/tfs/TB1iq1VnMTqK1RjSZPhXXXfOFXa-328-251.png',
      coin:'https://gw.alicdn.com/tfs/TB1fLeZnQvoK1RjSZFwXXciCFXa-43-44.png',
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
.top{
  height: 270rpx;
  background: #6998cc;
  border-radius: 10rpx;
  margin:0 6rpx 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.userPic{
  width: 110rpx;
  height: 110rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 4rpx solid #fff;
  margin-bottom: 10rpx;
}
.userName{
  color:#fff;
  font-size: 30rpx;
}
.share{
  width: 126rpx;
  height: 66rpx;
  position: absolute;
  right: 0;
  top: 80rpx;
  background: url('https://gw.alicdn.com/tfs/TB1m0X7nHPpK1RjSZFFXXa5PpXa-113-60.png') no-repeat top/cover;
}
.container {
  position: relative;
  padding:20rpx;
  background: url('https://gw.alicdn.com/tfs/TB1o6t.nMHqK1RjSZFPXXcwapXa-640-1033.png') no-repeat top/cover;
}
.index-list {
  width: 100%;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
  &-item {
    position: relative;
    &-img {
      width: 100%;
      height: 234rpx;
      margin: 0 0 20rpx;
    }
    &-lock{
      img{
        width: 26rpx;
        height: 32rpx;
      }
      width: 76rpx;
      height: 70rpx;
      position: absolute;
      top: 0;right: 0;
      background: rgba(0, 0, 0, .5);
      border-bottom-left-radius: 40rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

</style>
