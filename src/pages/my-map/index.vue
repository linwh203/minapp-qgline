<template>
  <div class="container">
    <map
      id="map"
      :longitude="focus.lng"
      :latitude="focus.lat"
      scale="20"
      :controls="controls"
      :markers="markers"
      :polygons="polygons"
      :polyline="polyline"
      show-location
      style="width: 100%; height:calc(100% - 176rpx)"
      @click="touchMap"
      @markertap="touchMarker"
    >
      <!-- <cover-view>
        <cover-image src="https://gw.alicdn.com/tfs/TB1JlSPn7zoK1RjSZFlXXai4VXa-2835-2835.jpg"></cover-image>
      </cover-view>-->
      <cover-view class="message" v-if="isShowOutTip">
        <cover-view>您当前不在研习径范围内,</cover-view>
        <cover-view>不能进行定位讲解</cover-view>
      </cover-view>
      <cover-view class="reset" @click="resetPosition">
        <cover-image
          class="img"
          src="https://gw.alicdn.com/tfs/TB1RwLAvQzoK1RjSZFlXXai4VXa-57-96.png"
        />
      </cover-view>
      <!-- <img class="img" src="../../assets/reset.png">
      <img class="img" src="../../assets/spot-gray.png">
      <img class="img" src="../../assets/spot-highlight.png">-->
    </map>
    <div class="modal">
      <div
        v-if="currSpot"
        class="spot-item-window"
        :class="'window-'+currSpot.sortNo"
        @click="viewDetail(currSpot)"
      >
        <img
          class="left"
          mode="aspectFit"
          src="https://gw.alicdn.com/tfs/TB1HPbzvQvoK1RjSZFwXXciCFXa-20-140.png"
          alt
        >
        <div class="middle">
          <img
            class="spot-item-window-pic"
            :src="prefix + currSpot.spot_coverurl"
            v-if="currSpot.spot_coverurl"
          >
          <div class="spot-item-window-text">
            <div class="spot-item-window-title">{{currSpot.spot_title}}</div>
            <div class="spot-item-window-desc">{{currSpot.spot_describe}}</div>
          </div>
        </div>
        <img
          class="right"
          mode="aspectFit"
          src="https://gw.alicdn.com/tfs/TB1wj_vvQvoK1RjSZFNXXcxMVXa-48-140.png"
          alt
        >
      </div>
    </div>
  </div>
</template>

<script>
import { config } from "../../utils/index";
var amapFile = require("../../utils/amap-wx.js");

export default {
  data() {
    return {
      // 调试
      // isMock: true,
      isMock: false,
      // 地图上下文
      mapIns: undefined,
      // 人的位置
      lng: 0,
      lat: 0,
      // 焦点位置
      focus: {
        lng: 114.35762024,
        lat: 22.61326927
      },
      prefix: config.prefix,
      // 查询的类型,"自然线"或者"诗歌线"
      queryType: 0,
      // 当前spot
      currSpot: undefined,
      controls: [],
      markers: [],
      polygons: undefined,
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
      let storageName, queryUrl;
      if (queryType === 0) {
        storageName = "NatrueList";
        queryUrl = config.base + "attraction/NaturalList";
      } else {
        storageName = "PoetryList";
        queryUrl = config.base + "attraction/PoetryList";
      }
      return new Promise(resolve => {
        console.log({ storageName });
        const storageData = wx.getStorageSync(storageName);
        if (storageData) {
          // this.spotList = storageData;
          resolve(storageData);
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
            data = typeof data === "string" ? JSON.parse(data) : data;
            wx.setStorageSync(storageName, data);
            // this.spotList = data;
            resolve(data);
          },
          fail: () => {},
          complete: () => {}
        });
      });
    },
    createMarkers(spotList) {
      console.log("create markers ...");
      let geo = (this.geo = this.geo || this.initGeoTrans());

      this.markers = spotList.map(n => {
        let trans = geo.gcj_encrypt(n.latitude, n.longitude);
        // console.log(trans);
        // 语音：https://etx.forestvisual.com/File/Download?fileName=Icon/Audio/1.png&;fileType=QGLineFile
        // 自然线地图 https://etx.forestvisual.com/File/Download?fileName=Icon/NaturalMap/1.png&fileType=QGLineFile
        // 诗歌线线地图 https://etx.forestvisual.com/File/Download?fileName=Icon/PoetryMap/1.png&fileType=QGLineFile
        let iconPath;
        let queryType = n.queryType;
        if (queryType === 1) {
          iconPath = `https://etx.forestvisual.com/File/Download?fileName=Icon/NaturalMap/${
            n.sortNo
          }.png&fileType=QGLineFile`;
        } else {
          iconPath = `https://etx.forestvisual.com/File/Download?fileName=Icon/PoetryMap/${
            n.sortNo
          }.png&fileType=QGLineFile`;
        }
        return {
          // id: n.sortNo,
          id: n.id,
          title: n.spot_name,
          longitude: trans.lon,
          latitude: trans.lat,
          iconPath,
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
      // 因为真机在地图上已经有了蓝色箭头,所以不需要小人了
      // this.person = {
      //   id: 999,
      //   longitude: 114.35762024,
      //   latitude: 22.61326927,
      //   iconPath: "../../assets/icon-avator.png",
      //   width: 40,
      //   height: 40
      // };
      // this.markers.push(this.person);
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

      this.setFocusePositionBySortNo(markerId);
    },
    // 设置焦点坐标,通过markerId
    setFocusePositionBySortNo(sortNo) {
      let spot = this.spotList.find(n => n.sortNo === sortNo);
      this.setFocusePosition(spot.longitude, spot.latitude);
    },
    // 设置焦点坐标
    setFocusePosition(lng, lat) {
      if (this.focus.lng !== lng || this.focus.lat !== lat) {
        console.log("reset focus position");
        this.focus = { lng, lat };
      }
    },
    activeSpot(spotId) {
      // 反激活
      if (this.currSpot) {
        let ma = this.markers.find(n => n.id == this.currSpot.sortNo);
        ma.iconPath =
          "https://gw.alicdn.com/tfs/TB11oPzvIfpK1RjSZFOXXa6nFXa-35-54.png";
      }

      // 激活
      this.currSpot = this.spotList.find(n => n.sortNo == spotId);
      let ma = this.markers.find(n => n.id == spotId);
      ma.iconPath =
        "https://gw.alicdn.com/tfs/TB1jyYuvSzqK1RjSZFjXXblCFXa-71-55.png";

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
          type: "gcj02", //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标,
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
      if (this.isMock) {
        posi = {
          lng: 114.3576889,
          lat: 22.61283875
        };
      }
      let { lng, lat } = posi;
      // console.log("this.mapIns", this.mapIns.getScale + "");
      // this.mapIns.getScale({
      //   success: res => {
      //     console.log("map scale", res.scale);
      //   },
      //   fail: res => {
      //     console.log("map fail", res);
      //   }
      // });
      // this.mapIns.translateMarker({
      //   markerId: 999,
      //   destination: {
      //     longitude: lng,
      //     latitude: lat
      //   }
      // });
      if (this.person.longitude !== lng || this.person.latitude !== lat) {
        this.person.longitude = lng;
        this.person.latitude = lat;
      }
    },
    // 寻找最新点
    findNearSpot(posi) {
      // 30米的经纬度差距
      const LNG_INTERVAL = 0.00029505;
      const LAT_INTERVAL = 0.00029608;
      const DIST = 30;
      let getDistance = (lng1, lat1, lng2, lat2) => {
        let d1 = Math.abs(lng1 - lng2) / LNG_INTERVAL * DIST;
        let d2 = Math.abs(lat1 - lat2) / LAT_INTERVAL * DIST;
        return Math.sqrt(d1 * d1 + d2 * d2);
      };
      //       我设置的起点是114.496872, 22.605782
      // 得到的30米偏差的经纬度坐标114.496602505415, 22.6055332100731
      // console.log(
      //   "getDistance",
      //   getDistance(114.496872, 22.605782, 114.496602505415, 22.6055332100731)
      // );

      if (this.spotList) {
        this.spotList.find(n => {
          let { longitude, latitude, sortNo } = n;
          if (
            this.lng &&
            this.lat &&
            getDistance(this.lng, this.lat, longitude, latitude) <= DIST &&
            1
          ) {
            // 激活最近点
            console.log("尝试激活最近点", sortNo - 1);
            if (this.isActivePlay) {
              return;
            }
            if (this.currSpot && this.currSpot.sortNo === sortNo) {
              return;
            }
            console.log("激活最近点", sortNo);
            this.activeSpot(sortNo);
            return true;
          }
        });
      }
    },
    resetPosition() {
      this.getPosition().then(posi => {
        if (posi) {
          this.setFocusePosition(posi.lng, posi.lat);
        }
      });
    },
    initMap() {
      this.mapIns = wx.createMapContext("map");
      console.log("map instance:", this.mapIns);
    },
    initGeoTrans() {
      var GPS = {
        PI: 3.14159265358979324,
        x_pi: 3.14159265358979324 * 3000.0 / 180.0,
        delta: function(lat, lon) {
          // Krasovsky 1940
          // // a = 6378245.0, 1/f = 298.3
          // b = a * (1 - f)
          // ee = (a^2 - b^2) / a^2;
          var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
          var ee = 0.00669342162296594323;
          //  ee: 椭球的偏心率。
          var dLat = this.transformLat(lon - 105.0, lat - 35.0);
          var dLon = this.transformLon(lon - 105.0, lat - 35.0);
          var radLat = lat / 180.0 * this.PI;
          var magic = Math.sin(radLat);
          magic = 1 - ee * magic * magic;
          var sqrtMagic = Math.sqrt(magic);
          dLat = dLat * 180.0 / (a * (1 - ee) / (magic * sqrtMagic) * this.PI);
          dLon = dLon * 180.0 / (a / sqrtMagic * Math.cos(radLat) * this.PI);
          return { lat: dLat, lon: dLon };
        },
        //GPS---高德
        gcj_encrypt: function(wgsLat, wgsLon) {
          if (this.outOfChina(wgsLat, wgsLon))
            return { lat: wgsLat, lon: wgsLon };
          var d = this.delta(wgsLat, wgsLon);
          return { lat: wgsLat + d.lat, lon: wgsLon + d.lon };
        },
        outOfChina: function(lat, lon) {
          if (lon < 72.004 || lon > 137.8347) return true;
          if (lat < 0.8293 || lat > 55.8271) return true;
          return false;
        },
        transformLat: function(x, y) {
          var ret =
            -100.0 +
            2.0 * x +
            3.0 * y +
            0.2 * y * y +
            0.1 * x * y +
            0.2 * Math.sqrt(Math.abs(x));
          ret +=
            (20.0 * Math.sin(6.0 * x * this.PI) +
              20.0 * Math.sin(2.0 * x * this.PI)) *
            2.0 /
            3.0;
          ret +=
            (20.0 * Math.sin(y * this.PI) +
              40.0 * Math.sin(y / 3.0 * this.PI)) *
            2.0 /
            3.0;
          ret +=
            (160.0 * Math.sin(y / 12.0 * this.PI) +
              320 * Math.sin(y * this.PI / 30.0)) *
            2.0 /
            3.0;
          return ret;
        },
        transformLon: function(x, y) {
          var ret =
            300.0 +
            x +
            2.0 * y +
            0.1 * x * x +
            0.1 * x * y +
            0.1 * Math.sqrt(Math.abs(x));
          ret +=
            (20.0 * Math.sin(6.0 * x * this.PI) +
              20.0 * Math.sin(2.0 * x * this.PI)) *
            2.0 /
            3.0;
          ret +=
            (20.0 * Math.sin(x * this.PI) +
              40.0 * Math.sin(x / 3.0 * this.PI)) *
            2.0 /
            3.0;
          ret +=
            (150.0 * Math.sin(x / 12.0 * this.PI) +
              300.0 * Math.sin(x / 30.0 * this.PI)) *
            2.0 /
            3.0;
          return ret;
        }
      };
      return GPS;
    },
    createPolygons() {
      let geo = this.initGeoTrans();
      let url = config.base + "Attraction/map";
      wx.request({
        url,
        success: res => {
          let data = res.data.data;
          data = data.map(n => {
            let format = geo.gcj_encrypt(n.latitude, n.longitude);
            return {
              latitude: format.lat,
              longitude: format.lon
            };
          });

          this.polygons = [
            {
              points: data,
              strokeColor: "#258a57AA",
              // fillColor: "#258a57AA"
              fillColor: "#22258a57"
            }
          ];
          console.log(data);
        }
      });
    }
  },
  created() {
    console.log("create");
    this.initMap();
    this.initAudio();
  },
  onLoad(options) {
    console.log(options);
    this.queryType = options.queryType - 0;
    Promise.all([this.getSpot(0), this.getSpot(1)]).then(data => {
      this.spotList = this.spotList || [];
      data.forEach((n, i) => {
        // 添加一个id属性
        // 自然线的sortNo=1,id=1
        // 诗歌线的sortNo=1,id=10000+1=10001;
        n = n.map(n => {
          n.id = 10000 * i + n.sortNo;
          n.queryType = i;
          return n;
        });

        this.spotList = this.spotList.concat(n);
      });
      this.createMarkers(this.spotList);
    });
    this.createPolygons();
  },
  onShow() {
    let index = 0;
    // 轮询坐标
    this.tForPosition = setInterval(() => {
      this.getPosition().then(posi => {
        if (posi) {
          if (this.isMock) {
            posi.lng = 114.35762024;
            posi.lat = 22.61326927;
          }
          index++;
          if (index == 0) {
            this.setFocusePosition(posi.lng, posi.lat);
          }
          // 当前坐标
          // 防止闪烁
          if (this.lng !== posi.lng || this.lat !== posi.lat) {
            this.lng = posi.lng;
            this.lat = posi.lat;
          }
          // mock
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
          // this.setPersonPosition(posi);
          // 寻找距离本人较近的spot
          this.findNearSpot(posi);
        }
      });
    }, 5000);
  },
  onHide() {
    // 清除轮询的句柄
    clearInterval(this.tForPosition);

    this.stopAudio();
  },
  onUnload() {
    // 清除轮询的句柄
    clearInterval(this.tForPosition);

    this.stopAudio();
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
    width: 100%;
    height: 176rpx;
    border-bottom: 1px solid #c7c7c7;
    position: absolute;
    z-index: 999;
    display: flex;
    .left {
      width: 26rpx;
      height: 100%;
    }
    .right {
      width: 60rpx;
      height: 100%;
    }
    .middle {
      flex: 1;
      background-color: #fff;
      display: flex;
      align-items: center;
    }
    &-pic {
      width: 136rpx;
      height: 134rpx;
      background: #fff;
      margin: 12rpx 12rpx 0 32rpx;
    }
    &-text {
      // width: 280rpx;
      flex: 1;
      display: flex;
      flex-direction: column;
      color: #101010;
      text-align: left;
      overflow: hidden;
    }
    &-title {
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
  text-align: center;
}
.reset {
  position: absolute;
  bottom: 20rpx;
  right: 40rpx;
  img {
    width: 48rpx;
    height: 48rpx;
  }
}
#map {
  height: 80vh;
}
</style>
