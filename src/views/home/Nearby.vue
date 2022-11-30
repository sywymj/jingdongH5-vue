<template>
  <!-- 主体内容 -->
  <div class="nearby">
    <h3 class="nearby__title">热门店铺</h3>
    <router-link
      :to="`/shop/${item.id}`"
      v-for="item in nearbyList"
      :key="item.id"
    >
      <ShopInfo :item="item" />
    </router-link>
    <Toast v-if="show" :message="toastMessage" />
    <div class="load-more" v-if="flag" @click="loadMore">点击加载更多</div>
    <div class="load-more" v-else>没有更多了</div>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import request from "../../utils/request";
import ShopInfo from "../../components/ShopInfo";
import Toast, { useToastEffect } from "../../components/Toast";

const useNearbyListEffect = (showToast) => {
  const nearbyList = ref([]);
  const page = ref(1);
  const size = 10;
  const flag = ref(true);

  const getNearbyList = async () => {
    const result = await request.get("/home/hotShops", {
      state: 1,
      page: page.value,
      size: size,
    });
    if (result.message === "success" && result.data.length > 0) {
      nearbyList.value = [...nearbyList.value, ...result.data];
      if (result.data.length >= size && page.value >= 2) {
        showToast("加载更多...");
      } else if (result.data.length < size) {
        flag.value = false;
        showToast("没有更多了");
      }
    }
  };

  //不需要指定监听的属性,当page.value属性变更的时候，这个回调都会执行
  watchEffect(() => {
    getNearbyList();
  });

  //这里需要定义page分页的发生变化
  const loadMore = () => {
    page.value++;
  };

  return { nearbyList, loadMore, flag };
};

export default {
  name: "Nearby",
  components: { ShopInfo, Toast },
  setup() {
    const { show, toastMessage, showToast } = useToastEffect();
    const { nearbyList, loadMore, flag } = useNearbyListEffect(showToast);

    return { nearbyList, loadMore, flag, show, toastMessage };
  },
};
</script>

<style lang="scss" scoped>
@import "@/style/variables.scss";
// 主体内容
.nearby {
  &__title {
    margin: 0.16rem 0 0.02rem 0;
    font-size: 0.18rem;
    font-weight: normal;
    color: $content-fontcolor;
  }
  a {
    text-decoration: none;
  }
}
.load-more {
  margin: 0.16rem 0 0.1rem 0;
  text-align: center;
  height: 0.1rem;
  line-height: 0.1rem;
  color: $content-fontcolor;
}
</style>
