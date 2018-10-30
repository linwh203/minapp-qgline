<template>
  <div class="container">
    <open-data type="userNickName" class="userName"></open-data>
    <div class="my-tab">
      <div class="my-tab-body">
        <div class="my-tab-body-item" @click="bindTab('../my-rule/main')">
          <img src="https://gw.alicdn.com/tfs/TB1hhdWk7voK1RjSZPfXXXPKFXa-179-133.png" class="my-tab-body-item-icon"/>
          <div class="my-tab-body-item-name">行山礼仪</div>
        </div>
        <div class="my-tab-body-item" @click="bindTab('../my-statement/main')">
          <img src="https://gw.alicdn.com/tfs/TB1AjlUkZbpK1RjSZFyXXX_qFXa-179-133.png" class="my-tab-body-item-icon"/>
          <div class="my-tab-body-item-name">法律声明</div>
        </div>
      </div>
      <div class="my-tab-body">
        <div class="my-tab-body-item" @click="bindTab('../my-reward/main')">
          <img src="https://gw.alicdn.com/tfs/TB1VPxWk9zqK1RjSZFjXXblCFXa-179-132.png" class="my-tab-body-item-icon"/>
          <div class="my-tab-body-item-name">个人成就</div>
        </div>
        <div class="my-tab-body-item" @click="bindTab('../my-msg/main')">
          <img src="https://gw.alicdn.com/tfs/TB1PVF0k7zoK1RjSZFlXXai4VXa-178-132.png" class="my-tab-body-item-icon"/>
          <div class="my-tab-body-item-name">消息中心</div>
        </div>
      </div>
      <div class="my-tab-body">
        <div class="my-tab-body-item" @click="bindTab('../my-suggest/main')">
          <img src="https://gw.alicdn.com/tfs/TB145NVk3TqK1RjSZPhXXXfOFXa-179-132.png" class="my-tab-body-item-icon"/>
          <div class="my-tab-body-item-name">意见反馈</div>
        </div>
        <div class="my-tab-body-item" @click="bindTab('../my-about/main')">
          <img src="https://gw.alicdn.com/tfs/TB17p40k7zoK1RjSZFlXXai4VXa-179-132.png" class="my-tab-body-item-icon"/>
          <div class="my-tab-body-item-name">关于我们</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    };
  },

  components: {},

  methods: {
    bindTab(url) {
      wx.navigateTo({ url: url });
    }
  },

  created() {
    
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
  &-body{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 105rpx;
    &-item{
      .center();
      width: 210rpx;
      margin-bottom: 36rpx;
      &-icon{
        width: 210rpx;
        height: 156rpx;
        display: block;
      }
      &-name{
        font-size:26rpx;
        color:#3f2306;
      }
    }
  }
}
</style>
