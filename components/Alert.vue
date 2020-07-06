<template>
  <div class="error" v-show="message">
    <div class="error__inner">
        <div class="error__ttl">
            <p>エラー</p>
            <div class="error__ttl-toggle" @click="deleteMessage">
                <span></span>
                <span></span>
            </div>
        </div>
        <div class="error__content">
            <p>{{ message }}</p>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters('alert', ['message'])
  },

  methods: {
    ...mapMutations('alert', ['deleteMessage'])
  }
}
</script>

<style lang="scss" scoped>
.error{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba($color: #000000, $alpha: .3);
    &__inner{
        position: fixed;
        width: 88%;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 99;
        max-width: 500px;
    }
    &__ttl{
        background: #f84e52;
        padding: 15px ;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p{
            color: #fff;
        }
        &-toggle{
        position: relative;
        top: 0;
        right: 0;
        width: 30px;
        height: 100%;
        transform: translateY(-50%);
            span {
                position: absolute;
                right: 0;
                width: 30px;
                height: 2px;
                transition: all .2s;
                background-color: #fff;
                border-radius: 2px;
                &:nth-of-type(1) {
                top: 0;
                transform: rotate(-45deg);
                }
                &:nth-of-type(2) {
                bottom: 0;
                transform:translateY(1px)  rotate(45deg);
                }
            }
        }
    }
    &__content{
        padding: 15px ;
        background: #fff1ef;
        border: 1px solid  #f84e52;
    }
}
</style>