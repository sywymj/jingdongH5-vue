<template>
  <!-- 主体内容 -->
  <div class="wrapper">
    <div class="title">
      <div class="title__back iconfont" @click="handleBackClick">&#xe697;</div>
      <div class="title__content">
        <div class="title__content__info">{{ cateName }}</div>
      </div>
    </div>
    <div class="message" v-if="Object.keys(shopList).length === 0">
      当前分类下暂无店铺
    </div>
    <div class="nearby">
      <router-link
        :to="`/shop/${item.id}`"
        v-for="item in shopList"
        :key="item.id"
      >
        <ShopInfo :item="item" />
      </router-link>
    </div>
  </div>
  <Docker :currentIndex="0" />
</template>

<script>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import request from "../../utils/request";
import ShopInfo from "../../components/ShopInfo";
import Docker from "@/components/Docker";

const useShopListEffect = (cateId) => {
  const shopList = ref([]);
  const getShopList = async () => {
    const result = await request.get("/home/category/shop/" + cateId);
    if (result.message === "success" && result.code === 0) {
      shopList.value = result.data;
    }
  };
  const router = useRouter();
  const handleBackClick = () => {
    router.back();
  };

  return { shopList, getShopList, handleBackClick };
};

export default {
  name: "Nearby",
  components: { ShopInfo, Docker },
  setup() {
    const route = useRoute();
    //id为分类id
    const cateId = route.params.cateId;
    const cateName = route.params.cateName;
    const { shopList, getShopList, handleBackClick } =
      useShopListEffect(cateId);
    getShopList();
    return {
      cateName,
      shopList,
      handleBackClick,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/style/variables.scss";
// 主体内容
.wrapper {
  overflow-y: auto;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0.5rem;
  right: 0;
  padding: 0 0.18rem 0.1rem 0.18rem;
}
.title {
  display: flex;
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
  }
}
.message {
  color: #808080;
  font-size: 0.16rem;
  margin-top: 0.2rem;
  text-align: center;
}
.nearby {
  a {
    text-decoration: none;
  }
}
</style>
