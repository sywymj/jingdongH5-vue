<template>
  <!-- 顶部地区 -->
  <div class="position">
    <span class="iconfont position__icon">&#xe614;</span>
    浙江省杭州市滨江区江南大道
    <span class="iconfont position_notice">&#xe62f;</span>
  </div>
  <!-- 搜索及banner -->
  <div class="search">
    <span class="iconfont">&#xe752;</span>
    <span class="search__text">山姆会员商店优惠商品</span>
  </div>
  <div class="banner">
    <img
      class="banner__img"
      src="http://images.gaoshiyi.top/static/banner.jpg"
    />
  </div>
  <!-- nav -->
  <div class="icons">
    <div
      class="icons__item"
      v-for="item in categories"
      :key="item.id"
      @click="handleClick(item)"
    >
      <img class="icons__item__img" :src="item.imgUrl" />
      <p class="icons__item__desc">{{ item.name }}</p>
    </div>
  </div>
  <div class="gap"></div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import request from "@/utils/request";

const useCategoryEffect = () => {
  const categories = ref([]);
  const getCategories = async () => {
    const result = await request.get("/home/categories");
    if (result.message == "success" && result.code == 0) {
      categories.value = result.data;
    }
  };
  getCategories();

  const router = useRouter();
  //id为分类id
  const handleClick = (item) => {
    router.push({
      name: "ShopList",
      params: { cateId: item.id, cateName: item.name },
    });
  };

  return { categories, handleClick };
};

export default {
  name: "StaticPart",
  setup() {
    const { categories, handleClick } = useCategoryEffect();
    return { categories, handleClick };
  },
};
</script>

<style lang="scss" scoped>
@import "@/style/variables.scss";
@import "@/style/mixins.scss";
// 顶部地区
.position {
  position: relative;
  padding: 0.16rem 0.24rem 0.16rem 0;
  line-height: 0.22rem;
  font-size: 0.16rem;
  @include ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  .position__icon {
    color: blue;
    position: relative;
    top: 0.01rem;
    font-size: 0.2rem;
  }
  .position_notice {
    position: absolute;
    right: 0;
    top: 0.17rem;
    font-size: 0.2rem;
  }
  color: $content-fontcolor;
}
// 搜索及banner
.search {
  margin-bottom: 0.12rem;
  line-height: 0.32rem;
  background: $search-bgColor;
  color: $search-fontColor;
  border-radius: 0.16rem;
  .iconfont {
    display: inline-block;
    padding: 0 0.08rem 0 0.16rem;
    font-size: 0.16rem;
  }
  &__text {
    display: inline-block;
    font-size: 0.14rem;
  }
}
.banner {
  height: 0;
  overflow: hidden;
  padding-bottom: 25.4%;
  &__img {
    width: 100%;
  }
}
// nav
.icons {
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.16rem;
  &__item {
    width: 20%;
    &__img {
      display: block;
      width: 0.4rem;
      height: 0.4rem;
      margin: 0 auto;
    }
    &__desc {
      margin: 0.06rem 0 0.16rem 0;
      text-align: center;
      color: $content-fontcolor;
    }
  }
}
.gap {
  margin: 0 -0.18rem;
  height: 0.1rem;
  background: $content-bgColor;
}
</style>
