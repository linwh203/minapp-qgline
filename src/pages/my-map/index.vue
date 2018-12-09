<template>
  <div class="container">
    <map
      id="map"
      :longitude="lng"
      :latitude="lat"
      scale="20"
      :controls="controls"
      :markers="markers"
      :polyline="polyline"
      show-location
      style="width: 100%; height: 100%;"
      @click="touchMap"
      @markertap="touchMarker"
    >
      <!-- <cover-view>
        <cover-image src="https://gw.alicdn.com/tfs/TB1JlSPn7zoK1RjSZFlXXai4VXa-2835-2835.jpg"></cover-image>
      </cover-view>-->
    </map>
    <div class="modal">
      <div
        v-if="currSpot"
        class="spot-item-window"
        :class="'window-'+currSpot.sortNo"
        @click="viewDetail(currSpot)"
      >
        <div class="left"></div>
        <img
          class="spot-item-window-pic"
          :src="prefix + currSpot.spot_coverurl"
          v-if="currSpot.spot_coverurl"
        >
        <div class="spot-item-window-text">
          <div class="spot-item-window-title">{{currSpot.spot_title}}</div>
          <div class="spot-item-window-desc">{{currSpot.spot_describe}}</div>
        </div>
        <div class="right"></div>
      </div>
    </div>
    <div class="message" v-if="isShowOutTip">您当前不在研习径范围内,不能进行定位讲解</div>
  </div>
</template>

<script>
import { config } from "../../utils/index";
var amapFile = require("../../utils/amap-wx.js");

export default {
  data() {
    return {
      lng: 0,
      lat: 0,
      prefix: config.prefix,
      // 查询的类型,"自然线"或者"诗歌线"
      queryType: 0,
      // 当前spot
      currSpot: undefined,
      controls: [],
      markers: [],
      distance: "",
      cost: "",
      polyline: [],
      spotList: [],
      // audio
      innerAudioContext: undefined,
      // 是否是主动播放
      isActivePlay: false,
      // 尝试主动播放的标记
      isTryActivePlay: false,
      // 是否在播放
      isPlaying: false,

      // position
      tForPosition: 0,
      hasShowOutTip: false,
      isShowOutTip: false,
      mapStart: {
        lng: 114.49358,
        lat: 22.61034
      },
      mapEnd: {
        lng: 114.50023,
        lat: 22.59959
      },
      person: undefined
    };
  },
  computed: {},

  components: {},

  methods: {
    // 去浏览spot的详细界面
    viewDetail(spot) {
      wx.navigateTo({ url: "../list/main?spot_index=" + spot.sortNo });
    },
    getSpot(queryType) {
      let queryTypeStr = queryType === 0 ? "NatrueList" : "PoetryList";
      let storageName, queryUrl;
      if (queryType === 0) {
        storageName = "NatrueList";
        queryUrl = config.base + "attraction/NaturalList";
      } else {
        storageName = "PoetryList";
        queryUrl = config.base + "attraction/PoetryList";
      }
      return new Promise(resolve => {
        const storageData = wx.getStorageSync(storageName);
        if (storageData) {
          this.spotList = storageData;
          resolve();
          return;
        }
        wx.request({
          url: queryUrl, //开发者服务器接口地址",
          data: {
            lineId: config.lineId
          }, //请求的参数",
          method: "GET",
          dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
          success: res => {
            // console.log(res)
            let data = res.data.data;
            this.setStorage(storageName, data);
            this.spotList = data;
            resolve();
          },
          fail: () => {},
          complete: () => {}
        });
      });
    },
    createMarkers(spotList) {
      console.log("create Markers");
      this.markers = spotList.map(n => {
        return {
          id: n.sortNo,
          title: n.spot_name,
          longitude: n.longitude,
          latitude: n.latitude,
          iconPath: "../../assets/spot-gray.png",
          callout: {
            content: n.spot_title,
            color: "#ff0000",
            bgColor: "333333"
          },
          label: {
            content: n.spot_name
          }
        };
      });
      this.person = {
        id: 999,
        longitude: 0,
        latitude: 0,
        iconPath: "../../assets/icon-avator.png"
      };
      this.markers.pus(this.person);
    },
    // 寻找一个合适的当前spot
    // 如果不在目标区域内,则放弃
    // 否则,就找个最近的
    findCurrSpot(spotList) {
      console.log("find current spot");
      this.activeSpot(1);
    },
    touchMap(e) {
      console.log(e);
      this.stopAudio();
    },
    touchMarker(e) {
      console.log("touch marker");
      console.log(e);
      let markerId = e.mp.markerId;

      this.isTryActivePlay = true;
      this.activeSpot(markerId);
    },
    activeSpot(spotId) {
      // 反激活
      if (this.currSpot) {
        let ma = this.markers.find(n => n.id == this.currSpot.sortNo);
        ma.iconPath = "../../assets/spot-gray.png";
      }

      // 激活
      this.currSpot = this.spotList.find(n => n.sortNo == spotId);
      let ma = this.markers.find(n => n.id == spotId);
      ma.iconPath = "../../assets/spot-highlight.png";

      // 激活audio的播放
      this.playAudio(this.currSpot.spot_id);
    },
    // 播放音频
    playAudio(spotId) {
      new Promise(resolve => {
        wx.request({
          url: config.base + "attraction/listdetail", //开发者服务器接口地址",
          data: {
            spot_id: spotId
          }, //请求的参数",
          method: "GET",
          dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
          success: res => {
            console.log(res.data.data);
            let data = res.data.data;
            resolve(data.audio_url);
          },
          fail: () => {
            resolve(null);
          },
          complete: () => {}
        });
      }).then(audioUrl => {
        if (audioUrl) {
          this.innerAudioContext.src = config.prefix + audioUrl;
          this.innerAudioContext.play();
          console.log(this.innerAudioContext.src, "play audio");
        }
      });
    },
    stopAudio() {
      this.innerAudioContext && this.innerAudioContext.stop();
    },
    initAudio() {
      // 初始化audio
      this.innerAudioContext = wx.createInnerAudioContext();
      console.log(this.innerAudioContext);
      this.innerAudioContext.onPlay(() => {
        console.log("audio event: play");
        this.isPlaying = true;
        if (this.isTryActivePlay) {
          this.isActivePlay = true;
          this.isTryActivePlay = false;
        }
      });

      this.innerAudioContext.onStop(() => {
        console.log("audio event: stop");
        this.isPlaying = false;
        this.isTryActivePlay = false;
        if (this.isActivePlay) {
          this.isActivePlay = false;
        }
      });

      this.innerAudioContext.onEnded(() => {
        console.log("audio event: ended");
        this.isPlaying = false;
        this.isTryActivePlay = false;
        if (this.isActivePlay) {
          this.isActivePlay = false;
        }
      });
    },
    getPosition() {
      return new Promise(resolve => {
        wx.getLocation({
          type: "wgs84", //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标,
          success: res => {
            resolve({ lng: res.longitude, lat: res.latitude });
          },
          fail: () => {
            resolve(null);
          }
        });
      });
    },
    isPositionOut(lng, lat) {
      return (
        lat < Math.min(this.mapStart.lat, this.mapEnd.lat) ||
        lat > Math.max(this.mapStart.lat, this.mapEnd.lat) ||
        lng < Math.min(this.mapStart.lng, this.mapEnd.lng) ||
        lng > Math.max(this.mapStart.lng, this.mapEnd.lng)
      );
    },
    // 设置小人的位置
    setPersonPosition(posi) {
      this.person.longitude = posi.lng;
      this.person.latitude = posi.lat;
    },
    // 寻找最新点
    findNearSpot(posi) {}
  },
  created() {
    console.log("create");

    this.initAudio();

    this.getSpot().then(() => {
      if (this.spotList) {
        this.lng = this.spotList[0].longitude;
        this.lat = this.spotList[0].latitude;
      }
      this.createMarkers(this.spotList);
      this.findCurrSpot(this.spotList);
    });
  },
  onLoad(options) {
    console.log(options);
  },
  onShow() {
    // 轮询坐标
    this.tForPosition = setInterval(() => {
      this.getPosition().then(posi => {
        if (posi) {
          if (!this.hasShowOutTip) {
            if (this.isPositionOut(posi.lng, posi.lat)) {
              this.isShowOutTip = true;
              this.hasShowOutTip = true;
              setTimeout(() => {
                this.isShowOutTip = false;
              }, 2000);
            }
          }
          // 设置小人的坐标
          this.setPersonPosition(posi);
          // 寻找距离本人较近的spot
          this.findNearSpot(posi);
        }
      });
    }, 5000);
  },
  onHide() {
    // 清除轮询的句柄
    clearInterval(this.tForPosition);
  }
};
</script>

<style scoped lang="less">
.container {
  .modal {
    position: fixed;
    bottom: 0rpx;
    width: 100%;
    height: 176rpx;
  }

  .spot-item-window {
    width: 522rpx;
    height: 176rpx;
    border-bottom: 1px solid #c7c7c7;
    background: url("https://gw.alicdn.com/tfs/TB1PHRpnCzqK1RjSZPxXXc4tVXa-1809-607.png")
      no-repeat center/contain;
    position: absolute;
    z-index: 999;
    display: flex;
    .left {
      background: url("../../assets/box-left.png") no-repeat;
    }
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
      overflow: hidden;
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
}
.message {
  @w: 80vw;
  @h: 20vh;
  width: @w;
  height: @h;
  position: absolute;
  top: calc(50% - @h / 2);
  left: calc(50% - @w / 2);
  background-color: black;
  opacity: 0.6;
  color: white;
  padding: 5% 15% 0;
  box-sizing: border-box;
  &-close {
    position: absolute;
    @size: 50rpx;
    width: @size;
    height: @size;
    right: 20rpx;
    top: 20rpx;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
