<template>
<div class="mainContainer">
  <div class="container" v-if="!showCountdown">
    <div class="quiz-top">
      <div class="quiz-top-mid">挑战 第{{index+1}}/5关</div>
    </div>
    <div class="user">
      <open-data type="userAvatarUrl" class="userPic"></open-data>
      <open-data type="userNickName" class="userName"></open-data>
    </div>
    <div class="quiz-status">已连续答对 {{rightCount}}/5题</div>
    <div class="quiz-title" v-if="!quizSuccess && !quizFail">{{currentQuiz.title}}</div>
    <div class="quiz-choice" v-if="!quizSuccess && !quizFail">
      <div class="quiz-choice-body" v-if="currentQuiz.answer_list.length>0">
        <div class="quiz-choice-body-item" 
            :class="[showRight == 0?'rightAnswer':'',showWrong == 0?'wrongAnswer':'']" 
            @click="chooseItem(0,currentQuiz.answer_list[0])">
          <span class="quiz-choice-body-item-icon right" v-if="showRight == 0"></span>
          <span class="quiz-choice-body-item-icon wrong" v-if="showWrong == 0"></span>
          <span class="quiz-choice-body-item-text">{{currentQuiz.answer_list[0].answer}}</span> 
        </div>
        <div class="quiz-choice-body-item" 
            :class="[showRight == 1?'rightAnswer':'',showWrong == 1?'wrongAnswer':'']" 
            @click="chooseItem(1,currentQuiz.answer_list[1])">
          <span class="quiz-choice-body-item-icon right" v-if="showRight == 1"></span>
          <span class="quiz-choice-body-item-icon wrong" v-if="showWrong == 1"></span>
          <span class="quiz-choice-body-item-text">{{currentQuiz.answer_list[1].answer}}</span> 
        </div>
        <div class="quiz-choice-body-item" 
            :class="[showRight == 2?'rightAnswer':'',showWrong == 2?'wrongAnswer':'']" 
            @click="chooseItem(2,currentQuiz.answer_list[2])">
          <span class="quiz-choice-body-item-icon right" v-if="showRight == 2"></span>
          <span class="quiz-choice-body-item-icon wrong" v-if="showWrong == 2"></span>
          <span class="quiz-choice-body-item-text">{{currentQuiz.answer_list[2].answer}} </span> 
        </div>
        <div class="quiz-choice-body-item" 
            :class="[showRight == 3?'rightAnswer':'',showWrong == 3?'wrongAnswer':'']" 
            @click="chooseItem(3,currentQuiz.answer_list[3])">
          <span class="quiz-choice-body-item-icon right" v-if="showRight == 3"></span>
          <span class="quiz-choice-body-item-icon wrong" v-if="showWrong == 3"></span>
          <span class="quiz-choice-body-item-text">{{currentQuiz.answer_list[3].answer}}</span> 
        </div>
      </div>
    </div>
    <div class="quiz-success" v-if="quizSuccess">
      <img class="resultIcon" src="https://gw.alicdn.com/tfs/TB1iq1VnMTqK1RjSZPhXXXfOFXa-328-251.png">
      <div class="quiz-result">
        <img class="coin" src="https://gw.alicdn.com/tfs/TB1fLeZnQvoK1RjSZFwXXciCFXa-43-44.png">  
        <span>+ 100</span>
      </div> 
       <div class="result-line"></div> 
       <div class="quiz-result-btn-top">继续挑战</div>
       <div class="quiz-result-btn-btm">查看成就</div>
    </div>
    <div class="quiz-fail" v-if="quizFail">
      <img class="resultIcon" src="https://gw.alicdn.com/tfs/TB1Lg9UnHPpK1RjSZFFXXa5PpXa-328-251.png">
      <div class="quiz-result">
        <img class="coin" src="https://gw.alicdn.com/tfs/TB1fLeZnQvoK1RjSZFwXXciCFXa-43-44.png">  
        <span>+ 0</span>
      </div>
      <div class="result-line"></div> 
      <div class="quiz-result-btn-top">再来一局</div>
      <div class="quiz-result-btn-btm">分享知识获取机会</div>
      <div class="quiz-result-tip">分享知识给微信好友群可获得1次挑战机会</div>
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
  <div class="countdown" v-if="showCountdown">
    <div class="user">
      <open-data type="userAvatarUrl" class="userPic"></open-data>
      <open-data type="userNickName" class="userName"></open-data>
    </div>
    <div class="text">
      <span class="text-icon"></span>即将开始<span class="text-icon"></span>
    </div>
    <div class="count">
      {{countNumber}}
    </div>
  </div>
</div>
</template>

<script>
import { config } from "../../utils/index";
export default {
  data() {
    return {
      failMsg:'https://gw.alicdn.com/tfs/TB1RLqUnFzqK1RjSZFvXXcB7VXa-460-700.png',
      failMsgNoChance:'https://gw.alicdn.com/tfs/TB1tIq0nQvoK1RjSZFDXXXY3pXa-460-700.png',
      failMsgBtn:'https://gw.alicdn.com/tfs/TB1Rn9UnHvpK1RjSZPiXXbmwXXa-340-80.png',
      countNumber:3,
      showCountdown:false,
      rightCount:0,
      showRight:-1,
      showWrong:-1,
      quizSuccess:false,
      quizFail:false,
      prefix:config.prefix,
      userCode: "",
      index: 0,
      showHint: false,
      isPlayAudio: false,
      choiceIndex: -1,
      currentQuiz: {
        // id: null,
        // title: null,
        // type: null,
        // tooltip: null,
        // quiz: null,
        // answer_list: [],
        // right_answer: null,
        // is_right: null
        id: null,
        title: '1.大陆河边有什么鸟',
        type: null,
        tooltip: null,
        quiz: null,
        answer_list: [{answer:'鸽子'},{answer:'鹭鸟'},{answer:'麻雀'},{answer:'丹顶鹤'}],
        right_answer: 1,
        is_right: null
      },
      wrongAnswer: false,
      showAnswer: false,
      showFinish: false,
      showLarge: false,
      innerAudioContext: null,
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
    rightAnswer(){
      return this.currentQuiz.right_answer
    }
  },
  components: {},

  methods: {
    bindTab(url) {
      wx.redirectTo({ url: url });
    },
    chooseItem(index, item) {
      this.choiceIndex = index;
      if(this.choiceIndex == this.rightAnswer){
        this.showRight = this.choiceIndex
        this.showWrong = -1
      } else {
        this.showRight = this.rightAnswer
        this.showWrong = this.choiceIndex
      }
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
    // this.currentQuiz = this.questionList[0];
  },
  mounted() {
    // this.getList()
  },
  onLoad(option) {
    console.log(option.checkpoint);
    this.checkpoint = option.checkpoint;
  },
  onShow(option) {
    this.userCode = wx.getStorageSync("userCode");
    this.getList()

    setInterval(()=>{
      if(this.countNumber > 0){
        this.countNumber-- 
      } else {
        this.showCountdown = false
        return
      } 
    },1000)
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
.mainContainer{
  width: 100%;
  height: 100%;
}
.container {
  position: relative;
  width: 100%;
  height: 100%;
  background: url("https://gw.alicdn.com/tfs/TB1ASuUnMHqK1RjSZJnXXbNLpXa-640-1084.png")
    no-repeat top/100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
}
.quiz-status{
  margin-top: 30rpx;
  margin-bottom: 50rpx;
  padding:5rpx 25rpx;
  border-radius: 25rpx;
  font-size: 24rpx;
  background: rgba(0, 0, 0, 0.4)
}
.quiz-title{
  font-size: 36rpx;
}
.quiz-top {
  width: 100%;
  display: flex;
  justify-content:center;
  margin-top: 28rpx;
  color:#292770;
  &-mid {
    width: 600rpx;
    height: 64rpx;
    line-height: 64rpx;
    text-align: center;
    font-size: 30rpx;
    background: url('https://gw.alicdn.com/tfs/TB1IMx.n7voK1RjSZFNXXcxMVXa-599-60.png') no-repeat top/contain;
  }
}
.quiz-choice {
  margin-top: 60rpx;
  width: 380rpx;
  &-body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    color:#292770;
    &-item {
      width: 100%;
      height: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 36rpx;
      background: #fff;
      border-radius: 20rpx;
      margin-bottom: 40rpx;
      position: relative;
      &-icon {
        width: 35rpx;
        height: 23rpx;
        display: block;
        position: absolute;
        left: 30rpx;
        top: 30rpx;
      }
      &-icon.right{
        background: url("https://gw.alicdn.com/tfs/TB1_2ORnRLoK1RjSZFuXXXn0XXa-36-25.png") no-repeat top/cover;
      }
      &-icon.wrong{
        top: 24rpx;
        height: 34rpx;
        background: url("https://gw.alicdn.com/tfs/TB1c4eWnHrpK1RjSZTEXXcWAVXa-30-29.png") no-repeat top/cover;
      }
    }
    &-item.rightAnswer{
      background: #6998cc;
      color:#fff;
    }
    &-item.wrongAnswer{
      background: #a8368e;
      color:#fff;
    }
    &-item:nth-last-of-type(1) {
      border-bottom: none;
    }
  }
}
.quiz-success,.quiz-fail{
  display: flex;flex-direction: column;align-items: center;
}
.resultIcon{
  width: 328rpx;
  height: 251rpx;
}
.quiz-result{
  display: flex;justify-content: center;align-items: center;
  color:#fff;font-size: 40rpx;
  span{
    margin:0 12rpx;
  }
  &-tip{
    font-size: 24rpx;
  }
}
.coin{
  width: 44rpx;
  height: 44rpx;
}
.result-line{
  margin: 20rpx 0 40rpx;
  width: 600rpx;
  height: 4rpx;
  background: url('https://gw.alicdn.com/tfs/TB1IMx.n7voK1RjSZFNXXcxMVXa-599-60.png') no-repeat top/cover;
}
.quiz-result-btn-top{
  color:#292770;
  width: 380rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 36rpx;
  background: #fff;
  border-radius: 20rpx;
  margin-bottom: 40rpx;
}
.quiz-result-btn-btm{
  color:#fff;
  width: 380rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 36rpx;
  background: #ff0000;
  border-radius: 20rpx;
  margin-bottom: 40rpx;
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
.countdown{
  width: 100%;
  height: 100%;
  position: relative;
  padding:20rpx;
  background: url('https://gw.alicdn.com/tfs/TB1.nJ1nVzqK1RjSZFvXXcB7VXa-640-1008.png') no-repeat top/cover;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.text{
  margin-top: 50rpx;
  color:#fcff04;
  font-size: 36rpx;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  &-icon{
    width: 150rpx;
    height: 34rpx;
    display: block;
    background: url('https://gw.alicdn.com/tfs/TB1VLiZnNTpK1RjSZFMXXbG_VXa-96-21.png') no-repeat top/cover;
    margin: 0 20rpx 0 0;
  }
  &-icon:nth-of-type(2){
    margin: 0 0 0 20rpx;
    transform:rotate(180deg)
  }
}
.count{
  margin-top: 80rpx;
  width: 320rpx;
  height: 320rpx;
  line-height: 320rpx;
  text-align: center;
  color:#fff;
  font-size: 180rpx;
  background: url('https://gw.alicdn.com/tfs/TB1L2OWnQvoK1RjSZPfXXXPKFXa-292-292.png') no-repeat top/cover;
}
.user{
  margin-top: 44rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.userPic{
  width: 146rpx;
  height: 146rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 4rpx solid #fff;
  margin-bottom: 10rpx;
}
.userName{
  color:#fff;
  font-size: 30rpx;
}
</style>
