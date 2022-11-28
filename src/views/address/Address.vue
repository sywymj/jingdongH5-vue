<template>
  <div class="wrapper">
    <div class="title">
      <div class="title__back iconfont" @click="handleBackClick">&#xe697;</div>
      <div class="title__content">
        <div class="title__content__info">我的收货地址</div>
        <div class="title__content__more" @click="handleAddClick">新建</div>
      </div>
    </div>
    <div class="message" v-if="Object.keys(itemList).length == 0">
      暂无收货地址
    </div>
    <div class="address">
      <div
        class="address__content"
        v-for="item in itemList"
        :key="item.id"
        @click="handleSaveClick(item)"
      >
        <div class="address__content__main">
          <div class="address__content__main__title">
            <div class="defaultAddress iconfont" v-if="item.isDefault == 1">
              &#xe614;
            </div>
            <div class="nickname">{{ item.consigneeName }}</div>
            <div class="tel">{{ item.tel }}</div>
          </div>
          <div class="address__content__main__info">
            {{ item.area }}{{ item.detailedAddress }}
          </div>
        </div>
        <div class="address__content__more iconfont">&#xe6f2;</div>
      </div>
    </div>
    <Toast v-if="show" :message="toastMessage" />
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Toast, { useToastEffect } from "../../components/Toast";
import request from "../../utils/request";

const useAddressEffect = (showToast) => {
  const router = useRouter();

  //获取缓存中的锚点参数 用于判断用户是否是在订单页面点击选择地址
  const chooseOrderAddress = localStorage.getItem("chooseAddress");

  const handleBackClick = () => {
    //返回时将chooseAddress设为false 防止用户从地址页面进入时 直接返回
    localStorage.setItem("chooseAddress", false);
    router.back();
  };

  const handleAddClick = () => {
    //路由至地址增加组件
    router.push({ name: "AddressAdd" });
  };

  const handleSaveClick = (item) => {
    if (chooseOrderAddress == "true") {
      //chooseOrderAddress为true 说明用户是在订单页面点击跳转 选择订单地址
      //保存用户选择的地址 跳回下单页面
      localStorage.setItem("address", JSON.stringify(item));
      //返回时将chooseAddress设为false 防止用户从地址页面进入时 直接返回
      localStorage.setItem("chooseAddress", false);
      router.back();
    } else {
      //chooseAddress为false 正常跳转地址编辑页面
      router.push({
        name: "AddressSave",
        params: { address: JSON.stringify(item) },
      });
    }
  };

  //获取用户缓存信息
  let userInfo = JSON.parse(localStorage.getItem("userInfo"));
  //获取用户所有地址
  let itemList = ref([]);
  const handleListClick = async () => {
    const result = await request.get("/user/address/all/" + userInfo.id);
    if (result.message == "success" && result.code == 0) {
      itemList.value = result.data;
    } else {
      showToast(result.message);
    }
  };

  return {
    itemList,
    handleBackClick,
    handleAddClick,
    handleSaveClick,
    handleListClick,
  };
};

export default {
  name: "Address",
  components: { Toast },
  setup() {
    const { show, toastMessage, showToast } = useToastEffect();
    const {
      itemList,
      handleBackClick,
      handleAddClick,
      handleSaveClick,
      handleListClick,
    } = useAddressEffect(showToast);
    handleListClick();
    return {
      itemList,
      handleBackClick,
      show,
      toastMessage,
      showToast,
      handleAddClick,
      handleSaveClick,
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
  background: rgb(248, 248, 248);
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
.message {
  color: #808080;
  font-size: 0.16rem;
  margin-top: 0.2rem;
  text-align: center;
}
.address {
  padding: 0 0.18rem;
  &__title {
    height: 0.2rem;
    line-height: 0.2rem;
    margin-top: 0.16rem;
    font-size: 0.14rem;
    color: #333333;
  }
  &__content {
    padding: 0.18rem 0.16rem;
    margin-top: 0.12rem;
    background-color: #ffffff;
    display: flex;
    &__main {
      width: 2.6rem;
      &__title {
        display: flex;
        color: #999;
        font-size: 0.14rem;
        height: 0.2rem;
        .nickname {
          width: 0.8rem;
          font-weight: 550;
          color: black;
        }
        .tel {
          flex: 1;
        }
        .iconfont {
          color: red;
          width: 0.2rem;
        }
        .defaultAddress {
          color: blue;
        }
      }
      &__info {
        margin-top: 0.08rem;
        height: 0.4rem;
        line-height: 0.2rem;
        font-size: 0.14rem;
        color: #333333;
      }
    }
    &__more {
      flex: 1;

      transform: rotate(180deg);
      line-height: 0.68rem;
      color: #999;
    }
  }
}
</style>
