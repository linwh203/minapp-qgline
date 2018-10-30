<template>
  <div class="container">
    <div class="section">
      <textarea auto-height placeholder="请输入遇到的问题与建议..." v-model="text"/>
    </div>
    <div class="section imgList" v-if="imgList.length>0">
      <div class="img-item" v-for="(item,index) in imgList" :key="index">
        <img :src="item" >
      </div>
    </div>
    <div class="section flex" v-if="imgList.length<9">
      <img src="../../assets/icon-my-suggest.png" class="upload" @click="upload">
      <div class="upload-text">上传照片</div>
    </div>
    <div class="contact">
       <input type="number" placeholder="留下联系方式，便于我们联系你" v-model="contact"/>
    </div>
    <div class="submit" @click="submit">
      确定提交
    </div>
  </div>
</template>

<script>
import {config} from '../../utils/index'
export default {
  data() {
    return {
      text:'',
      contact:'',
      imgList:[],
      tempFile:[],
      userCode:''
    };
  },

  components: {},

  methods: {
    upload() {
      wx.chooseImage({
        count: '9', //最多可以选择的图片张数,
        success: res => {
          console.log(res)
          this.imgList = res.tempFilePaths
          this.tempFile = res.tempFiles
        }, //返回图片的本地文件路径列表 tempFilePaths,
        fail: () => {},
        complete: () => {}
      });
    },
    submit() {
      if (!this.text) {
        wx.showToast({
          title: '请输入内容', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        return 
      }
      if (!this.contact) {
         wx.showToast({
          title: '请输入联系方式', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        return 
      }
      wx.request({
        url: config.base + 'my/suggest', //开发者服务器接口地址",
        data: {
          
          lineId: config.lineId,
          suggest: this.text,
          phone: this.contact,
          image_url_list: this.imgList
        }, //请求的参数",
        method: 'post',
        header: {
          token: this.userCode,
        },
        dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res.data)
          if (res.data.res_code == 0) {
            wx.showToast({
              title: '反馈成功', //提示的内容,
              icon: 'success', //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
          } else {
            wx.showToast({
              title: '反馈失败，请稍后再试', //提示的内容,
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
    this.userCode = wx.getStorageSync('userCode');
  },
  mounted() {
  }
};
</script>

<style scoped lang="less">
.container{
  background: #f3f3f3;
}
.section{
  background: #fff;
  padding:20rpx;
  min-height:160rpx;
  font-size:26rpx;
}
.upload{
  width: 140rpx;
  height: 140rpx;
  display: block;
  &-text{
    color:#909090;
    margin-left:20rpx;
  }
}
.imgList{
  display: flex;
  flex-wrap: wrap;
}
.img-item{
  margin-right:20rpx;
  margin-bottom:30rpx;
  border:1px solid #e9e9e9;
  img{
    width: 110rpx;
    height: 140rpx;
    display: block;
  }
}
.contact{
  margin-top: 24rpx;
  padding:20rpx;
  font-size:26rpx;
  background: #fff;
  border-top:1px solid #e0e0e0;
  border-bottom:1px solid #e0e0e0;
}
.submit{
  width: 700rpx;
  line-height: 90rpx;
  text-align: center;
  background: #53c6f7;
  border-radius: 30rpx;
  margin: 70rpx auto;
  color:#fff;
}
.flex{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom:1px solid #e0e0e0;
}

</style>
