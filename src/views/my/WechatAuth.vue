<script>
import { useRouter } from "vue-router";
import request from "@/utils/request";

export default {
  name: "WechatLogin",
  data() {
    return {
      code: "",
    };
  },
  created() {
    this.getAuthorize();
  },
  methods: {
    getAuthorize() {
      //先判断有没有授权(判断地址栏code，有就-用户同意了授权，没有-没授权或者拒绝授权)
      const code = this.getUrlParam("code");
      const router = useRouter();
      if (code != null) {
        //获取用户信息缓存
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        //传递给后端绑定微信账号
        const handleWeChatAuth = async () => {
          const result = await request.post("/user/bindWechat", {
            id: userInfo.id,
            code: code,
          });
          if (result.message === "success" && result.code === 0) {
            //保存用户信息及登陆状态
            localStorage.userInfo = JSON.stringify(result.data);
          }
          await router.push({ name: "My" });
        };
        handleWeChatAuth();
      } else {
        //code没有值 跳转微信授权页面获取授权code
        const appid = "wx680e2c1d87e8226c";
        const redirect_uri = "https://www.gaoshiyi.top/wechatAuth";
        const newRedirect = encodeURIComponent(redirect_uri);
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
      const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      const r = window.location.search.slice(1).match(reg);
      if (r != null) {
        return decodeURI(r[2]);
      }
      return null; //返回参数值
    },
  },
};
</script>
