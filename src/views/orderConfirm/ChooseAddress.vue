<template>
  <div class="top">
    <div class="top__header">
      <div class="iconfont top__header__back" @click="handleBackClick">
        &#xe697;
      </div>
      确认订单
    </div>
    <div v-if="address" class="top__receiver" @click="handleAddressClick">
      <div class="top__receiver__title">收货地址</div>
      <div class="top__receiver__address">
        {{ address.area }}{{ address.detailedAddress }}
      </div>
      <div class="top__receiver__info">
        <span class="top__receiver__info__name">{{
          address.consigneeName
        }}</span>
        <span class="top__receiver__info__name">{{ address.tel }}</span>
      </div>
      <div class="iconfont top__receiver__icon">&#xe6f2;</div>
    </div>
    <div v-else class="top__receiver" @click="handleAddressClick">
      <div class="top__receiver__title">收货地址</div>
      <div class="top__receiver__address">请选择默认地址</div>
      <div class="iconfont top__receiver__icon">&#xe6f2;</div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import request from "../../utils/request";

const useAddressEffect = () => {
  const router = useRouter();

  const handleBackClick = () => {
    //返回时需要把地址信息制空
    localStorage.setItem("orderAddress", "");
    router.back();
  };

  //跳转地址页面 选择收货地址
  const handleAddressClick = () => {
    //设置锚点chooseAddress 表明用户是从订单页面而来选择地址
    localStorage.setItem("chooseAddress", "true");
    router.push({ name: "Address" });
  };

  //获取用户缓存信息
  let userInfo = JSON.parse(localStorage.getItem("userInfo"));

  let address = ref([]);

  const handleItemClick = async () => {
    //获取地址页面传过来的用户选择的收货地址
    const orderAddress =
      localStorage.getItem("address") !== ""
        ? JSON.parse(localStorage.getItem("address"))
        : "";

    if (orderAddress !== "") {
      //如果orderAddress不为空 说明有点击选择地址的操作 使用地址页面传过来的地址orderAddress
      address.value = orderAddress;
    } else {
      //orderAddress为空 未选择 异步获取用户默认地址
      const result = await request.get("/user/address/default/" + userInfo.id);
      if (result.message === "success" && result.code === 0) {
        //保存用户地址信息
        address.value = result.data;
      } else {
        address.value = "";
      }
    }
    //选择完毕 保存地址至缓存 供确认订单页面获取
    localStorage.setItem("address", JSON.stringify(address.value));
  };

  handleItemClick();

  return { address, handleBackClick, handleAddressClick };
};

export default {
  name: "ChooseAddress",
  setup() {
    const { address, handleBackClick, handleAddressClick } = useAddressEffect();
    return { address, handleBackClick, handleAddressClick, useAddressEffect };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/variables.scss";
.top {
  position: relative;
  height: 1.96rem;
  background-size: 100% 1.59rem;
  background-image: linear-gradient(0deg, rgba(0, 145, 255, 0) 4%, #0091ff 50%);
  background-repeat: no-repeat;
  &__header {
    position: relative;
    padding-top: 0.2rem;
    line-height: 0.24rem;
    color: $bgColor;
    text-align: center;
    font-size: 0.16rem;
    &__back {
      position: absolute;
      left: 0.18rem;
      font-size: 0.22rem;
    }
  }
  &__receiver {
    position: absolute;
    left: 0.18rem;
    right: 0.18rem;
    bottom: 0;
    height: 1.2rem;
    background: $bgColor;
    border-radius: 0.04rem;
    &__title {
      line-height: 0.22rem;
      padding: 0.16rem 0 0.14rem 0.16rem;
      font-size: 0.16rem;
      color: $content-fontcolor;
    }
    &__address {
      line-height: 0.2rem;
      padding: 0 0.4rem 0 0.16rem;
      font-size: 0.14rem;
      color: $content-fontcolor;
    }
    &__info {
      padding: 0.06rem 0 0 0.16rem;
      &__name {
        margin-right: 0.06rem;
        line-height: 0.18rem;
        font-size: 0.12rem;
        color: $medium-fontColor;
      }
    }
    &__icon {
      transform: rotate(180deg);
      position: absolute;
      right: 0.16rem;
      top: 0.5rem;
      color: $medium-fontColor;
      font-size: 0.2rem;
    }
  }
}
</style>
