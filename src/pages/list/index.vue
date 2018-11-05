<template>
  <div class="container">
    <div class="sub-nav">
      <div class="sub-nav-line"></div>
      <div class="sub-nav-btn">
        <div class="sub-nav-btn-in" @click="displaySub">
          <img src="../../assets/icon-list-show.png" alt="" class="btn-show" :class="showSub?'':'reverse'">
        </div>
      </div>
      <div class="sub-nav-line" v-if="showSub && audioUrl != ''"></div>
      <div class="sub-nav-btn" v-if="showSub && audioUrl != ''">
        <div class="sub-nav-btn-in " @click="playAudio">
          <img src="../../assets/icon-list-audio.png" alt="" class="btn-audio" v-if="audioOff">
          <img src="../../assets/icon-list-audio-play.png" alt="" class="btn-audio" v-else>
        </div>
      </div>
      <div class="sub-nav-line" v-if="showSub && videoUrl != ''"></div>
      <div class="sub-nav-btn" v-if="showSub && videoUrl != ''">
        <div class="sub-nav-btn-in " @click="goVideo">
          <img src="../../assets/icon-list-video.png" alt="" class="btn-video">
        </div>
      </div>
      <div class="sub-nav-line" v-if="showSub"></div>
      <div class="sub-nav-btn" v-if="showSub">
        <div class="sub-nav-btn-in ">
          <img src="../../assets/icon-list-share.png" alt="" class="btn-share" @click="showShareBox">
        </div>
      </div>
    </div>
    <div class="nav">
      
    </div>
    <div class="article" v-if="articleData[0]">
      <div class="article-title">{{articleData[0].title}}</div>
      <div class="article-text" v-html="articleData[0].content"></div>
    </div>
    <img class="article-img" :src="prefix + articleData[0].url" v-if="articleData[0]" mode="widthFix">
    <div class="writer" v-if="articleData[1]">
      <div class="writer-title">{{articleData[1].title}}</div>
      <div class="writer-text">{{articleData[1].content}}</div>
    </div>
    <div class="share-box" v-if="sharebox">
      <div class="share-box-body">
        <div class="share-box-body-item">
          <button open-type="share" class="btn-share-origin"></button>
          <img src="../../assets/icon-share-weixin.png" alt="">
        </div>
      </div>
      <div class="share-box-close" @click="hideShareBox">取消</div>
    </div>
  </div>
</template>

<script>
import {config} from '../../utils/index'
export default {
  data() {
    return {
      prefix:config.prefix,
      fromMap: false,
      showSub: false,
      innerAudioContext: null,
      videoUrl:'',
      audioOff: true,
      audioUrl: '',
      mainPic: "",
      scrollTop: 0,
      activeIndex: 1,
      sharebox: false,
      spotList:[],
      articleData:[],
      spotLine:'',
      currentIndex:0,
      url: "/File/Download?fileName=DetailPhoto/01.jpg&fileType=QGLineFile"
    };
  },
  computed: {

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
      wx.navigateTo({ url: "../video/main?video_url=" + this.videoUrl });
    },
    showShareBox() {
      this.sharebox = true
    },
    hideShareBox() {
      this.sharebox = false
    },
    loadDetail() {
      this.audioOff = true;
      if (this.innerAudioContext) { this.innerAudioContext.stop() }
      let spot_id = this.spotList[this.currentIndex-1].spot_id
      wx.request({
        url: config.base + 'attraction/listdetail', //开发者服务器接口地址",
        data: {
          spot_id: spot_id
        }, //请求的参数",
        method: 'GET',
        dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res.data.data)
          this.articleData = res.data.data.items
          this.innerAudioContext = wx.createInnerAudioContext();
          this.audioUrl = res.data.data.audio_url == null ? '' :  config.prefix + res.data.data.audio_url
          this.videoUrl = res.data.data.video_url == null ? '' :  config.prefix + res.data.data.video_url
          if (this.audioUrl) {
            this.innerAudioContext.src = this.audioUrl
          }
        },
        fail: () => {},
        complete: () => {}
      });
    },
    getSpot(line) {

      let storageData , requestUrl
      if(line == 'shige') {
        storageData = wx.getStorageSync('PoetryList')
        requestUrl = 'attraction/PoetryList'
      } else {
        storageData = wx.getStorageSync('NatureList');
        requestUrl = 'attraction/NaturalList'
      }
      if(storageData){
        this.spotList = storageData
        return
      }
      wx.request({
        url: config.base + requestUrl, //开发者服务器接口地址",
        data: {
          lineId:config.lineId
        }, //请求的参数",
        method: 'GET',
        dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          // console.log(res)
          const data = res.data.data
          if(line == 'shige') {
            this.setStorage('PoetryList',data)
          } else {
            this.setStorage('NatureList',data)
          }
          this.spotList = data
        },
        fail: () => {},
        complete: () => {}
      });
    }
  },
  onLoad(option) {
    const index = option.spot_index
    if(index>89) {
      this.spotLine = 'shige'
      this.currentIndex = index - 89
    } else {
      this.spotLine = 'ziran'
      this.currentIndex = index
    }
    this.getSpot(this.spotLine)
    this.innerAudioContext = wx.createInnerAudioContext()
  },
  onHide() {
    this.audioOff = true;
    this.showSub = false;
    this.innerAudioContext.stop();
    // this.innerAudioContext = null
  },
  onUnload() {
    this.audioOff = true;
    this.showSub = false;
    this.innerAudioContext.stop();
    // this.innerAudioContext = null
  },
  onShow() {
    this.loadDetail()
    // this.changeArticle(1,this.listItem[0].spot_id)
    // this.innerAudioContext = wx.createInnerAudioContext();
  },
  onShareAppMessage(result) {
    let title = "儿童研习径";
    let path = "/pages/list/main?spot_index=" + this.activeIndex;
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
  background: url('https://gw.alicdn.com/tfs/TB1vzW6nxjaK1RjSZKzXXXVwXXa-640-1142.png') repeat-y top/cover;
  color:#fff;
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
.article {
  border:8rpx solid #fff;
  padding:20rpx;
  &-title{
    text-align: center;
    font-size: 32rpx;
    margin: 40rpx 0;
  }
  &-text{
    font-size: 24rpx;
    line-height: 40rpx;
  }
  &-img{
    border-left:8rpx solid #fff;
    border-right:8rpx solid #fff;
    height: 400rpx;
    width: 97.7%;
  }
}
.writer{
  border:8rpx solid #fff;
  padding:20rpx;
  margin-top: -12rpx;
  &-title{
    text-align: left;
    font-size: 32rpx;
    margin: 40rpx 0;
  }
  &-text{
    font-size: 24rpx;
    line-height: 40rpx;
  }
}
.nav{
  height: 120rpx;
  background: url('https://gw.alicdn.com/tfs/TB1Mt5GnwHqK1RjSZFPXXcwapXa-601-129.png') repeat-y top/cover;

}
.share-box{
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
  &-body{
    height: 220rpx;
    .center();
    &-item{
      position: relative;
      img{
        width: 144rpx;
        height: 168rpx;
        display: block;
      }
    }
  }
  &-close{
    width: 100%;
    height: 100rpx;
    background: #efefef;
    color:#000;
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
  border:none;
}
.btn-share-origin::after {
  border: 0;
} 
</style>
