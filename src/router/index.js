import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/", //默认指向路由
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/home/Home"),
  },
  {
    path: "/orderConfirm/:shopId",
    name: "OrderConfirm",
    component: () =>
      import(
        /* webpackChunkName: "orderConfirmation" */ "../views/orderConfirm/OrderConfirm"
      ),
  },
  {
    path: "/cartList",
    name: "CartList",
    component: () =>
      import(/* webpackChunkName: "cartList" */ "../views/cartList/CartList"),
    //进入前 先将orderAddress置空 防止用户进入下单页面时还在获取之前的数据
    beforeEnter() {
      localStorage.setItem("orderAddress", "");
    },
  },
  {
    path: "/orderList",
    name: "OrderList",
    component: () =>
      import(
        /* webpackChunkName: "orderList" */ "../views/orderList/OrderList"
      ),
  },
  {
    path: "/orderDetail",
    name: "OrderDetail",
    component: () =>
      import(
        /* webpackChunkName: "orderList" */ "../views/orderList/OrderDetail"
      ),
  },
  {
    path: "/my",
    name: "My",
    component: () => import(/* webpackChunkName: "my" */ "../views/my/My"),
  },
  {
    path: "/edit",
    name: "Edit",
    component: () => import(/* webpackChunkName: "edit" */ "../views/my/Edit"),
  },
  {
    path: "/editPassword",
    name: "EditPassword",
    component: () =>
      import(/* webpackChunkName: "edit" */ "../views/my/EditPassword"),
  },
  {
    path: "/wechatAuth",
    name: "WechatAuth",
    component: () =>
      import(/* webpackChunkName: "edit" */ "../views/my/WechatAuth"),
  },
  {
    path: "/shop/:id",
    name: "Shop",
    component: () =>
      import(/* webpackChunkName: "shop" */ "../views/shop/Shop"),
    //进入前 先将orderAddress置空 防止用户进入下单页面时还在获取之前的数据
    beforeEnter() {
      localStorage.setItem("orderAddress", "");
    },
  },
  {
    path: "/shopList/:cateId",
    name: "ShopList",
    component: () =>
      import(/* webpackChunkName: "shop" */ "../views/shop/ShopList"),
  },
  {
    path: "/address",
    name: "Address",
    component: () =>
      import(/* webpackChunkName: "address" */ "../views/address/Address"),
  },
  {
    path: "/addressAdd",
    name: "AddressAdd",
    component: () =>
      import(
        /* webpackChunkName: "addressAdd" */ "../views/address/AddressAdd"
      ),
  },
  {
    path: "/addressSave",
    name: "AddressSave",
    component: () =>
      import(
        /* webpackChunkName: "addressSave" */ "../views/address/AddressSave"
      ),
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/register/Register"),
    beforeEnter(to, from, next) {
      const { isLogin } = localStorage;
      isLogin ? next({ name: "Home" }) : next();
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login/Login"),
    //这里只限制在访问当前路由之前执行的逻辑
    beforeEnter(to, from, next) {
      const { isLogin } = localStorage;
      //如果登陆了，默认指向Home
      isLogin ? next({ name: "Home" }) : next();
    },
  },
  {
    path: "/loginMethod",
    name: "LoginMethod",
    component: () =>
      import(
        /* webpackChunkName: "loginMethod" */ "../views/login/LoginMethod"
      ),
    //这里只限制在访问当前路由之前执行的逻辑
    beforeEnter(to, from, next) {
      const { isLogin } = localStorage;
      //如果登陆了，默认指向Home
      isLogin ? next({ name: "Home" }) : next();
    },
  },
  {
    path: "/wechatLogin",
    name: "WechatLogin",
    component: () =>
      import(
        /* webpackChunkName: "loginMethod" */ "../views/login/WechatLogin"
      ),
    //这里只限制在访问当前路由之前执行的逻辑
    beforeEnter(to, from, next) {
      const { isLogin } = localStorage;
      //如果登陆了，默认指向Home
      isLogin ? next({ name: "Home" }) : next();
    },
  },
  {
    path: "/setUsername",
    name: "SetUsername",
    component: () =>
      import(/* webpackChunkName: "edit" */ "../views/login/SetUsername"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
//beforeEach表示访问所有路由之前都需要进行处理的逻辑
router.beforeEach((to, from, next) => {
  //是否登录
  const { isLogin } = localStorage;
  //前往的路由的名称
  const { name } = to;
  //无需登录即可访问的路由
  const list = [
    "Login",
    "Register",
    "LoginMethod",
    "WechatLogin",
    "SetUsername",
    "Home",
    "CartList",
    "Shop",
    "ShopList",
  ];
  //有返回值则为true 表示不需要登录 否则为false 需要登录
  const flag = list.indexOf(name) !== -1;

  // //next()表示继续执行，声明参数表示继续执行指定路径
  isLogin || flag ? next() : next({ name: "LoginMethod" });
});

export default router;
