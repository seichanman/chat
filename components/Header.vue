<template>
  <header class="header">
      <template v-if="isChatPage">
        <nuxt-link to="/" class="">
          <div class="header__arrow"></div>
        </nuxt-link>
      </template>
      <h1 class="header__logo">
        <img src="~/static/images/logo-text.svg" alt="">
      </h1>
  </header>
</template>

<style lang="scss">
.header{
  background-image: linear-gradient(45deg, #569dea 0%, #0062cc 95%);
  position: relative;
  &__logo{
    padding: 20px 8%;
    img{
      margin: 0 auto;
      @include breakPoint(sp){
        max-width: 180px;
      }
    }
  }
  &__arrow{
    position: absolute;
    top: 50%;
    left: 40px;
    transform:translate(-50%,-50%) rotate(-45deg);
    width: 12px;
    height: 12px;
    border-left: 2px solid#fff;
    border-top: 2px solid #fff;
  }
}
</style>
<script>
export default {
  computed: {
   isChatPage() {
     return this.$route.path.match(/\/rooms\/[A-Za-z0-9]*/)
   }
  }
}
</script>