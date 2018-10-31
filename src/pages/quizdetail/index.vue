<template>
  <div class="container">
    <div class="quiz-top">
      <div class="quiz-top-left" @click="prev"></div>
      <div class="quiz-top-mid">{{index+1}}</div>
      <div class="quiz-top-right" @click="next"></div>
    </div>
    <div class="quiz-mid">
      <div class="quiz-mid-question">
        <div class="quiz-mid-question-body">
          <div class="quiz-mid-question-body-text">{{currentQuiz.title}}</div>
          <img class="quiz-mid-question-body-play" src="https://gw.alicdn.com/tfs/TB1.aY2j9zqK1RjSZPxXXc4tVXa-69-70.png" v-if="hasAudio && !isPlayAudio" @click="startAudio" />
          <img class="quiz-mid-question-body-pause" src="https://gw.alicdn.com/tfs/TB163v1j9rqK1RjSZK9XXXyypXa-69-70.png" v-if="hasAudio && isPlayAudio" @click="pauseAudio" />
        </div>
      </div>
      <div class="quiz-mid-msg">从下面选出正确的答案</div>
      <div class="quiz-mid-hint" @click="lookHint">
        <span></span> 提示
      </div>
    </div>
    <div class="quiz-choice">
      <div class="image-choice" v-if="imageType">
        <div class="image-choice-item">
          <img :src="prefix+currentQuiz.answer_list[0].image" @click="showLargeImg(currentQuiz.answer_list[0].image_big)">
          <div class="image-choose"  @click="chooseItem(0,currentQuiz.answer_list[0])">
            <img src="https://gw.alicdn.com/tfs/TB1_3MDj9zqK1RjSZFHXXb3CpXa-46-38.png" v-if="choiceIndex == 0">
          </div>
        </div>
        <div class="image-choice-item">
          <img :src="prefix+currentQuiz.answer_list[1].image" @click="showLargeImg(currentQuiz.answer_list[1].image_big)">
          <div class="image-choose"  @click="chooseItem(1,currentQuiz.answer_list[1])">
            <img src="https://gw.alicdn.com/tfs/TB1_3MDj9zqK1RjSZFHXXb3CpXa-46-38.png" v-if="choiceIndex == 1">
          </div>
        </div>
        <div class="image-choice-item">
          <img :src="prefix+currentQuiz.answer_list[2].image" @click="showLargeImg(currentQuiz.answer_list[2].image_big)">
          <div class="image-choose"  @click="chooseItem(2,currentQuiz.answer_list[2])">
            <img src="https://gw.alicdn.com/tfs/TB1_3MDj9zqK1RjSZFHXXb3CpXa-46-38.png" v-if="choiceIndex == 2">
          </div>
        </div>
        <div class="image-choice-item">
          <img :src="prefix+currentQuiz.answer_list[3].image" @click="showLargeImg(currentQuiz.answer_list[3].image_big)">
          <div class="image-choose"  @click="chooseItem(3,currentQuiz.answer_list[3])">
            <img src="https://gw.alicdn.com/tfs/TB1_3MDj9zqK1RjSZFHXXb3CpXa-46-38.png" v-if="choiceIndex == 3">
          </div>
        </div>
      </div>
      <div class="quiz-choice-body" v-if="!imageType&&currentQuiz.answer_list.length>0">
        <div class="quiz-choice-body-item" @click="chooseItem(0,currentQuiz.answer_list[0])">
          <span class="quiz-choice-body-item-text"><span class="quiz-choice-body-item-icon" v-if="choiceIndex == 0"></span>{{currentQuiz.answer_list[0].answer}}</span> 
        </div>
        <div class="quiz-choice-body-item" @click="chooseItem(1,currentQuiz.answer_list[1])">
          <span class="quiz-choice-body-item-text"><span class="quiz-choice-body-item-icon" v-if="choiceIndex == 1"></span>{{currentQuiz.answer_list[1].answer}}</span> 
        </div>
        <div class="quiz-choice-body-item" @click="chooseItem(2,currentQuiz.answer_list[2])">
          <span class="quiz-choice-body-item-text"><span class="quiz-choice-body-item-icon" v-if="choiceIndex == 2"></span>{{currentQuiz.answer_list[2].answer}}</span> 
        </div>
        <div class="quiz-choice-body-item" @click="chooseItem(3,currentQuiz.answer_list[3])">
          <span class="quiz-choice-body-item-text"><span class="quiz-choice-body-item-icon" v-if="choiceIndex == 3"></span>{{currentQuiz.answer_list[3].answer}}</span> 
        </div>
      </div>
    </div>
    <div class="quiz-btm" @click="submitAnswer">

    </div>
    <div class="modal" v-if="showHint || showAnswer || showFinish">
      <div class="modal-container">
        <div class="hint" v-if="showHint">
          <div class="hint-title">温馨提示</div>
          <div class="hint-text">
            {{currentQuiz.tooltip}}
          </div>
          <div class="hint-close" @click="closeHint">
            <img src="../../assets/btn-close-list.png" alt="">
          </div>
        </div>
        <div class="hint answer" v-if="showAnswer">
          <div class="answer-title">{{wrongAnswer?'再想想':'你真棒'}}</div>
          <div class="answer-text">
            {{wrongAnswer?'不是'+choiceName+'选错了!':'找对了,继续加油哦!'}}
          </div>
          <div class="answer-btn" @click=closeAnswer>
            {{wrongAnswer?'重新回答':'下一题'}}
          </div>
          <div class="hint-close" @click="closeAnswer">
            <img src="../../assets/btn-close-list.png" alt="">
          </div>
        </div>
        <div class="hint finish" v-if="showFinish">
          <div class="finish-title">恭喜你，闯关成功</div>
          <img src="../../assets/icon-reward.png" class="finish-icon">
          <div class="finish-text">获得:1个勋章</div>
          <div class="finish-btns">
            <div class="finish-btns-left" @click="bindTab('../quiz/main')">继续闯关</div>
            <div class="finish-btns-right" @click="bindTab('../my-reward/main')">查看成就</div>
          </div>
          <div class="hint-close" @click="bindTab('../quiz/main')">
            <img src="../../assets/btn-close-list.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="modal" v-if="showLarge">
      <div class="largeImg">
        <img :src="prefix+largeSrc">
        <div class="hint-close" @click="showLarge = false">
            <img src="../../assets/btn-close-list.png" alt="">
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
      prefix:config.prefix,
      userCode: "",
      index: 0,
      showHint: false,
      isPlayAudio: false,
      choiceIndex: -1,
      choiceName: "",
      largeSrc: "",
      currentQuiz: {
        id: null,
        title: null,
        type: null,
        tooltip: null,
        quiz: null,
        answer_list: [],
        right_answer: null,
        is_right: null
      },
      wrongAnswer: false,
      showAnswer: false,
      showFinish: false,
      showLarge: false,
      innerAudioContext: null,
      audioUrl:
        "http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46",
      questionList: [
        {
          // 题目id
          id: 1,
          // 标题
          title: "",
          // 题目类型,类型枚举:'文本选择 text','看图识别 image','声音识别 video',
          type: 1,
          // 问题的提示
          tooltip: "",
          // 问题正文,如果是'看图识别'和'声音识别'就应该是个url字符串
          quiz: "",
          // 答案列表,如果是'看图识别'就应该是个图片地址
          answer_list: ["A ", "B ", "C", "D "],
          // 正确答案的序号
          right_answer: -1,
          // 我是否答对
          is_right: false
        }
      ]
    };
  },
  computed: {
    hasAudio: function() {
      this.audioUrl = config.prefix + this.currentQuiz.quiz;
      // this.audioUrl = "http://www.ytmp3.cn/down/53825.mp3";
      this.innerAudioContext.src = this.audioUrl;
      return this.currentQuiz.type == 3 ? true : false;
    },
    imageType: function() {
      return this.currentQuiz.type == 2 ? true : false;
    }
  },
  components: {},

  methods: {
    bindTab(url) {
      wx.redirectTo({ url: url });
    },
    chooseItem(index, item) {
      this.choiceIndex = index;
      this.choiceName = item.answer || "噢,";
    },
    showLargeImg(image_big) {
      this.largeSrc = image_big;
      this.showLarge = true;
    },
    submitAnswer() {
      this.showAnswer = true;
      if (this.choiceIndex + 1 != this.currentQuiz.right_answer) {
        this.wrongAnswer = true;
      } else {
        this.requestAnswer(this.currentQuiz.id, this.choiceIndex + 1);
      }
    },
    requestAnswer(id, answernum) {
      if (answernum > 8) return;
      wx.request({
        url: config.base + "quiz/answer", //开发者服务器接口地址",
        data: {
          lineId: config.lineId,
          id: id,
          answer: answernum
        }, //请求的参数",
        header: {
          token: this.userCode
        },
        method: "POST",
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res.data);
        },
        fail: () => {},
        complete: () => {}
      });
    },
    lookHint() {
      this.showHint = true;
    },
    closeHint() {
      this.showHint = false;
    },
    closeAnswer() {
      this.isPlayAudio = false;
      this.innerAudioContext.stop();
      this.showAnswer = false;
      if (this.wrongAnswer) {
        this.wrongAnswer = false;
      } else {
        this.questionList[this.index].is_right = true;
        if (this.index == this.questionList.length - 1) {
          this.showFinish = true;
        } else {
          this.index += 1;
          this.choiceIndex = -1;
          this.choiceName = "";
          this.currentQuiz = this.questionList[this.index];
        }
      }
    },
    startAudio() {
      this.isPlayAudio = true;
      this.innerAudioContext.play();
    },
    pauseAudio() {
      this.isPlayAudio = false;
      this.innerAudioContext.pause();
    },
    prev() {
      if (this.index == 0) {
        return;
      } else {
        this.index--;
        this.currentQuiz = this.questionList[this.index];
        this.choiceIndex = this.currentQuiz.right_answer;
        this.isPlayAudio = false;
        this.innerAudioContext.stop();
      }
    },
    next() {
      if (this.index == this.questionList.length - 1) {
        return;
      } else {
        if (this.questionList[this.index].is_right) {
          this.index++;
          this.currentQuiz = this.questionList[this.index];
          this.questionList[this.index].is_right
            ? (this.choiceIndex = this.currentQuiz.right_answer)
            : (this.choiceIndex = -1);
          this.isPlayAudio = false;
          this.innerAudioContext.stop();
        } else {
          return;
        }
      }
    },
    login(code) {
      wx.request({
        url: config.base + 'wxlogin/login',
        data: {
          code: code,
          lineId: config.lineId
        }, 
        method: 'GET',
        dataType: 'json', 
        success: res => {
          // console.log('login',res.data.data)
          this.setStorage('userCode',res.data.data)
        },
        fail: err => {
          console.log('hasError',err)
        }
      });
    },
    getList() {
      function selectSort(arr) {
        var len = arr.length;
        for (let i = 0; i < len - 1; i++) {
          for (let j = i; j < len; j++) {
            if (arr[j].answernum < arr[i].answernum) {
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
          }
        }
        return arr;
      }
      const token = wx.getStorageSync("userCode");
      wx.request({
        url: config.base + "quiz/list", //开发者服务器接口地址",
        data: {
          lineId: config.lineId,
          token: token,
          checkpoint: this.checkpoint,
          newExtract: 0
        }, //请求的参数",
        method: "GET",
        dataType: "json", //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          if (res.data.res_code == 0) {
            this.questionList = res.data.data;
            if (this.questionList.length>0){
              this.questionList.forEach(item => {
                item.answer_list = selectSort(item.answer_list);
                this.currentQuiz = this.questionList[0];
              });
            }
          } else {
            wx.showToast({
              title: res.data.res_msg, 
              duration: 1000, 
              mask: true,
              success: res=>{
                
              }
            });
          }
        },
        fail: () => {},
        complete: () => {}
      });
    }
  },

  created() {
    this.currentQuiz = this.questionList[0];
    
  },
  mounted() {
    // this.getList()
  },
  onLoad(option) {
    console.log(option.checkpoint);
    this.checkpoint = option.checkpoint;
    this.innerAudioContext = wx.createInnerAudioContext();
  },
  onShow(option) {
    this.userCode = wx.getStorageSync("userCode");
    // this.innerAudioContext = wx.createInnerAudioContext();
    this.getList()
  },
  onHide() {
    this.index = 0;
    this.showHint = false;
    this.hasAudio = false;
    this.isPlayAudio = false;
    this.choiceIndex = -1;
    this.choiceName = "";
    this.currentQuiz = {
      id: null,
      title: null,
      type: null,
      tooltip: null,
      quiz: null,
      answer_list: [],
      right_answer: null,
      is_right: null
    };
    this.wrongAnswer = false;
    this.showAnswer = false;
    this.showFinish = false;
  },
  onUnload() {
    this.index = 0;
    this.showHint = false;
    this.hasAudio = false;
    this.isPlayAudio = false;
    this.choiceIndex = -1;
    this.choiceName = "";
    this.currentQuiz = {
      id: null,
      title: null,
      type: null,
      tooltip: null,
      quiz: null,
      answer_list: [],
      right_answer: null,
      is_right: null
    };
    this.wrongAnswer = false;
    this.showAnswer = false;
    this.showFinish = false;
  }
};
</script>

<style scoped lang="less">
.container {
  position: relative;
  width: 100%;
  height: 100%;
  background: url("https://gw.alicdn.com/tfs/TB1gKgDjSzqK1RjSZFjXXblCFXa-640-1008.jpg")
    no-repeat top/100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  color: #9e7044;
}
.quiz-top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 62rpx;
  &-left {
    width: 80rpx;
    height: 80rpx;
    background: url("https://gw.alicdn.com/tfs/TB1pKAAjPTpK1RjSZKPXXa3UpXa-72-74.png")
      no-repeat top/100% 100%;
    margin-left: 39rpx;
  }
  &-mid {
    width: 110rpx;
    height: 110rpx;
    line-height: 110rpx;
    text-align: center;
    font-size: 56rpx;
    background: url("https://gw.alicdn.com/tfs/TB1Cd3zjNTpK1RjSZFGXXcHqFXa-90-90.png")
      no-repeat top/100% 100%;
    margin-left: 14rpx;
    margin-top: 6rpx;
  }
  &-right {
    width: 80rpx;
    height: 80rpx;
    background: url("https://gw.alicdn.com/tfs/TB1.CowjSzqK1RjSZPxXXc4tVXa-72-74.png")
      no-repeat top/100% 100%;
    margin-right: 65rpx;
  }
}
.quiz-mid {
  position: absolute;
  top: 180rpx;
  left: 80rpx;
  &-question {
    width: 545rpx;
    height: 180rpx;
    padding: 50rpx 20rpx 20rpx;
    background: url("https://gw.alicdn.com/tfs/TB1_A.FjQPoK1RjSZKbXXX1IXXa-506-206.png")
      no-repeat top/100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    &-body {
      font-size: 30rpx;
      text-align: center;
      &-play {
        margin-top: 20rpx;
        width: 82rpx;
        height: 82rpx;
      }
      &-pause {
        margin-top: 20rpx;
        width: 82rpx;
        height: 82rpx;
      }
    }
  }
  &-hint {
    width: 105rpx;
    height: 48rpx;
    position: absolute;
    background: #2f83d0;
    right: -63rpx;
    bottom: -64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border-top-left-radius: 20rpx;
    border-bottom-left-radius: 20rpx;
    font-size: 24rpx;
    span {
      display: block;
      width: 26rpx;
      height: 35rpx;
      margin-right: 12rpx;
      background: url("https://gw.alicdn.com/tfs/TB1rGEDjPTpK1RjSZKPXXa3UpXa-26-35.png")
        no-repeat top/cover;
    }
  }
  &-msg {
    position: absolute;
    bottom: -56rpx;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    font-size: 24rpx;
  }
}
.quiz-choice {
  width: 540rpx;
  height: 326rpx;
  padding: 62rpx 44rpx;
  background: url("https://gw.alicdn.com/tfs/TB1rmQyjNTpK1RjSZR0XXbEwXXa-536-384.png")
    no-repeat top/cover;
  margin-top: 310rpx;
  &-body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    &-item {
      width: 100%;
      height: 25%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #9e7044;
      font-size: 28rpx;
      &-text {
        position: relative;
      }
      &-icon {
        width: 46rpx;
        height: 38rpx;
        display: block;
        background: url("https://gw.alicdn.com/tfs/TB1_3MDj9zqK1RjSZFHXXb3CpXa-46-38.png")
          no-repeat top/cover;
        position: absolute;
        left: -50rpx;
      }
    }
    &-item:nth-last-of-type(1) {
      border-bottom: none;
    }
  }
}
.quiz-btm {
  width: 348rpx;
  height: 118rpx;
  background: url("https://gw.alicdn.com/tfs/TB1KWMEjIfpK1RjSZFOXXa6nFXa-300-98.png")
    no-repeat top/cover;
  margin-bottom: 100rpx;
}
.image-choice {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  border-radius: 16rpx;
  overflow: hidden;
  &-item {
    border: 1px solid #9e7044;
    position: relative;
    img {
      width: 267rpx;
      height: 100%;
    }
  }
}
.image-choose {
  height: 54rpx;
  width: 52rpx;
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom-right-radius: 25rpx;
  img {
    width: 32rpx;
    height: 32rpx;
    display: block;
  }
}
.modal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &-container {
    position: absolute;
    top: 548rpx;
    width: 540rpx;
    height: 336rpx;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
  }
}
.hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  position: relative;
  &-title {
    color: #fff;
    text-align: center;
    height: 90rpx;
    line-height: 90rpx;
    background: #53c6f7;
    width: 100%;
  }
  &-text {
    color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-direction: column;
    height: 100%;
  }
  &-close {
    height: 54rpx;
    width: 52rpx;
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-bottom-left-radius: 25rpx;
    img {
      width: 32rpx;
      height: 32rpx;
      display: block;
    }
  }
}
.answer {
  color: #000;
  width: 100%;
  &-title {
    font-size: 40rpx;
    line-height: 130rpx;
  }
  &-text {
    width: 100%;
    font-size: 28rpx;
    text-align: center;
    padding-bottom: 60rpx;
    border-bottom: 1px solid #a0a0a0;
  }
  &-btn {
    color: #00baea;
    font-size: 36rpx;
    line-height: 90rpx;
  }
}
.finish {
  color: #000;
  font-size: 36rpx;
  &-title {
    line-height: 82rpx;
  }
  &-icon {
    width: 128rpx;
    height: 84rpx;
  }
  &-text {
    line-height: 64rpx;
    font-size: 24rpx;
  }
  &-btns {
    width: 100%;
    height: 105rpx;
    border-top: 1px solid #a0a0a0;
    display: flex;
    &-left {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 1px solid #a0a0a0;
      color: #00baea;
    }
    &-right {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ff1919;
    }
  }
}
.largeImg {
  width: 538rpx;
  height: 823rpx;
  border-radius: 12rpx;
  overflow: hidden;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
