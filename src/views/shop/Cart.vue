<template>
  <div>
    <div
      class="mask"
      @click="handleCartShowChange"
      v-if="showCart && calculations.total > 0"
    />
    <div class="cart">
      <div class="product" v-if="showCart && calculations.total > 0">
        <div class="product__header">
          <div
            class="product__header__all"
            @click="() => setCartItemsChecked(shopId)"
          >
            <span
              class="product__header__icon iconfont"
              v-html="calculations.allChecked ? '&#xe608;' : '&#xe8bb;'"
            >
            </span>
            全选
          </div>
          <div class="product__header__clear">
            <span class="iconfont">&#xe74b;</span>
            <span
              class="product__header__clear__btn"
              @click="() => cleanCartProducts(shopId)"
            >
              清空购物车</span
            >
          </div>
        </div>
        <div v-for="item in productList" :key="item.id">
          <div class="product__item" v-if="item.count > 0">
            <div
              class="product__item__checked iconfont"
              v-html="item.check ? '&#xe608;' : '&#xe8bb;'"
              @click="() => changeCartItemChecked(shopId, item.id)"
            ></div>
            <img
              class="product__item__img"
              :src="item.imgUrl"
              alt="图片加载失败"
            />
            <div class="product__item__detail">
              <h4 class="product__item__title">{{ item.name }}</h4>
              <p class="product__item__price">
                <span class="product__item__yen">&yen;</span>{{ item.price }}
                <span class="product__item__origin"
                  >&yen;{{ item.oldPrice }}</span
                >
              </p>
            </div>
            <div class="product__number">
              <span
                class="product__number__minus iconfont"
                @click="
                  () => {
                    changeCartItemInfo(shopId, shopName, item.id, item, -1);
                  }
                "
                >&#xe8b1;</span
              >
              {{ item.count || 0 }}
              <span
                class="product__number__plus iconfont"
                @click="
                  () => {
                    changeCartItemInfo(shopId, shopName, item.id, item, 1);
                  }
                "
                >&#xe630;</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="check">
        <div class="check__icon">
          <img
            src="https://images.gaoshiyi.top/static/basket.png"
            class="check__icon__img"
            @click="handleCartShowChange"
            alt="图片加载失败"
          />
          <div class="check__icon__tag">{{ calculations.total }}</div>
        </div>
        <div class="check__info">
          总计：<span class="check__info__price"
            >&yen; {{ calculations.price }}</span
          >
        </div>
        <div class="check__btn" v-if="calculations.total > 0">
          <router-link :to="{ path: `/orderConfirm/${shopId}` }">
            去结算
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useCommonCartEffect } from "@/effects/CartEffects";

// 获取购物车信息逻辑
const useCartEffect = (shopId) => {
  const store = useStore();

  const { changeCartItemInfo, calculations, productList } =
    useCommonCartEffect(shopId);

  const changeCartItemChecked = (shopId, productId) => {
    store.commit("changeCartItemChecked", { shopId, productId });
  };

  const cleanCartProducts = (shopId) => {
    store.commit("cleanCartProducts", { shopId });
  };

  const setCartItemsChecked = (shopId) => {
    store.commit("setCartItemsChecked", { shopId });
  };

  return {
    calculations,
    productList,
    cleanCartProducts,
    changeCartItemInfo,
    changeCartItemChecked,
    setCartItemsChecked,
  };
};

// 展示隐藏购物车逻辑
const toggleCartEffect = () => {
  const showCart = ref(false);
  const handleCartShowChange = () => {
    showCart.value = !showCart.value;
  };
  return { showCart, handleCartShowChange };
};

export default {
  name: "Cart",
  props: ["shopName"],
  setup() {
    const route = useRoute();
    const shopId = route.params.id;
    //进入购物车就需要将地址信息置空 防止下单时缓存出错
    localStorage.setItem("address", "");
    const { showCart, handleCartShowChange } = toggleCartEffect();
    const {
      calculations,
      productList,
      cleanCartProducts,
      changeCartItemInfo,
      changeCartItemChecked,
      setCartItemsChecked,
    } = useCartEffect(shopId);
    return {
      calculations,
      shopId,
      productList,
      cleanCartProducts,
      changeCartItemInfo,
      changeCartItemChecked,
      setCartItemsChecked,
      showCart,
      handleCartShowChange,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/variables.scss";
@import "../../style/mixins.scss";
.cart {
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  overflow: hidden;
  background: $bgColor;
}
.mask {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}
.product {
  overflow-y: scroll;
  flex: 1;
  height: 2.8rem;
  &__header {
    display: flex;
    border-bottom: 1px solid $content-bgColor;
    font-size: 0.14rem;
    position: fixed;
    line-height: 0.4rem;
    height: 0.4rem;
    width: 100%;
    z-index: 10;
    background: white;
    bottom: 3.23rem;
    &__all {
      width: 0.64rem;
      margin-left: 0.16rem;
      color: $btn-bgColor;
      background: white;
    }
    &__icon {
      display: inline-block;
      margin-right: 0.1rem;
      vertical-align: top;
      font-size: 0.2rem;
    }
    &__clear {
      flex: 1;
      margin-right: 0.16rem;
      text-align: right;
      &__btn {
        display: inline-block;
      }
    }
  }
  &__item {
    position: relative;
    display: flex;
    padding: 0.12rem 0;
    margin: 0 0.16rem;
    border-bottom: 0.01rem solid $content-bgColor;
    &__checked {
      line-height: 0.5rem;
      margin-right: 0.2rem;
      color: $btn-bgColor;
      font-size: 0.2rem;
    }
    &__detail {
      overflow: hidden;
    }
    &__img {
      width: 0.46rem;
      height: 0.46rem;
      margin-right: 0.16rem;
    }
    &__title {
      margin: 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $content-fontcolor;
      @include ellipsis;
    }
    &__price {
      margin: 0.06rem 0 0 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $hightlight-fontColor;
    }
    &__yen {
      font-size: 0.12rem;
    }
    &__origin {
      margin-left: 0.06rem;
      line-height: 0.2rem;
      font-size: 0.12rem;
      color: $light-fontColor;
      text-decoration: line-through;
    }
    .product__number {
      position: absolute;
      right: 0;
      bottom: 0.12rem;
      &__minus {
        position: relative;
        top: 0.02rem;
        font-size: 0.2rem;
        color: $medium-fontColor;
        margin-right: 0.05rem;
      }
      &__plus {
        position: relative;
        top: 0.02rem;
        font-size: 0.2rem;
        color: $btn-bgColor;
        margin-left: 0.05rem;
      }
    }
  }
}

.check {
  display: flex;
  height: 0.49rem;
  border-top: 0.01rem solid $content-bgColor;
  line-height: 0.49rem;
  &__icon {
    position: relative;
    width: 0.84rem;
    &__img {
      display: block;
      margin: 0.12rem auto;
      width: 0.28rem;
      height: 0.26rem;
    }
    &__tag {
      position: absolute;
      left: 0.46rem;
      top: 0.04rem;
      padding: 0 0.04rem;
      min-width: 0.2rem;
      height: 0.2rem;
      line-height: 0.2rem;
      background-color: $hightlight-fontColor;
      border-radius: 0.1rem;
      font-size: 0.12rem;
      text-align: center;
      color: #fff;
      transform: scale(0.5);
      transform-origin: left center;
    }
  }
  &__info {
    flex: 1;
    color: $content-fontcolor;
    font-size: 0.12rem;
    &__price {
      line-height: 0.49rem;
      color: $hightlight-fontColor;
      font-size: 0.18rem;
    }
  }
  &__btn {
    width: 0.98rem;
    background-color: #4fb0f9;
    text-align: center;
    font-size: 0.14rem;
    a {
      color: #fff;
      text-decoration: none;
    }
  }
}
</style>
