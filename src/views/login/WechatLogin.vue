<script>
import { useRouter } from "vue-router";
import request from "@/utils/request";

export default {
  name: "WechatLogin",
  created() {
    this.getAuthorize();
  },
  methods: {
    getAuthorize() {
      //先判断有没有授权(判断地址栏code，有就-用户同意了授权，没有-没授权或者拒绝授权)
      var code = this.getUrlParam("code");
      const router = useRouter();
      if (code != null) {
        //code有值 传递给后端获取用户信息
        const handleWeChatLogin = async () => {
          const result = await request.post("/user/wechatLogin", {
            code: code,
          });
          if (result.message == "success" && result.code == 0) {
            //保存用户信息及登陆状态
            localStorage.userInfo = JSON.stringify(result.data);
            if (result.data.username) {
              //如果已有用户名 说明已注册并绑定微信 直接去首页
              localStorage.isLogin = true;
              router.push({ name: "Home" });
            } else {
              //否则 前往组件先设置用户名
              router.push({ name: "SetUsername" });
            }
          }
        };
        handleWeChatLogin();
      } else {
        //code没有值 跳转微信授权页面获取授权code
        var appid = "wx680e2c1d87e8226c";
        var redirect_uri = "https://www.gaoshiyi.top/wechatLogin";
        var newRedirect = encodeURIComponent(redirect_uri);
        window.location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
          appid +
          "&redirect_uri=" +
          newRedirect +
          "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
      }
    },

    //根据正则获取微信端回传的code参数
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null; //返回参数值
    },
  },
};
</script>
