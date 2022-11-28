<template>
  <div class="wrapper">
    <div class="title">我的全部购物车({{ total }})</div>
    <div class="empty" v-if="total === 0">购物车当前为空</div>

    <div class="products" v-for="(item, index) in cart" :key="index">
      <div class="products__shopName iconfont">
        <router-link :to="`/shop/${item.shopId}`">
          &#xe736; {{ item.shopName }} &#xe6af;
        </router-link>
      </div>
      <div class="products__wrapper">
        <div
          class="products__list"
          v-for="item in item.productList"
          :key="item.id"
        >
          <div class="products__item">
            <img class="products__item__img" :src="item.imgUrl" />
            <div class="products__item__detail">
              <h4 class="products__item__title">{{ item.name }}</h4>
              <p class="products__item__price">
                <span>
                  <span class="products__item__yen">&yen; </span>
                  {{ item.price }} x {{ item.count }}
                </span>
                <span class="products__item__total">
                  <span class="products__item__yen">&yen;</span>
                  {{ item.price * item.count }}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="products__more">
          <p class="products__more__total">
            共计{{ item.count }}件/{{ item.amount }}元
          </p>
          <p class="products__more__check">
            <router-link :to="{ path: `/orderConfirm/${item.shopId}` }">
              去结算
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
  <Docker :currentIndex="1" />
</template>
<script>
import { useStore } from "vuex";
import Docker from "@/components/Docker";

const useCartEffect = () => {
  const store = useStore();
  const cartList = store.state.cartList;
  const result = { total: 0, cart: [] };

  for (const i in cartList) {
    //组装数据的初始化定义，因为每次循环之后要恢复初始值
    let temp = {
      shopId: 0,
      shopName: "",
      productList: [],
      count: 0,
      amount: 0,
    };
    //获取商铺名称
    temp.shopName = cartList[i].shopName;
    //获取商铺shopId
    temp.shopId = i;

    let amount = 0;
    let productList = cartList[i].productList;

    for (const j in productList) {
      if (productList[j] instanceof Object) {
        //组装列表数据
        if (productList[j].count > 0) {
          temp.productList.push(productList[j]);
        }
        //统计总件数和总价
        temp.count += productList[j].count;
        amount += productList[j].price * productList[j].count;
        temp.amount = amount.toFixed(2);
      }
    }

    if (temp.count > 0) {
      result.cart.push(temp);
      result.total++;
    }
  }

  return result;
};

export default {
  name: "CartList",
  components: { Docker },
  setup() {
    //进入到cartList页面就需要把订单信息 地址信息制空 防止下单时缓存干扰程序
    localStorage.setItem("orderList", "");
    localStorage.setItem("address", "");
    //获取购物车数量和购物车数据
    const { total, cart } = useCartEffect();
    return { total, cart };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/variables.scss";
@import "../../style/mixins.scss";
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
  line-height: 0.44rem;
  background: $bgColor;
  font-size: 0.16rem;
  color: $content-fontcolor;
  text-align: center;
}
.empty {
  line-height: 0.44rem;
  color: $light-fontColor;
  font-size: 0.16rem;
  text-align: center;
}
.products {
  margin: 0.16rem 0.18rem 0.1rem 0.18rem;
  background: $bgColor;
  border-radius: 0.2rem;
  &__shopName {
    padding: 0.16rem;
    font-size: 0.16rem;
    font-weight: 550;
    a {
      color: $content-fontcolor;
      text-decoration: none;
    }
  }
  &__wrapper {
    overflow-y: scroll;
    margin: 0 0.18rem;
  }
  &__list {
    background: $bgColor;
    padding-bottom: 0.15rem;
  }
  &__more {
    margin-bottom: 0.15rem;
    height: 0.28rem;
    color: $btn-bgColor;
    line-height: 0.28rem;
    font-size: 0.14rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &__total {
      border: 1px solid $btn-bgColor;
      flex: 1;
      text-align: center;
      padding: 0 0.05rem;
      border-radius: 0.1rem 0 0 0.1rem;
    }
    &__check {
      text-align: center;
      background-color: $btn-bgColor;
      color: $bgColor;
      padding: 0.01rem 0.05rem;
      border-radius: 0rem 0.1rem 0.1rem 0rem;
      a {
        color: #fff;
        text-decoration: none;
      }
    }
  }
  &__item {
    position: relative;
    display: flex;
    justify-content: space-between;
    &__img {
      width: 0.46rem;
      height: 0.46rem;
      margin-right: 0.16rem;
    }
    &__detail {
      flex: 1;
    }
    &__title {
      margin: 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $content-fontcolor;
      @include ellipsis;
    }
    &__price {
      display: flex;
      margin: 0.06rem 0 0 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $hightlight-fontColor;
    }
    &__total {
      flex: 1;
      text-align: right;
      font-size: 0.18rem;
      color: $hightlight-fontColor;
    }
    &__yen {
      font-size: 0.12rem;
    }
  }
}
</style>
