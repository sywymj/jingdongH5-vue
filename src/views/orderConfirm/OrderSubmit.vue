<template>
  <div>
    <div class="order">
      <div class="order__price">
        实付金额 <b>¥{{ totalPrice }}</b>
      </div>
      <div class="order__btn" @click.once="() => handlePlaceOrder()">
        提交订单
      </div>
    </div>
    <div class="mask" v-show="showConfirm">
      <div class="mask__content">
        <h3 class="mask__content__title">订单创建成功，</h3>
        <p class="mask__content__desc">请尽快支付，本店为付款后减库存</p>
        <div class="mask__content__btns">
          <div
            class="mask__content__btn mask__content__btn--first"
            @click="() => handleConfirmPay(false)"
          >
            取消支付
          </div>
          <div
            class="mask__content__btn mask__content__btn--last"
            @click="() => handleConfirmPay(true, order)"
          >
            确认支付
          </div>
        </div>
      </div>
    </div>
  </div>
  <Toast v-if="show" :message="toastMessage" />
</template>

<script>
import { useStore } from "vuex";
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "../../utils/request";
import Toast, { useToastEffect } from "../../components/Toast";
import { useCommonCartEffect } from "../../effects/CartEffects";

// 下单相关逻辑
const useCreateOrderEffect = (shopId, shopName, productList, showToast) => {
  const store = useStore();

  //获取用户信息
  const userInfo = JSON.parse(localStorage.userInfo);
  //获取选择的地址信息
  const address =
    localStorage.getItem("address") != ""
      ? JSON.parse(localStorage.getItem("address"))
      : "";
  let order = reactive({});
  let showConfirm = ref(false);

  //提交订单
  const handlePlaceOrder = async () => {
    //判断用户是否绑定微信 否则无法下单及支付
    if (userInfo.openId == null && userInfo.openId == undefined) {
      showToast("用户信息不全 请先绑定微信");
      return;
    }
    //获取购物车中的所有数据
    const products = [];
    for (let i in productList.value) {
      const product = productList.value[i];
      products.push({
        productId: parseInt(product.id, 10),
        quantity: product.count,
      });
    }
    try {
      const result = await request.post("/user/order/create", {
        userId: userInfo.id,
        consigneeName: address.consigneeName,
        tel: address.tel,
        address: address.area + address.detailedAddress,
        userOpenId: userInfo.openId,
        shopId: shopId,
        shopName: shopName.value,
        products: JSON.stringify(products),
      });
      if (result.message == "success" && result.code == 0) {
        //创建订单成功，要清除购物车数据
        store.commit("clearCartData", shopId);
        order.value = result.data;
        //更改showConfirm值为true 弹出支付确认页面
        showConfirm.value = true;
      } else {
        showToast(result.message);
      }
    } catch (e) {
      showToast("下单失败", e);
    }
  };

  return { handlePlaceOrder, order, showConfirm };
};

// 蒙层确认支付相关逻辑
const useShowMaskEffect = (showToast) => {
  const router = useRouter();

  const handleConfirmPay = async (boolean, order) => {
    if (boolean == false) {
      //如果为false 取消支付 直接跳转订单页面
      router.push({ name: "OrderList" });
    }
    const result = await request.post("/user/order/pay", {
      orderNumber: order.value.orderNumber,
      openId: order.value.userOpenId,
    });
    if (result.message == "success" && result.code == 0) {
      router.push({ name: "OrderList" });
    } else {
      showToast(result.message);
    }
  };
  return { handleConfirmPay };
};

export default {
  name: "OrderSubmit",
  components: { Toast },
  props: ["totalPrice"],
  setup() {
    const route = useRoute();
    const shopId = parseInt(route.params.shopId, 10);
    const { show, toastMessage, showToast } = useToastEffect();
    const { calculations, shopName, productList } = useCommonCartEffect(shopId);
    const { handlePlaceOrder, order, showConfirm } = useCreateOrderEffect(
      shopId,
      shopName,
      productList,
      showToast
    );
    const { handleConfirmPay } = useShowMaskEffect(showToast);
    return {
      handlePlaceOrder,
      handleConfirmPay,
      order,
      showConfirm,
      calculations,
      show,
      toastMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/variables.scss";
.order {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  height: 0.49rem;
  line-height: 0.49rem;
  background: $bgColor;
  &__price {
    flex: 1;
    text-indent: 0.24rem;
    font-size: 0.14rem;
    color: $content-fontcolor;
  }
  &__btn {
    width: 0.98rem;
    background: #4fb0f9;
    color: #fff;
    text-align: center;
    font-size: 0.14rem;
  }
}
.mask {
  z-index: 1;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3rem;
    height: 1.56rem;
    background: #fff;
    text-align: center;
    border-radius: 0.04rem;
    &__title {
      margin: 0.24rem 0 0 0;
      line-height: 0.26rem;
      font-size: 0.18rem;
      color: #333;
    }
    &__desc {
      margin: 0.08rem 0 0 0;
      font-size: 0.14rem;
      color: #666666;
    }
    &__btns {
      display: flex;
      margin: 0.24rem 0.58rem;
    }
    &__btn {
      flex: 1;
      width: 0.8rem;
      line-height: 0.32rem;
      border-radius: 0.16rem;
      font-size: 0.14rem;
      &--first {
        margin-right: 0.12rem;
        border: 0.01rem solid #4fb0f9;
        color: #4fb0f9;
      }
      &--last {
        margin-left: 0.12rem;
        background: #4fb0f9;
        color: #fff;
      }
    }
  }
}
</style>
