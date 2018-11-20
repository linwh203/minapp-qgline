<template>
  <div class="container" :style="{height:bodyHeight}">
    <map id="map" :longitude="lng" :latitude="lat" scale="16" :controls="controls" @controltap="controltap" :markers="markers" @markertap="markertap" :polyline="polyline" @regionchange="regionchange" show-location style="width: 100%; height: 100%;"></map>

  </div>
</template>

<script>
import { config } from "../../utils/index";

export default {
  data() {
    return {
      //  longitude: 113.3245211,
      //   latitude: 23.10229
      lng: 114.32751775,
      lat: 22.63737202,
      controls: [],
      markers: [],
      polyline: []
    };
  },
  computed: {},

  components: {},

  methods: {
    startScale(e) {
      let detail = e.mp.detail;
      let scale = detail.scale;
      console.log("start scale", scale);
      this._x = detail.x;
      this._y = detail.y;
      this._spotScale = 1 / scale;

      if (this._tScale) {
        clearTimeout(this._tScale);
      }
      this._tScale = setTimeout(() => {
        this.spotScale = this._spotScale;
        this.x = this._x;
        this.y = this._y;
      }, 100);
    },
    startTouch(e) {
      let detail = e.mp.detail;
      this._x = detail.x;
      this._y = detail.y;
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
    distance(item) {
      let x = this.locate(this.Xstart, this.Xend);
      let y = this.locate(this.Ystart, this.Yend);
      let width = 3753;
      let spotX = {},
        spotY = {};
      spotX.lng = this.Xstart.lng;
      spotX.lat = item.latitude;
      let left = this.locate(this.Xstart, spotX);
      spotY.lng = item.longitude;
      spotY.lat = this.Ystart.lat;
      let top = this.locate(this.Ystart, spotY);
      let result = {
        top: left * width / x,
        left: top * width / y
      };
      return result;
    },
    bindTab(url) {
      wx.navigateTo({ url: url });
    },
    viewDetail(item) {
      const index = this.activeSpot < 0 ? 0 : this.activeSpot;
      wx.navigateTo({ url: "../list/main?spot_index=" + index });
    },
    showWindow(index) {
      this.activeWindow == index
        ? (this.activeWindow = -1)
        : (this.activeWindow = index);
      this.activeSpot == index
        ? (this.activeSpot = -1)
        : (this.activeSpot = index);
      this.x = this._x;
      this.y = this._y;
      console.log(this.spotList);
      console.log(this.spotList[index]);
      return;
      if (index < 12) {
        this.x = -1400;
        this.y = -900;
      } else if (index < 15 && index > 11) {
        this.x = -300;
        this.y = -1900;
      } else if (index == 15) {
        this.x = -1199;
        this.y = -247;
      } else if (index > 15 && index <= 33) {
        this.x = -176;
        this.y = -455;
      } else if (index > 33 && index <= 40) {
        this.x = -307;
        this.y = -138;
      } else if (index > 40 && index <= 51) {
        this.x = -485;
        this.y = -276;
      } else if (index > 51 && index <= 59) {
        this.x = -590;
        this.y = -676;
      } else if (index > 59 && index <= 66) {
        this.x = -772;
        this.y = -739;
      } else if (index > 66 && index <= 73) {
        this.x = -1022;
        this.y = -384;
      } else if (index > 73 && index <= 81) {
        this.x = -1199;
        this.y = -247;
      } else if (index == 82) {
        this.x = -176;
        this.y = -455;
      }
    },
    locate(point1, point2) {
      function rad(d) {
        return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
      }
      let radLat1 = rad(point1.lat);
      let radLat2 = rad(point2.lat);
      let a = radLat1 - radLat2;
      let b = rad(point1.lng) - rad(point2.lng);
      let s =
        2 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) *
                Math.cos(radLat2) *
                Math.pow(Math.sin(b / 2), 2)
          )
        );
      s = s * 6378.137;
      // EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000;
      // console.log(s)
      return s;
    },
    getSpot() {
      const self = this;
      const storageData = wx.getStorageSync("NatureList");
      let processData = data => {
        this.markers = data.map((item, index) => {
          // console.log(index);
          return {
            id: index,
            title: item.spot_title,
            longitude: item.longitude,
            latitude: item.latitude,
            // callout: {
            //   content: item.spot_title
            // },
            label: {
              content: item.spot_name
            }
          };
        });
      };
      if (storageData) {
        processData(storageData);
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
          let data = res.data.data;
          this.setStorage("NatureList", data);
          processData(data);
        },
        fail: () => {},
        complete: () => {}
      });
    }
  },
  created() {
    console.log("create");
    this.getSpot();
  },
  mounted() {},
  onReady() {
    this.x = -1400;
    this.y = -900;
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
#mid {
  width: 10px;
  height: 10px;
  background: red;
  position: absolute;
  top: 1000rpx;
  left: 430rpx;
  z-index: 99999;
}
.container {
  width: 100%;
  position: relative;
  z-index: 2;
  margin-top: 20rpx;
}
.map-tab {
  height: 150rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #d5aa80;
  z-index: 99;
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
  width: auto;
  height: auto;
  background: #d1a77f;
  .mapImg {
    width: 3753rpx;
    height: 3753rpx;
  }
}
.spot-window {
  position: absolute;
  z-index: 999;
  width: 248rpx;
  height: 248rpx;
  border: 6rpx solid #bc8d5d;
  // background: #00baea;
  background: url("https://gw.alicdn.com/tfs/TB1Mxiei4TpK1RjSZR0XXbEwXXa-248-248.png")
    no-repeat center/cover;
  border-radius: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  &-text {
    font-size: 26rpx;
    color: #fff;
    line-height: 90rpx;
  }
  &-img {
    width: 220rpx;
    height: 144rpx;
    border-radius: 24rpx;
  }
}
.active-spot {
  width: 40rpx;
  height: 30rpx;
  margin: auto;
}
.spot-icon {
  width: 36rpx;
  height: 36rpx;
  line-height: 36rpx;
  background: yellow;
  position: absolute;
  z-index: 888;
  text-align: center;
  color: #292770;
  font-size: 28rpx;
  border-radius: 50%;
  border: 1px solid #a8368e;
  // border:1px solid yellow;
}
.changeBG {
  background: #a8368e;
  color: #fff;
  border: yellow;
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
    width: 100rpx;
    height: 110rpx;
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
.spot-item-window {
  width: 522rpx;
  height: 176rpx;
  border-bottom: 1px solid #c7c7c7;
  background: url("https://gw.alicdn.com/tfs/TB1PHRpnCzqK1RjSZPxXXc4tVXa-1809-607.png")
    no-repeat center/contain;
  position: absolute;
  bottom: 60rpx;
  left: -90rpx;
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
</style>
