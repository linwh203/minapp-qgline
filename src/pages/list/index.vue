<template>
  <div class="container">
    <div class="nav">
      <div class="top">
        <div class="nav-line"></div>
        <div class="nav-content">
          <div class="nav-item" :class="audioOff?'audio':'pause'" @click="playAudio"></div>
          <!-- <div class="point"></div> -->
          <!-- <div class="nav-item video" @click="goVideo"></div> -->
          <!-- <div class="point"></div> -->
          <div class="nav-item note" v-if="false"></div>
          <!-- <button class="nav-item share" style="margin-left:0;margin-right:0;" open-type="share"></button> -->
          <div class="nav-item share">
            <button style="width:100%;height:100%;opacity:0;padding:0;" open-type="share"></button>
          </div>
        </div>
        <div class="nav-line"></div>
      </div>
      <div class="nav-border left"></div>
      <div class="nav-border right"></div>
    </div>
    <div class="main" v-for="(item,index) in articleData" :key="index">
      <div class="article" v-if="item">
        <div v-if="item.author">
          <div class="article-author">{{item.author}}</div>
          <div class="article-title">{{item.title}}</div>
        </div>
        <div v-else>
          <div class="article-title-full">{{item.title}}</div>
        </div>
        <div class="article-text" :class="{'text-center':activeIndex>=89}" v-html="item.content"></div>
      </div>

      <img class="article-img" :src="prefix + item.url" v-if="item.url" mode="widthFix">
      <!-- <div class="writer" v-if="articleData[1]">
        <div class="writer-title">{{articleData[1].title}}</div>
        <div class="writer-text" v-html="articleData[1].content"></div>
      </div>-->
    </div>
    <div class="share-box" v-if="sharebox">
      <div class="share-box-body">
        <div class="share-box-body-item">
          <button open-type="share" class="btn-share-origin"></button>
          <img src="../../assets/icon-share-weixin.png" alt>
        </div>
      </div>
      <div class="share-box-close" @click="hideShareBox">取消</div>
    </div>
  </div>
</template>

<script>
import { config } from "../../utils/index";
export default {
  data() {
    return {
      prefix: config.prefix,
      fromMap: false,
      showSub: false,
      innerAudioContext: null,
      videoUrl: "",
      audioOff: true,
      audioUrl: "",
      mainPic: "",
      scrollTop: 0,
      init: false,
      sharebox: false,
      spotList: [],
      articleData: [],
      spotLine: "",
      currentIndex: 1,
      url: "/File/Download?fileName=DetailPhoto/01.jpg&fileType=QGLineFile",
      activeIndex: 0
    };
  },
  computed: {},
  components: {},

  methods: {
    setStorage(key, val) {
      try {
        wx.setStorageSync(key, val);
      } catch (e) {
        wx.setStorage(key, val);
      }
    },
    getStorage(key) {
      try {
        wx.getStorageSync(key);
      } catch (e) {
        wx.getStorage(key);
      }
    },
    bindTab() {
      this.fromMap
        ? wx.navigateTo({ url: "../map/main" })
        : wx.navigateTo({ url: "../index/main" });
      // wx.navigateBack();
    },
    displaySub() {
      this.showSub = !this.showSub;
    },
    playAudio() {
      if (this.audioOff) {
        this.audioOff = false;
        this.innerAudioContext.play();
      } else {
        this.audioOff = true;
        this.innerAudioContext.stop();
      }
    },
    goVideo() {
      if (!this.videoUrl) {
        wx.showToast({
          title: "暂无视频", //提示的内容,
          icon: "none",
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        return;
      }
      wx.navigateTo({ url: "../video/main?video_url=" + this.videoUrl });
    },
    showShareBox() {
      this.sharebox = true;
    },
    hideShareBox() {
      this.sharebox = false;
    },
    formatDetail(items) {
      let diver = "《";
      return items.map((n, i) => {
        if (i === 0 && n.title.indexOf(diver) >= 0) {
          let arr = n.title.split(diver);
          return Object.assign(n, { author: arr[0], title: diver + arr[1] });
        }
        return n;
      });
    },
    loadDetail() {
      this.audioOff = true;
      if (this.innerAudioContext) {
        this.innerAudioContext.stop();
      }
      let spot_id = this.spotList[this.currentIndex].spot_id;
      wx.request({
        url: config.base + "attraction/listdetail", //开发者服务器接口地址",
        data: {
          spot_id: spot_id
        }, //请求的参数",
        method: "GET",
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res.data.data);
          // this.articleData = res.data.data.items
          this.articleData = this.formatDetail(res.data.data.items);
          this.innerAudioContext = wx.createInnerAudioContext();
          this.audioUrl = res.data.data.audio_url;
          this.videoUrl =
            res.data.data.video_url == null
              ? ""
              : config.prefix + res.data.data.video_url;
          if (this.audioUrl) {
            this.innerAudioContext.src = this.audioUrl;
          }
        },
        fail: () => {},
        complete: () => {}
      });
    },
    getSpot(line) {
      let storageData, requestUrl;
      if (line == "shige") {
        storageData = wx.getStorageSync("PoetryList");
        requestUrl = "attraction/PoetryList";
      } else {
        storageData = wx.getStorageSync("NatureList");
        requestUrl = "attraction/NaturalList";
      }

      return new Promise(resolve => {
        if (storageData) {
          resolve(storageData);
          return;
        }
        wx.request({
          url: config.base + requestUrl, //开发者服务器接口地址",
          data: {
            lineId: config.lineId
          }, //请求的参数",
          method: "GET",
          dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
          success: res => {
            // console.log(res)
            const data = res.data.data;
            if (line == "shige") {
              this.setStorage("PoetryList", data);
            } else {
              this.setStorage("NatureList", data);
            }
            resolve(data);
          }
        });
      });
    }
  },
  onLoad(option) {
    this.activeIndex = option.spot_index;
    const index = option.spot_index - 1;
    console.log(index);
    if (index >= 89) {
      this.spotLine = "shige";
      this.currentIndex = index - 89;
    } else {
      this.spotLine = "ziran";
      this.currentIndex = index;
    }
    this.getSpot(this.spotLine).then(data => {
      console.log("after getSpot");
      this.spotList = data;
      this.loadDetail();
    });
    this.innerAudioContext = wx.createInnerAudioContext();
  },
  onHide() {
    this.audioOff = true;
    this.showSub = false;
    this.innerAudioContext.stop();
    this.init = true;
    // this.innerAudioContext = null
  },
  onUnload() {
    this.audioOff = true;
    this.showSub = false;
    this.innerAudioContext.stop();
    // this.innerAudioContext = null
  },
  onShow() {
    if (this.init) {
      // this.loadDetail();
    }
    // this.innerAudioContext = wx.createInnerAudioContext();
  },
  onReady() {
    console.log("onReady");
    // this.loadDetail();
  },
  onShareAppMessage(result) {
    console.log("share");
    let title = "青谷研习径";
    let spot_index =
      this.spotLine === "shige"
        ? this.currentIndex + 1 + 89
        : this.currentIndex + 1;
    let path = "/pages/index/main?share_from=list&spot_index=" + spot_index;
    let imageUrl = "../../assets/list-pic-1.png";
    // let desc = '这里是描述哦'
    // if (result.from === "button") {
    //   this.billId = "billId-" + new Date().getTime();
    //   title = "我发起了一个转发";
    //   path = `pages/index/main?billId=${this.billId}`;
    // }
    return {
      title,
      path,
      imageUrl,
      // desc,
      success: res => {
        console.log("success", res);
      },
      fail(e) {
        console.log(e);
      }
    };
  }
};
</script>

<style scoped lang="less">
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.container {
  position: relative;
  // background: url("https://gw.alicdn.com/tfs/TB1vzW6nxjaK1RjSZKzXXXVwXXa-640-1142.png")
  //   repeat-y top/cover;
  color: #fff;
  padding: 20rpx;
}
.sub-nav {
  position: absolute;
  top: 0;
  right: 25rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 66;
  &-line {
    width: 2px;
    height: 38rpx;
    background: #9e7044;
  }
  &-btn {
    width: 66rpx;
    height: 66rpx;
    border-radius: 50%;
    border: 2rpx solid #9e7044;
    background: #f6ca47;
    .center();
    &-in {
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
      border: 2rpx solid #9e7044;
      background: #f7eec5;
      position: relative;
      .center();
    }
  }

  .btn-show {
    width: 30rpx;
    height: 16rpx;
  }
  .reverse {
    transform: rotateX(180deg);
  }
  .btn-audio {
    width: 30rpx;
    height: 26rpx;
  }
  .btn-video {
    width: 28rpx;
    height: 26rpx;
  }
  .btn-share {
    width: 24rpx;
    height: 28rpx;
  }
}
.main {
  margin-top: -18rpx;
}
.article {
  border: 8rpx solid #fff;
  padding: 20rpx;
  font-size: 36rpx;
  background-color: rgba(23, 25, 74, 0.7);
  &-author {
    text-align: center;
    margin: 40rpx 0 10rpx;
  }
  &-title {
    text-align: center;
    margin-bottom: 40rpx;
  }
  &-title-full {
    text-align: center;
    margin: 40rpx 0;
  }
  &-text {
    font-size: 28rpx;
    line-height: 50rpx;
    letter-spacing: 2rpx;
    &.text-center {
      text-align: center;
    }
  }
  &-img {
    border-left: 8rpx solid #fff;
    border-right: 8rpx solid #fff;
    border-bottom: 8rpx solid #fff;
    height: 400rpx;
    width: 100%;
    box-sizing: border-box;
  }
}
.writer {
  border: 8rpx solid #fff;
  padding: 20rpx;
  margin-top: -12rpx;
  &-title {
    text-align: left;
    font-size: 32rpx;
    margin: 40rpx 0;
  }
  &-text {
    font-size: 24rpx;
    line-height: 40rpx;
  }
}

.nav {
  @h: 140rpx;
  height: @h;
  position: relative;
  .top {
    display: flex;
    align-items: center;
  }
  &-content {
    width: 70%;
    // margin-left: 1.5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &-item {
    width: 213rpx;
    height: 86rpx;
    margin-bottom: 15rpx;
    position: relative;
  }
  &-line {
    height: 8rpx;
    width: 15%;
    background: #fff;
  }
  .audio {
    background: url("../../assets/list-audio-play.png") no-repeat center/cover;
    transform: translateX(-2rpx);
  }
  .pause {
    background: url("../../assets/list-audio-pause.png") no-repeat center/cover;
  }
  // .audio:after,.video:after,.note:after,.pause:after{
  //   content:'';
  //   position: absolute;
  //   width: 12rpx;
  //   height: 12rpx;
  //   border-radius: 50%;
  //   background: #fff;
  //   right: -26rpx;top: 44rpx;
  // }
  .point {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background: #fff;
    right: -26rpx;
    top: 44rpx;
  }
  .video {
    // margin-left: 6%;
    background: url("https://gw.alicdn.com/tfs/TB1h8sSnwHqK1RjSZJnXXbNLpXa-92-83.png")
      no-repeat center/cover;
  }
  .note {
    // margin-left: 6%;
    background: url("https://gw.alicdn.com/tfs/TB1B3U6nxjaK1RjSZFAXXbdLFXa-91-83.png")
      no-repeat center/cover;
  }
  .share {
    // margin-left: 6%;
    background: url("../../assets/list-knowledge-share.png") no-repeat
      center/cover;
    transform: translateX(12rpx);
  }
  &-border {
    position: absolute;
    top: 38%;
    // left: 0;
    // width: 100%;
    width: 8rpx;
    box-sizing: border-box;
    height: @h / 2;
    background-color: #fff;
    // border-left: 8rpx solid #fff;
    // border-right: 8rpx solid #fff;
    &.left {
      left: 0;
    }
    &.right {
      right: 0;
    }
  }
}
.share-box {
  width: 100%;
  height: 320rpx;
  background: #fff;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &-body {
    height: 220rpx;
    .center();
    &-item {
      position: relative;
      img {
        width: 144rpx;
        height: 168rpx;
        display: block;
      }
    }
  }
  &-close {
    width: 100%;
    height: 100rpx;
    background: #efefef;
    color: #000;
    font-size: 34rpx;
    text-align: center;
    line-height: 98rpx;
  }
}
.btn-share-origin {
  position: absolute;
  top: 0;
  left: 0;
  width: 144rpx;
  height: 168rpx;
  background: transparent;
  border: none;
}
.btn-share-origin::after {
  border: 0;
}
</style>
