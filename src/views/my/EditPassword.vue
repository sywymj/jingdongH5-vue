<template>
  <div class="wrapper">
    <div class="title">
      <div class="title__back iconfont" @click="handleBackClick">&#xe697;</div>
      <div class="title__content">
        <div class="title__content__info">修改密码</div>
      </div>
    </div>
    <div class="userInfo">
      <div class="userInfo__item">
        <div class="userInfo__item__title">旧密码：</div>
        <input
          type="password"
          placeholder="请输入旧密码,没有则不用填"
          v-model="oldPassword"
        />
      </div>
      <div class="userInfo__item">
        <div class="userInfo__item__title">新密码：</div>
        <input
          type="password"
          placeholder="6-18位数字,字母,下划线"
          v-model="password"
        />
      </div>
      <div class="userInfo__item">
        <div class="userInfo__item__title">重复密码：</div>
        <input
          type="password"
          placeholder="6-18位数字,字母,下划线"
          v-model="rePassword"
        />
      </div>
    </div>
    <div class="save" @click="handleSaveClick">保存</div>
    <Toast v-if="show" :message="toastMessage" />
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import request from "../../utils/request";
import Toast, { useToastEffect } from "../../components/Toast";

const useUserInfoEffect = (showToast) => {
  const router = useRouter();
  const handleBackClick = () => {
    router.back();
  };

  let data = reactive({
    oldPassword: "",
    password: "",
    rePassword: "",
  });

  const handleSaveClick = async () => {
    //先验证密码是否一致
    if (data.password !== data.rePassword) {
      showToast("重复密码不一致");
      return;
    }

    //获取缓存
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    //发送请求
    const result = await request.post("/user/updatePassword", {
      id: userInfo.id,
      oldPassword: data.oldPassword,
      password: data.password,
      rePassword: data.rePassword,
    });

    if (result.message === "success" && result.code === 0) {
      await router.push({ name: "My" });
    } else {
      showToast(result.message);
    }
  };

  const { oldPassword, password, rePassword } = toRefs(data);

  return {
    oldPassword,
    password,
    rePassword,
    handleBackClick,
    handleSaveClick,
  };
};

export default {
  name: "edit",
  components: { Toast },
  setup() {
    const { show, toastMessage, showToast } = useToastEffect();
    const {
      oldPassword,
      password,
      rePassword,
      handleBackClick,
      handleSaveClick,
    } = useUserInfoEffect(showToast);
    return {
      oldPassword,
      password,
      rePassword,
      handleBackClick,
      handleSaveClick,
      show,
      toastMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/variables.scss";
.wrapper {
  overflow-y: auto;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0.5rem;
  right: 0;
  background: #f5f5f5;
}
.title {
  display: flex;
  padding: 0 0.18rem;
  line-height: 0.44rem;
  height: 0.44rem;
  background-color: #ffffff;
  &__back {
    width: 0.3rem;
    font-size: 0.24rem;
    color: #b6b6b6;
  }
  &__content {
    display: flex;
    flex: 1;
    color: #333333;
    &__info {
      flex: 1;
      text-align: center;
      font-size: 0.16rem;
    }
    &__more {
      font-size: 0.14rem;
    }
  }
}
.userInfo {
  padding: 0 0.18rem;
  margin-top: 0.12rem;
  &__item {
    padding: 0.18rem 0.12rem;
    height: 0.4rem;
    margin-bottom: 0.1rem;
    font-size: 0.16rem;
    display: flex;
    background-color: #ffffff;
    border-radius: 0.2rem;
    &__title {
      color: #666666;
      line-height: 0.4rem;
      height: 0.4rem;
      text-align: center;
    }
    input {
      color: #999;
      height: 0.4rem;
      border: 0 solid #3a91f3;
      ::placeholder {
        //通过这个设置
        color: #999; //如果有时不生效 有可能是权限不够 加一个!important 即可
      }
    }
  }
}
.save {
  margin: 0.3rem 0.1rem;
  height: 0.5rem;
  background: #0091ff;
  color: white;
  font-size: 0.2rem;
  line-height: 0.5rem;
  text-align: center;
  border-radius: 0.2rem;
}
</style>
