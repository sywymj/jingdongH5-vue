import { createStore } from "vuex";

const setLocalCartList = (state) => {
  const { cartList } = state;
  const cartListString = JSON.stringify(cartList);
  localStorage.setItem("cartList", cartListString);
};

const getLocalCartList = () => {
  return JSON.parse(localStorage.getItem("cartList")) || {};
};

export default createStore({
  state: {
    //定义data数据
    cartList: getLocalCartList(),
  },
  mutations: {
    //同步的方法
    changeCartItemInfo(state, payload) {
      //获取提交的信息
      const { shopId, shopName, productId, productInfo } = payload;

      //查询该店铺购物车中已有的数据
      let shopInfo = state.cartList[shopId];
      if (!shopInfo) {
        //如果没有 则新建一个
        shopInfo = { shopName: shopName, productList: {} };
      }
      //查看购物车中是否已有此产品
      let product = shopInfo.productList[productId];
      if (!product) {
        //同样 如果没有 则赋值提交的信息 数量先为0
        product = productInfo;
        product.count = 0;
      }
      //计算最终的商品数量
      product.count = product.count + payload.num;
      if (payload.num > 0) {
        product.check = true;
      }
      if (product.count < 0) {
        product.count = 0;
      }

      //赋值计算好的数据
      shopInfo.productList[productId] = product;
      state.cartList[shopId] = shopInfo;
      //保存
      setLocalCartList(state);
    },
    changeCartItemChecked(state, payload) {
      const { shopId, productId } = payload;
      const product = state.cartList[shopId].productList[productId];
      product.check = !product.check;
      setLocalCartList(state);
    },
    cleanCartProducts(state, payload) {
      const { shopId } = payload;
      state.cartList[shopId] = {};
      delete state.cartList[shopId];
      setLocalCartList(state);
    },
    setCartItemsChecked(state, payload) {
      const { shopId } = payload;
      const products = state.cartList[shopId].productList;
      if (products) {
        for (let key in products) {
          if (products[key] instanceof Object) {
            products[key].check = true;
          }
        }
      }
    },
    clearCartData(state, shopId) {
      state.cartList[shopId] = {};
      delete state.cartList[shopId];
      setLocalCartList(state);
    },
    //处理
  },
  actions: {
    //异步方法，请求接口的数据，在这里进行操作  地址
    test(state, param) {
      console.log(state);
      console.log(param);
    },
  },
  modules: {},
});
