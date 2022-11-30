<template>
  <div class="content">
    <!-- 分类 -->
    <div class="category">
      <ul class="content-ul">
        <li
          :class="{ 'cate-item': true, category__current: currentTabId === 0 }"
          @click="() => handleTabClick(0)"
        >
          <span> 全部 </span>
        </li>

        <li
          v-for="(item, index) in shopContentList"
          :key="index"
          :class="{
            'cate-item': true,
            category__current: currentTabId === item.id,
          }"
          @click="() => handleTabClick(item.id)"
        >
          <span>
            {{ item.name }}
          </span>
        </li>
      </ul>
    </div>
    <!-- /分类 -->

    <!-- 商品 -->
    <div class="product">
      <!-- 商品及分类模块 -->
      <ul class="content-ul">
        <li class="content-item" v-for="item in currentList" :key="item.id">
          <!-- 分类标题 if判断 当商品集合中有商品时 才输出对应的分类名称-->
          <h1
            class="cate-title"
            v-if="Object.keys(item.productBoList).length > 0"
          >
            {{ item.name }}
          </h1>
          <!-- /分类标题 -->
          <!-- 该分类下的商品 -->
          <ul class="content-ul">
            <li
              class="product-item"
              v-for="product in item.productBoList"
              :key="product.id"
            >
              <div class="product__item">
                <img
                  class="product__item__img"
                  :src="product.imgUrl"
                  alt="图片加载失败"
                />

                <div class="product__item__detail">
                  <h4 class="product__item__title">{{ product.name }}</h4>
                  <p class="product__item__sales">
                    月售 {{ product.sales }} 件
                  </p>
                  <p class="product__item__price">
                    <span class="product__item__yen">&yen;</span
                    >{{ product.price }}
                    <span class="product__item__origin"
                      >&yen;{{ product.oldPrice }}</span
                    >
                  </p>
                </div>
                <!-- 商品添加&减少购物车 -->
                <div class="product__number">
                  <span
                    class="product__number__minus iconfont"
                    @click="
                      () => {
                        changeCartItemInfo(
                          shopId,
                          shopName,
                          product.id,
                          product,
                          -1
                        );
                      }
                    "
                    >&#xe8b1;
                  </span>

                  {{
                    cartList?.[shopId]?.productList?.[product.id]?.count || 0
                  }}

                  <span
                    class="product__number__plus iconfont"
                    @click="
                      () => {
                        changeCartItemInfo(
                          shopId,
                          shopName,
                          product.id,
                          product,
                          1
                        );
                      }
                    "
                    >&#xe630;
                  </span>
                </div>
                <!-- /商品添加&减少购物车 -->
              </div>
            </li>
          </ul>
          <!-- /该分类下的商品 -->
        </li>
      </ul>
      <!-- /商品及分类模块 -->
    </div>
    <!-- /商品 -->
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import request from "../../utils/request";
import { useCommonCartEffect } from "@/effects/CartEffects";

//获取店铺全部分类及全部商品
const useShopContentListEffect = (shopId) => {
  const shopContentList = ref({});
  const getShopContentList = async (handleTabClick) => {
    const result = await request.get(`/product/shop/${shopId}`);
    if (result.message === "success" && result.code === 0) {
      shopContentList.value = result.data;
    }
    //请求完毕后 调用1次点击方法 展示初始数据
    handleTabClick(0);
  };
  return { shopContentList, getShopContentList };
};

// Tab 切换商品相关的逻辑
const useTabEffect = (shopContentList) => {
  //当前分类的id 默认为0 即未点击的话默认展示全部商品
  const currentTabId = ref(0);
  //当前展示的商品的容器
  const currentList = ref([]);

  //当点击对应的分类时
  const handleTabClick = (id) => {
    currentTabId.value = id;
    //清空数组之前的内容 防止重复
    currentList.value.length = 0;
    if (currentTabId.value === 0) {
      for (let index = 0; index < shopContentList.value.length; index++) {
        currentList.value.push(shopContentList.value[index]);
      }
    } else {
      for (let index = 0; index < shopContentList.value.length; index++) {
        if (id === shopContentList.value[index].id) {
          currentList.value.push(shopContentList.value[index]);
        }
      }
    }
  };
  console.log(currentList);
  return { currentTabId, handleTabClick, currentList };
};

export default {
  name: "Content",
  props: ["shopName"],
  setup() {
    const route = useRoute();
    const shopId = route.params.id;
    const { shopContentList, getShopContentList } =
      useShopContentListEffect(shopId);
    const { currentTabId, handleTabClick, currentList } =
      useTabEffect(shopContentList);
    getShopContentList(handleTabClick);
    const { cartList, changeCartItemInfo } = useCommonCartEffect();
    return {
      shopContentList,
      getShopContentList,
      currentTabId,
      handleTabClick,
      currentList,
      shopId,
      cartList,
      changeCartItemInfo,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/variables.scss";
@import "../../style/mixins.scss";
.content {
  display: flex;
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  top: 1.5rem;
  bottom: 0.5rem;
  background: #fff;
  overflow: hidden;
  .content-ul {
    padding-left: 0;
    padding-top: 0;
    margin-top: 0;
  }
}
.category {
  overflow-y: scroll;
  height: 100%;
  width: 0.76rem;
  background: #f3f5f7;
  .cate-item {
    display: table;
    width: 100%;
    list-style: none;
    line-height: 0.4rem;
    font-size: 0.12rem;
    color: #696969;
    font-weight: 600;
    text-align: center;
    z-index: 0;
  }
  &__current {
    background: #fff;
    position: relative;
    z-index: 10;
    margin-top: -1px;
    color: black !important;
  }
}
.product {
  overflow-y: scroll;
  flex: 1;
  .cate-title {
    color: gray;
    font-size: 0.1rem;
    height: 0.2rem;
    line-height: 0.2rem;
    padding-left: 0.12rem;
  }
  &__item {
    position: relative;
    display: flex;
    padding: 0.12rem 0;
    margin: 0 0.16rem;
    border-bottom: 0.01rem solid $content-bgColor;
    &__detail {
      overflow: hidden;
    }
    &__img {
      width: 0.68rem;
      height: 0.68rem;
      margin-right: 0.16rem;
    }
    &__title {
      margin: 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $content-fontcolor;
      @include ellipsis;
    }
    &__sales {
      margin: 0.06rem 0;
      font-size: 0.12rem;
      color: $content-fontcolor;
    }
    &__price {
      margin: 0;
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
      font-size: 0.15rem;
      line-height: 0.18rem;
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
</style>
