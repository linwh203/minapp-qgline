<template>
  <div class="container">
    <div class="note-area">
      <div class="textarea" @click="touchTextarea">
        <textarea placeholder="__ 留下笔记" :placeholder-style="style" auto-height v-model="text"/>
      </div>
      <div class="submit" @click="submit">发布</div>
      <cover-view class="note-area-icon" v-if="!text">
        <cover-image src="https://gw.alicdn.com/tfs/TB1GU03xlLoK1RjSZFuXXXn0XXa-30-32.png"></cover-image>
      </cover-view>
    </div>
    <div class="main">
      <div class="main-item" v-for="(item,index) in noteList" :key=item.id>
        <div class="main-item-left">
          <img class="main-item-left-icon" src="https://gw.alicdn.com/tfs/TB13VGlxkPoK1RjSZKbXXX1IXXa-35-18.png">
          <div class="main-item-left-number">{{item.id}}</div>
          <div class="main-item-left-line" v-if="index!=noteList.length-1"></div>
        </div>
        <div class="main-item-right">
          <div class="main-item-right-container">
            <div class="main-item-right-up">
              {{item.content}}
            </div>
            <div class="main-item-right-down">
              <div class="main-item-right-down-time">"2018-12-18 12:00"</div>
              <div class="main-item-right-down-del">删除</div>
            </div>
          </div>
          <div class="main-item-right-margin"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { config, formatTime } from "../../utils/index";
export default {
  data() {
    return {
      text: "",
      contact: "",
      noteList: [{id:1,content:"ajhsdkahsdkhaskdjh"},{id:2,content:"暗红色的卡是的接口哈数据库等哈可接受的黄金卡山东矿机啊还是打开就哈斯卡级等哈就开始单解卡山艾克就圣诞款"}],
      userCode: "",
      isFoucs: false
    };
  },

  components: {},

  methods: {
    touchTextarea() {
      console.log("touch textarea");
      this.isFoucs = true;
    },
    submit() {
      if (!this.text) {
        wx.showToast({
          title: "请输入内容", //提示的内容,
          icon: "none", //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        return;
      }
      const token = wx.getStorageSync("userCode");
      wx.request({
        url: config.base + "my/suggest", //开发者服务器接口地址",
        data: {
          lineId: config.lineId,
          suggest: this.text,
          phone: this.contact,
          image_url_list: this.tempFile
        }, //请求的参数",
        method: "post",
        header: {
          token: token
        },
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res.data);
          if (res.data.res_code == 0) {
            wx.showToast({
              title: "反馈成功", //提示的内容,
              icon: "success", //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
            this.text = "";
            this.contact = "";
            this.imgList = [];
            this.tempFile = [];
          } else {
            wx.showToast({
              title: "反馈失败，请稍后再试", //提示的内容,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
          }
        },
        fail: () => {},
        complete: () => {}
      });
    }
  },

  created() {
    this.userCode = wx.getStorageSync("userCode");
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.container {
  background: #f3f3f3;
  padding:0 20rpx;
}
.main{
  padding: 48rpx 0;
  &-item{
    display: flex;
    &-left{
      margin-right: 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      &-number{
        width: 66rpx;
        line-height: 66rpx;
        text-align: center;
        background: #292770;
        color:#fff;
        border-radius: 50%;
      }
      &-line{
        height: 100%;
        width: 2px;
        background: #292770;
      }
      &-icon{
        width: 36rpx;
        height: 18rpx;
        position: absolute;
        top: -14rpx;
        left: 0;
        right: 0;
        margin:auto;
      }
    }
    &-right{
      width: 100%;
      font-size: 28rpx;
      &-up{
        padding:20rpx;
      }
      &-container{
        background: #fff;
        border:1px solid #eaebea;
        min-height:240rpx;
        border-radius: 8rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      &-margin{
        height: 48rpx;
      }
    }
  }
}
.note-area{
  display: flex;
  align-items: center;
  position:fixed;
  bottom: 0rpx;
  left: 0rpx;right: 0rpx;
  padding:20rpx;
  border-top:1px solid #dcdcdc;
  &-icon{
    position: absolute;
    left: 38rpx;
    top: 38rpx;
    width: 40rpx;
    height: 40rpx;
  }
}
.textarea {
  min-height:36rpx;
  font-size: 30rpx;
  border-radius: 12rpx;
  border:1px solid #dcdcdc;
  width: 78%;
  background: #fff;
  padding: 24rpx;
  textarea{
    width: 100%;
  }
}

.submit {
  width: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: #292770;
  border-radius: 12rpx;
  color: #fff;
  font-size: 30rpx;
  margin-left: 16rpx;
}
.flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}
</style>
