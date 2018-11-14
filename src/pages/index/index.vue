<template>
  <div class="container" :style="{height:bodyHeight}">
    <div class="index-tab">
      <div class="index-tab-item icon-map" @click="bindTab('../map/main')">
        <img src="https://gw.alicdn.com/tfs/TB1hOhEmMDqK1RjSZSyXXaxEVXa-90-101.png" alt="">
      </div>
      <div class="index-tab-item icon-list" @click="showRoadName">
        <img src="https://gw.alicdn.com/tfs/TB1dgd8nzTpK1RjSZKPXXa3UpXa-91-101.png" v-if="showRoadSelect">
        <img src="https://gw.alicdn.com/tfs/TB1gqFKmHvpK1RjSZFqXXcXUVXa-91-101.png" v-else>
      </div>
      <div class="index-tab-item icon-scan" @click="bindTab('../scan/main')">
        <img src="https://gw.alicdn.com/tfs/TB1gWBKmHvpK1RjSZFqXXcXUVXa-91-101.png" alt="">
      </div>
      <div class="index-tab-item icon-audio" @click="playAudio">
        <img src="https://gw.alicdn.com/tfs/TB1PStFmSzqK1RjSZFLXXcn2XXa-91-101.png" alt="" v-if="!isPlaying">
        <img src="https://gw.alicdn.com/tfs/TB1mMsUomzqK1RjSZFLXXcn2XXa-91-101.png" alt="" v-if="isPlaying">
      </div>
      <div class="index-tab-item icon-quiz" @click="bindTab('../quiz/main')" v-if="false">
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
    <scroll-view scroll-y class="scroll" :scroll-into-view="toView" >
      <div class="scroll-title">
        <img :src="titleSrc" class="scroll-title-pic">
        <img src="https://gw.alicdn.com/tfs/TB1ZJh6mSzqK1RjSZPxXXc4tVXa-245-52.png" class="scroll-title-text">
        <img src="https://gw.alicdn.com/tfs/TB1jUCamRLoK1RjSZFuXXXn0XXa-343-214.png" class="scroll-title-body">
      </div>
      <div class="spot">
        <div class="spot-item" :class="activeIndex == 1?'active':''" id="spot1">
          <div @click="firstSpot">1</div> 
          <div class="spot-item-tri" v-if="activeIndex == 1"></div>
          <div class="spot-item-window" :style="{right:calcRight+'rpx'}" v-if="activeIndex == 1" @click=goDetail>
            <img class="spot-item-window-pic" :src="prefix + currentSpot.spot_coverurl" v-if=currentSpot.spot_coverurl>
            <div class="spot-item-window-text">
              <div class="spot-item-window-title">{{currentSpot.spot_title}}</div>
              <div class="spot-item-window-desc">{{currentSpot.spot_describe}}</div>
            </div>
          </div>
        </div>
        <div class="spot-item" v-for="(item,index) in fullSpot" :key="index" :class="activeIndex == index+2?'active':''" :id="'spot'+item">
          <div @click="chooseSpot(item,index)">{{item}}</div> 
          <div class="spot-item-tri" v-if="activeIndex == index+2"></div>
          <div class="spot-item-window" :style="{right:calcRight+'rpx'}" v-if="activeIndex == index+2" @click=goDetail>
            <img class="spot-item-window-pic" :src="prefix + currentSpot.spot_coverurl" v-if=currentSpot.spot_coverurl>
            <div class="spot-item-window-text">
              <div class="spot-item-window-title">{{currentSpot.spot_title}}</div>
              <div class="spot-item-window-desc">{{currentSpot.spot_describe}}</div>
            </div>
          </div>
        </div>
      </div>
      <img src="https://gw.alicdn.com/tfs/TB1IvF1mSzqK1RjSZFHXXb3CpXa-580-9295.png" mode="widthFix" class="scroll-road">
      <img src="https://gw.alicdn.com/tfs/TB1xbXBmSzqK1RjSZFpXXakSXXa-532-8080.png" mode="widthFix" class="scroll-bg" @load=finishLoadImg>
    </scroll-view>
    <div class="cover" @click="showRoadSelect = false" v-if="showRoadSelect"></div>
    <div class="modal" v-if="showRoadSelect">
      <div class="modal-tab">
        <div class="modal-tab-title" @click="tab1 = !tab1">
          <img src="https://gw.alicdn.com/tfs/TB1uLyAnxjaK1RjSZKzXXXVwXXa-80-80.png" class="modal-tab-title-logo" >
          <div class="modal-tab-title-text">
            <div class="modal-tab-title-text-stage">第一段</div>
            <div class="modal-tab-title-text-name">自然研习径</div>
          </div>
          <img class="modal-tab-title-icon" :class="tab1?'':'rotate'" src="https://gw.alicdn.com/tfs/TB19EKcnpzqK1RjSZFvXXcB7VXa-22-25.png">
        </div>
        <div class="modal-tab-content" v-if=tab1>
          <div class="modal-tab-content-item" v-for="(item,index) in natureList" :key="index"  @click="toSmallLine(index)">
            {{item}}
          </div>
        </div>
      </div>
      <div class="modal-tab">
        <div class="modal-tab-title" @click="bindTab('../index-sg/main')">
          <img src="https://gw.alicdn.com/tfs/TB1WEmfnxTpK1RjSZFMXXbG_VXa-79-80.png" class="modal-tab-title-logo">
          <div class="modal-tab-title-text">
            <div class="modal-tab-title-text-stage">第二段</div>
            <div class="modal-tab-title-text-name">诗歌研习径</div>
          </div>
          <img class="modal-tab-title-icon" :class="tab2?'':'rotate'" src="https://gw.alicdn.com/tfs/TB19EKcnpzqK1RjSZFvXXcB7VXa-22-25.png">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { config } from "../../utils/index";

export default {
  data() {
    return {
      prefix: config.prefix,
      currentSpot: {
        spot_coverurl: "",
        spot_title: "",
        spot_describe: "",
        spot_id: ""
      },
      fullHeight: "",
      activeIndex: 1,
      toView: "spot1",
      titleSrc:
        "https://gw.alicdn.com/tfs/TB1K_SBi4jaK1RjSZFAXXbdLFXa-222-146.png",
      fullSpot: [],
      isIPX: false,
      isPlaying: false,
      innerAudioContext: wx.createInnerAudioContext(),
      showRoadSelect: false,
      tab1: false,
      tab2: false,
      natureList: [
        "滨海线研习段",
        "二线关研习段",
        "大岭古研习段",
        "红花岭水库研习段",
        "洞背村研习段"
      ]
    };
  },

  computed: {
    bodyHeight() {
      let l = this.fullSpot.length;
      let full_h,
        full_s = 89;
      this.isIPX ? (full_h = 780) : (full_h = 940);
      // full_h = 780
      let h = parseInt(l * full_h / full_s);
      return `${h}%`;
    },
    calcRight() {
      if (this.activeIndex == 1) {
        return -50;
      }
      const a = this.activeIndex % 6;
      switch (a) {
        case 0:
          return -260;
        case 1:
          return -120;
        case 2:
          return 0;
        case 3:
          return -116;
        case 4:
          return -250;
        case 5:
          return -380;
      }
    }
  },

  components: {},

  methods: {
    finishLoadImg(e) {
      console.log(e.target);
      this.fullHeight = e.target.height;
    },
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
    bindTab(url) {
      wx.navigateTo({ url: url });
    },
    goDetail() {
      // 备注:因为二维码从1开始计数,所以放到list中再去-1
      const index = parseInt(this.activeIndex);
      wx.navigateTo({ url: "../list/main?spot_index=" + index });
    },
    showRoadName() {
      this.showRoadSelect = true;
    },
    toSmallLine(index) {
      let lineNo = parseInt(index + 1);
      let top;
      switch (lineNo) {
        case 1:
          top = 0;
          this.activeIndex = 1;
          break;
        case 2:
          top = 1100;
          this.activeIndex = 20;
          break;
        case 3:
          top = 1800;
          this.activeIndex = 32;
          break;
        case 4:
          top = 2700;
          this.activeIndex = 47;
          break;
        case 5:
          top = 3700;
          this.activeIndex = 64;
          break;
      }
      this.currentSpot = this.spotList[this.activeIndex - 1];
      wx.pageScrollTo({
        scrollTop: top,
        duration: 0
      });
      this.showRoadSelect = false;
      this.tab1 = false;
    },
    chooseSpot(item, index) {
      this.activeIndex == index + 2
        ? (this.activeIndex = -1)
        : (this.activeIndex = index + 2);
      this.currentSpot = this.spotList[this.activeIndex - 1];
    },
    firstSpot() {
      this.activeIndex = 1;
      this.currentSpot = this.spotList[0];
    },
    playAudio() {
      // console.log(this.currentSpot.spot_id)
      if (this.isPlaying) {
        this.innerAudioContext.stop();
        this.isPlaying = false;
        return;
      }
      wx.request({
        url: config.base + "attraction/listdetail", //开发者服务器接口地址",
        data: {
          spot_id: this.currentSpot.spot_id
        }, //请求的参数",
        method: "GET",
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res.data.data);
          this.audioUrl =
            res.data.data.audio_url == null
              ? ""
              : config.prefix + res.data.data.audio_url;
          if (this.audioUrl) {
            this.innerAudioContext.src = this.audioUrl;
            this.innerAudioContext.play();
            this.isPlaying = true;
          }
        },
        fail: () => {},
        complete: () => {}
      });
    },
    login(code) {
      const userInfo = wx.getStorageSync("userInfo");
      wx.request({
        url: config.base + "wxlogin/login",
        data: {
          code: code,
          lineId: config.lineId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          city: userInfo.city,
          province: userInfo.province,
          country: userInfo.country
        },
        method: "GET",
        dataType: "json",
        success: res => {
          // console.log('login',res.data.data)
          this.setStorage("userCode", res.data.data);
        },
        fail: err => {
          console.log("hasError", err);
        }
      });
    },
    getSpot() {
      const self = this;
      const storageData = wx.getStorageSync("NatureList");
      if (storageData) {
        this.spotList = storageData;
        this.currentSpot = storageData[0];
        this.fullSpot.length = 0;
        for (let i = 2; i <= storageData.length; i++) {
          this.fullSpot.push(i);
        }
        return;
      }
      wx.request({
        url: config.base + "attraction/NaturalList", //开发者服务器接口地址",
        data: {
          lineId: config.lineId
        }, //请求的参数",
        method: "GET",
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          // console.log(res)
          // self.GLOBAL.spot_list = res.data.data
          const data = res.data.data;
          this.setStorage("NatureList", data);
          this.spotList = data;
          this.currentSpot = data[0];
          this.fullSpot.length = 0;
          for (let i = 2; i <= data.length; i++) {
            this.fullSpot.push(i);
          }
        },
        fail: () => {},
        complete: () => {}
      });
    }
  },

  created() {
    // wx.login({
    //   success: (res) => {
    //     console.log(res)
    //     this.login(res.code);
    //   }
    // });
    // this.scrollTo = 'spot' + parseInt(this.activeIndex + 2)
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
    wx.getSystemInfo({
      success: res => {
        if (res.model == "iPhone X") {
          this.isIPX = true;
        }
      }
    });
  },
  onReady() {
    // this.toView = 'spot12'
  },
  onShow() {},
  onHide() {
    this.isPlaying = false;
    this.innerAudioContext.stop();
  }
};
</script>

<style scoped lang="less">
// z-index: 右上角菜单，21,顶部标题图，21
.container {
  position: relative;
  overflow: hidden;
}
.spot {
  width: 100%;
  position: absolute;
  top: 2.8%;
  &-first {
    position: relative;
    z-index: 2;
    width: 64rpx;
    height: 64rpx;
    line-height: 64rpx;
    text-align: center;
    color: #fff;
    font-size: 34rpx;
    background: url("https://gw.alicdn.com/tfs/TB1LC9gmH2pK1RjSZFsXXaNlXXa-60-70.png")
      no-repeat center/contain;
    margin-bottom: 7%;
    margin-left: 55%;
    &-window {
      width: 522rpx;
      height: 176rpx;
      border-bottom: 1px solid #c7c7c7;
      background: url("https://gw.alicdn.com/tfs/TB1PHRpnCzqK1RjSZPxXXc4tVXa-1809-607.png")
        no-repeat center/contain;
      position: absolute;
      bottom: -180rpx;
      z-index: 30;
      display: flex;
      &-pic {
        width: 136rpx;
        height: 134rpx;
        background: #fff;
        margin: 12rpx 12rpx 0 32rpx;
      }
      &-text {
        width: 280rpx;
        display: flex;
        flex-direction: column;
        color: #101010;
        text-align: left;
        overflow: hidden;
      }
      &-title {
        margin-top: 45rpx;
        font-size: 28rpx;
        line-height: 40rpx;
        white-space: nowrap;
      }
      &-desc {
        font-size: 20rpx;
        color: #6f6f6f;
        line-height: 30rpx;
      }
    }
    &-tri {
      width: 52rpx;
      height: 30rpx;
      background: url("https://gw.alicdn.com/tfs/TB1C0d3nwHqK1RjSZFkXXX.WFXa-181-96.png")
        no-repeat center/cover;
      position: absolute;
      bottom: -36rpx;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 31;
      transform: rotate(180deg);
    }
  }
  &-first.active,
  &-item.active {
    position: relative;
    background: url("https://gw.alicdn.com/tfs/TB1b7gKnmrqK1RjSZK9XXXyypXa-60-68.png")
      no-repeat center/contain;
  }
  &-first.active:after,
  &-item.active:after {
    content: "";
    width: 28rpx;
    height: 24rpx;
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    background: url("https://gw.alicdn.com/tfs/TB1.uXenxnaK1RjSZFBXXcW7VXa-28-24.png")
      no-repeat center/cover;
  }
  &-item {
    position: relative;
    z-index: 30;
    width: 64rpx;
    height: 64rpx;
    line-height: 64rpx;
    text-align: center;
    color: #fff;
    font-size: 34rpx;
    background: url("https://gw.alicdn.com/tfs/TB1LC9gmH2pK1RjSZFsXXaNlXXa-60-70.png")
      no-repeat center/contain;
    margin-bottom: 7.4%;
    &-window {
      width: 522rpx;
      height: 176rpx;
      border-bottom: 1px solid #c7c7c7;
      background: url("https://gw.alicdn.com/tfs/TB1PHRpnCzqK1RjSZPxXXc4tVXa-1809-607.png")
        no-repeat center/contain;
      position: absolute;
      bottom: 90rpx;
      z-index: 30;
      display: flex;
      &-pic {
        width: 136rpx;
        height: 134rpx;
        background: #fff;
        margin: 12rpx 12rpx 0 32rpx;
      }
      &-text {
        width: 280rpx;
        display: flex;
        flex-direction: column;
        color: #101010;
        text-align: left;
        overflow: hidden;
      }
      &-title {
        margin-top: 45rpx;
        font-size: 28rpx;
        line-height: 40rpx;
        white-space: nowrap;
      }
      &-desc {
        font-size: 20rpx;
        color: #6f6f6f;
        line-height: 30rpx;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 2; /** 显示的行数 **/
        overflow: hidden; /** 隐藏超出的内容 **/
      }
    }
    &-tri {
      width: 52rpx;
      height: 30rpx;
      background: url("https://gw.alicdn.com/tfs/TB1C0d3nwHqK1RjSZFkXXX.WFXa-181-96.png")
        no-repeat center/cover;
      position: absolute;
      top: -28rpx;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 31;
    }
  }
  &-item:nth-of-type(6n + 2) {
    margin-left: 68%;
  }
  &-item:nth-of-type(6n + 3) {
    margin-left: 52%;
  }
  &-item:nth-of-type(6n + 1) {
    margin-left: 55.3%;
  }
  &-item:nth-of-type(6n + 4) {
    margin-left: 35%;
  }
  &-item:nth-of-type(6n) {
    margin-left: 38%;
  }
  &-item:nth-of-type(6n + 5) {
    margin-left: 21%;
  }
}
.scroll {
  position: relative;
  &-title {
    width: 402rpx;
    height: 234rpx;
    position: absolute;
    top: 0.1%;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 21;
    &-body {
      width: 402rpx;
      height: 210rpx;
      position: absolute;
      top: 68rpx;
      z-index: 22;
    }
    &-text {
      width: 286rpx;
      height: 60rpx;
      position: absolute;
      top: 180rpx;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 23;
    }
    &-pic {
      width: 200rpx;
      height: 200rpx;
      border-radius: 50%;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      margin: auto;
      border: 12rpx solid #292770;
    }
  }
  &-road {
    width: 90%;
    position: absolute;
    top: 2%;
  }
  &-bg {
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
  z-index: 21;
  &-item {
    width: 120rpx;
    height: 130rpx;
    margin-bottom: 36rpx;
    position: relative;
    z-index: 23;
  }
  &-line {
    width: 1px;
    height: 90%;
    background-image: url("https://gw.alicdn.com/tfs/TB1B10KmFzqK1RjSZSgXXcpAVXa-2-762.png");
    background-repeat: repeat-y;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 10rpx;
    right: 32rpx;
    z-index: 22;
  }
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.cover {
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  z-index: 80;
  top: 0;
  left: 0;
}
.modal {
  width: 100%;
  position: fixed;
  z-index: 82;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  &-tab {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    background: #fff;
    &-title {
      height: 150rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      &-logo {
        width: 76rpx;
        height: 76rpx;
        border-radius: 50%;
        overflow: hidden;
        border: 1px solid #292770;
        margin-right: 14rpx;
      }
      &-text {
        display: flex;
        flex-direction: column;
        font-size: 28rpx;
        line-height: 34rpx;
        font-weight: bold;
      }
      &-icon {
        width: 22rpx;
        height: 26rpx;
        margin-top: 36rpx;
        margin-left: 20rpx;
      }
    }
    &-content {
      text-align: center;
      line-height: 80rpx;
      font-size: 28rpx;
      background: #f6f7f6;
    }
  }
}
.rotate {
  transform: rotate(180deg);
}
</style>
