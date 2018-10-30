<template>
  <movable-area class="container">
    <movable-view class="index-bg" direction="all" :x="x" :y="y" @change="startTouch">
      <img class="mapImg" src="../../assets/bg-map.png" alt="" >
      <img class="userIcon" id="usericon" src="../../assets/icon-avator.png" v-bind:style="{ top: userLat + 'rpx',left: userLng + 'rpx'}">
      <div class="spot" v-for="(item,index) in spotList" :key="item.sortNo">
        <div class="spot-icon" :class="'icon-'+item.sortNo" v-if="activeSpot == index" @click="showWindow(index)">
          <img class="active-spot" src="https://gw.alicdn.com/tfs/TB1aICmi6DpK1RjSZFrXXa78VXa-30-24.png" />
        </div>
        <div class="spot-icon" :class="'icon-'+item.sortNo" v-else @click="showWindow(index)">{{item.sortNo}}</div>
        <div class="spot-window" :class="'window-'+item.sortNo" v-if="activeWindow == index" @click="viewDetail(item)">
          <div class="spot-window-text">{{item.spot_name}}</div>
          <img class="spot-window-img" :src="'http://39.106.120.41:8499'+item.spot_image" />
        </div>
      </div>
    </movable-view>
    <div class="map-sub">
      <div class="map-sub-line"></div>
      <div class="map-sub-btn">
        <div class="map-sub-btn-in" @click="locate">
          <img src="../../assets/icon-map-gps.png" alt="" class="btn-show">
        </div>
      </div>
      <div class="map-sub-line"></div>
      <div class="map-sub-btn">
        <div class="map-sub-btn-in " @click="bindTab('../paint/main')">
          <img src="../../assets/icon-map-pic.png" alt="" class="btn-audio" >
        </div>
      </div>
    </div>
    <div class="map-tab">
      <div class="map-tab-item icon-list" @click="bindTab('../index/main')">
        <img src="../../assets/icon-index-list.png" alt="">
      </div>
      <div class="map-tab-item icon-map" @click="bindTab('../map/main')">
        <img src="../../assets/icon-index-map.png" alt="">
      </div>
      <div class="map-tab-item icon-scan" @click="bindTab('../scan/main')">
        <img src="../../assets/icon-index-scan.png" alt="">
      </div>
      <div class="map-tab-item icon-quiz" @click="bindTab('../quiz/main')">
        <img src="../../assets/icon-index-quiz.png" alt="">
      </div>
      <div class="map-tab-item icon-my" @click="bindTab('../my/main')">
        <img src="../../assets/icon-index-my.png" alt="">
      </div>
    </div>
  </movable-area>
</template>

<script>
export default {
  data() {
    return {
      spotList:[],
      userLng:600,
      userLat:1000,
      activeSpot:0,
      activeWindow:-1,
      
      x:0,
      y:0, 
      mapStart:{
        lng:114.49358,
        lat:22.61034
      },
      mapEnd:{
        lng:114.50023,
        lat:22.59959
      }
    };
  },
  computed: {
  },

  components: {},

  methods: {
    bindTab(url) {
      wx.navigateTo({ url: url });
    },
    viewDetail(item) {
      console.log(item)
      const spotId = item.spot_id
      const spot_index = item.sortNo
      wx.navigateTo({ url: '../list/main?spot_id=' + spotId + '&spot_index=' + spot_index + '&from=map'});
    },
    showWindow(index) {
      this.activeWindow == index ? this.activeWindow = -1 : this.activeWindow = index;
      this.activeSpot = index ? this.activeSpot = -1 : this.activeSpot = index;
    },
    locate(point1,point2) {
      function rad(d){
        return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
      }
      let radLat1 = rad(point1.lat);
      let radLat2 = rad(point2.lat);
      let a = radLat1 - radLat2;
      let b = rad(point1.lng) - rad(point2.lng);
      let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137;
      // EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000;
      console.log(s)
      return {
        s
      }
    },
    startTouch() {
      
    }
  },

  created() {
    this.spotList = wx.getStorageSync('spotList');
    wx.getLocation({
      type: 'wgs84', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标,
      success: res => {
        console.info("getLocation success: ", res);
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy

        this.userLng = 450
        this.userLat = 720
      },
      fail: () => {
        console.log("getLocation failed")
      }
    });
  },
  mounted() {
   this.locate(this.mapStart,this.mapEnd)
  },
  onReady() {
    this.x = -100
    this.y = -200
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
#mid{
  width: 10px;
  height: 10px;
  background: red;
  position: absolute;
  top: 1000rpx;
  left:430rpx;
  z-index: 99999;
}
.container {
  width: 100%;
  position: relative;
  z-index:2;
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
  padding-bottom:138rpx;
  background: #d1a77f;
  position: relative;
  .mapImg{
    // width: 1560rpx;
    // height: 2640rpx;
    width: 1180rpx;
    height: 2000rpx;
  }
  .userIcon{
    width: 80rpx;
    height: 120rpx;
    position:absolute;
  }
}
.spot-window{
  position: absolute;
  z-index:999;
  width: 248rpx;
  height: 248rpx;
  border: 6rpx solid #bc8d5d;
  // background: #00baea;
  background: url('https://gw.alicdn.com/tfs/TB1Mxiei4TpK1RjSZR0XXbEwXXa-248-248.png') no-repeat center/cover;
  border-radius: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  &-text{
    font-size: 26rpx;
    color:#fff;
    line-height: 90rpx;
  }
  &-img{
    width: 220rpx;
    height: 144rpx;
    border-radius: 24rpx;
  }
}
.active-spot{
  width: 40rpx;
  height: 30rpx;
  margin:auto;
}
.spot-icon{
  width: 60rpx;
  height: 46rpx;
  line-height: 40rpx;
  background: url('https://gw.alicdn.com/tfs/TB1dOumi4TpK1RjSZFMXXbG_VXa-64-46.png') no-repeat center/cover;
  position: absolute;
  z-index: 888;
  text-align: center;
  color:#fff;
  font-size:30rpx;
}
.icon-five{
  left:810rpx;
  top:880rpx;
}
.icon-1{
  left:500rpx;
  top:770rpx;
}
.window-1{
  left: 412rpx;
  top: 500rpx;
}
.icon-2{
  left:510rpx;
  top:620rpx;
}
.window-2{
  left: 412rpx;
  top: 350rpx;
}
.icon-3{
  left:525rpx;
  top:500rpx;
}
.window-3{
  left: 412rpx;
  top: 230rpx;
}
.icon-4{
  left:830rpx;
  top:480rpx;
}
.window-4{
  left: 730rpx;
  top: 210rpx;
}
.icon-5{
  left:806rpx;
  top:870rpx;
}
.window-5{
  left: 700rpx;
  top: 600rpx;
}
.icon-6{
  left:790rpx;
  top:1100rpx;
}
.window-6{
  left: 690rpx;
  top: 830rpx;
}
.icon-7{
  left:670rpx;
  top:1430rpx;
}
.window-7{
  left: 580rpx;
  top: 1160rpx;
}
.icon-8{
  left:870rpx;
  top:1690rpx;
}
.window-8{
  left: 770rpx;
  top: 1410rpx;
}
.icon-9{
  left:510rpx;
  top:1480rpx;
}
.window-9{
  left: 410rpx;
  top: 1200rpx;
}
.icon-10{
  left:400rpx;
  top:1140rpx;
}
.window-10{
  left: 300rpx;
  top: 870rpx;
}
.map-sub {
  position: fixed;
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
    height: 30rpx;
  }
  .btn-audio {
    width: 34rpx;
    height: 28rpx;
  }
}
</style>
