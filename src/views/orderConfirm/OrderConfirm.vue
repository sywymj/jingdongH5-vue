<template>
  <div class="wrapper">
    <ChooseAddress />
    <OrderProductList />
  </div>
</template>

<script>
import ChooseAddress from "./ChooseAddress";
import OrderProductList from "./OrderProductList";
export default {
  name: "OrderConfirm",
  components: { ChooseAddress, OrderProductList },
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #eee;
  overflow-y: scroll;
}
</style>
