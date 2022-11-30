import { useStore } from "vuex";
import { computed } from "vue";
// 购物车相关逻辑
export const useCommonCartEffect = (shopId) => {
  const store = useStore();
  const cartList = store.state.cartList;

  const changeCartItemInfo = (
    shopId,
    shopName,
    productId,
    productInfo,
    num
  ) => {
    store.commit("changeCartItemInfo", {
      shopId,
      shopName,
      productId,
      productInfo,
      num,
    });
  };

  const productList = computed(() => {
    const productList = cartList[shopId].productList || {};
    const notEmptyProductList = {};
    for (let i in productList) {
      const product = productList[i];
      if (productList[i] instanceof Object) {
        //即大于零，同时被选中
        if (product.count > 0) {
          notEmptyProductList[i] = product;
        }
      }
    }
    return notEmptyProductList;
  });

  const shopName = computed(() => {
    return cartList[shopId]?.shopName || "";
  });

  const calculations = computed(() => {
    const productList = cartList[shopId]?.productList;
    const result = { total: 0, price: 0, allChecked: true };
    if (productList) {
      for (let i in productList) {
        if (productList[i] instanceof Object) {
          const product = productList[i];
          result.total += product.count;
          if (product.check) {
            result.price += product.count * product.price;
          }
          if (product.count > 0 && !product.check) {
            result.allChecked = false;
          }
        }
      }
    }
    result.price = result.price.toFixed(2);
    return result;
  });

  return { cartList, calculations, productList, shopName, changeCartItemInfo };
};
