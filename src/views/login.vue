<template>
  <div class="login">
    <div class="login-left"></div>
    <div class="login-right">
      <div class="topPic"></div>
      <div class="login-nav">
        <span class="nav-span" :class="{'active':loginFlag==true,'unactive':loginFlag==false}" @click="choose('login')">登录</span>
        <span class="nav-span" :class="{'unactive':loginFlag==true,'active':loginFlag==false}" @click="choose('regiest')">注册</span>
      </div>
      <!-- 登录 -->
      <div class="common-cantainer" v-show="loginFlag==true">
        <div class="common-input">
          <label class="l-label">用户名：</label>
          <input @focus="focusFn($event)" class="l-input" placeholder="请输入用户名" type="text" v-model="loginUsername"/>
        </div>
        <div class="common-input">
          <label class="l-label">密码：</label>
          <input @keyup.enter="goLogin" @focus="focusFn($event)" class="l-input" placeholder="请输入密码" type="password" v-model="loginPassword"/>
        </div>
        <div class="rem-password">
          <el-checkbox v-model="remPassword">记住密码</el-checkbox>
          <!-- 忘记密码功能隐藏 -->
          <!-- <span class="span2">忘记密码？</span> -->
        </div>
        <div class="common-input">
          <div class="common-button"  @click="goLogin">登录</div>
        </div>
      </div>
      <!-- 注册 -->
      <div class="common-cantainer" v-show="loginFlag==false">
        <div class="common-input">
          <label class="l-label">用户名：</label>
          <input @focus="focusFn($event)" class="l-input" placeholder="请输入用户名" type="text" v-model="registorUsername"/>
          <div class="error">{{checkRegistorUsername}}</div>
        </div>
        <div class="common-input">
          <label class="l-label">密码：</label>
          <input @focus="focusFn($event)" class="l-input" placeholder="请输入密码" type="password" v-model="registorPassword"/>
          <div class="error">{{checkRegistorPassword}}</div>
        </div>
        <div class="common-input">
          <input @keyup.enter="goRegistor" class="l-yzm" placeholder="请输入验证码" type="text" v-model="registorYzm"/>
          <img  @click="getYzm" class="yzm" />
        </div>
        <div class="common-input">
          <div class="common-button" @click="goRegistor">注册</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { imgCheck, login, register, loginStatus } from '@/api/api'
import { Message } from 'element-ui'
export default {
  data () {
    return {
      loginFlag: true,
      loginUsername: localStorage.getItem('prs_web_username'),
      loginPassword: localStorage.getItem('prs_web_userpassword'),
      registorUsername: '',
      registorPassword: '',
      registorYzm: '',
      checkRegistorUsername: '',
      checkRegistorPassword: '',
      remPassword: true
    }
  },
  watch: {
    // 监控注册用户名，并进行格式校验
    registorUsername: function (newValue, oldValue) {
      let reg = /^[0-9a-zA-Z\u4e00-\u9fa5_]+$/ig
      this.checkRegistorUsername = reg.test(newValue) ? '' : '格式要求: 中文、数字、英文，可包含“_”'
    },
    // 监控注册密码，并进行格式校验
    registorPassword: function (newValue, oldValue) {
      let reg = /^[0-9a-zA-Z_]{5,16}$/
      this.checkRegistorPassword = reg.test(newValue) ? '' : '格式要求: 数字、英文，可包含“_”, 长度5-16个字符'
    }
  },
  methods: {
    // 选择登录/注册
    choose (type) {
      if (type === 'login') {
        [this.loginFlag, this.registorUsername, this.registorPassword, this.registorYzm, this.checkRegistorUsername, this.checkRegistorPassword] = [true, '', '', '', '', '']
      } else {
        [this.loginFlag, this.loginUsername, this.loginPassword] = [false, '', '']
        this.getYzm()
      }
    },
    // 输入框focus事件,dom操作
    focusFn (ev) {
      ev.target.parentElement.style.transition = '0.3s linear'
      ev.target.parentElement.style.height = '66px'
      ev.target.previousElementSibling.style.opacity = '1'
    },
    // 登录
    async goLogin () {
      // 记住密码
      if (this.remPassword) {
        // 勾选记住密码功能，将用户名密码存储在本地存储中
        localStorage.setItem('prs_web_username', this.loginUsername)
        localStorage.setItem('prs_web_userpassword', this.loginPassword)
      } else {
        localStorage.setItem('prs_web_username', '')
        localStorage.setItem('prs_web_userpassword', '')
      }
      // 登录接口
      let res = await login({
        username: this.loginUsername,
        password: this.loginPassword
      })
      if (res.code === 1) {
        // 登录成功跳转
        this.$router.push('/home')
      } else {
        // 登录失败提示
        Message({
          message: res.message,
          type: 'warning'
        })
      }
    },
    // 注册
    async goRegistor () {
      // 请求接口前，检查有无格式错误或必填项缺失
      let result = (this.checkRegistorUsername !== '' || this.checkRegistorPassword !== '') || this.registorYzm === ''
      if (result) {
        Message({
          message: '请检查用户名、密码或验证码',
          type: 'warning'
        })
        return
      }
      let res = await register({
        username: this.registorUsername,
        password: this.registorPassword,
        idencode: this.registorYzm
      })
      if (res.code === 1) {
        // 注册成功，提示消息，并切换到登录模式
        Message({
          message: `${res.message} [用户名: ${this.registorUsername}]`,
          type: 'success',
          duration: 3500
        })
        this.choose('login')
      } else {
        // 注册失败，提示消息，并重新请求验证码
        Message({
          message: res.message,
          type: 'warning'
        })
        this.getYzm()
      }
    },
    // 获取验证码
    async getYzm () {
      let res = await imgCheck()
      document.getElementsByClassName('yzm')[0].src = 'data:image/png;base64,' + res
    },
    // 检查登录状态
    async checkLoginStatus () {
      let res = await loginStatus()
      if (res.code === 1) {
        // 已登录跳转首页
        this.$router.push('/home')
      }
    }
  },
  mounted () {
    this.checkLoginStatus()
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/css/login.less';
</style>
