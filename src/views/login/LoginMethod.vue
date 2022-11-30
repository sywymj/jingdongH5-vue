<template>
  <div class="wrapper">
    <img
      class="wrapper__img"
      src="https://images.gaoshiyi.top/static/user.png"
      alt="图片加载失败"
    />
    <div class="wrapper__login-button" @click="handleWeChatLogin">
      微信授权登录
    </div>
    <div class="wrapper__login-button" @click="handleUsernameLogin">
      账号密码登录
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

// 处理跳转逻辑
const usernameLoginEffect = () => {
  const router = useRouter();

  const handleUsernameLogin = () => {
    router.push({ name: "Login" });
  };

  const handleWeChatLogin = () => {
    router.push({ name: "WechatLogin" });
  };

  return { handleUsernameLogin, handleWeChatLogin };
};

export default {
  name: "LoginMethod",
  setup() {
    const { handleUsernameLogin, handleWeChatLogin } = usernameLoginEffect();

    return {
      handleWeChatLogin,
      handleUsernameLogin,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/variables.scss";
.wrapper {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  &__img {
    display: block;
    margin: 0 auto 0.4rem auto;
    width: 0.66rem;
    height: 0.66rem;
  }
  &__input {
    height: 0.48rem;
    margin: 0 0.4rem 0.16rem 0.4rem;
    padding: 0 0.16rem;
    background: #f9f9f9;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 6px;

    &__content {
      margin-top: 0.12rem;
      line-height: 0.22rem;
      border: none;
      outline: none;
      width: 100%;
      background: none;
      font-size: 0.16rem;
      color: $content-notice-fontcolor;
      &::placeholder {
        color: $content-notice-fontcolor;
      }
    }
  }
  &__login-button {
    margin: 0.32rem 0.4rem 0.16rem 0.4rem;
    line-height: 0.48rem;
    background: #0091ff;
    box-shadow: 0 0.04rem 0.08rem 0 rgba(0, 145, 255, 0.32);
    border-radius: 0.04rem;
    color: #fff;
    font-size: 0.16rem;
    text-align: center;
  }
  &__login-link {
    text-align: center;
    font-size: 0.14rem;
    color: $content-notice-fontcolor;
  }
}
</style>
