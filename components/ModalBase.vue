<template>
  <transition appear>
    <div>
        <div class="modal-bg" @click="$emit('closeModal')"></div>
        <!-- ここにModalの中身が入る -->
        <slot />
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.v-leave-active,
.v-enter-active {
  transition: opacity 0.4s ease-out;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-enter-to,
.vleave {
  opacity: 1;
}

.modal-bg{
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
}
.modal-close{
    position: fixed;
    margin: 10px auto;
    width: 60px;
    height: 60px;
    bottom:150px;
    left: 50%;
    background: #fff;
    border-radius: 50%;
    transform: translateX(-50%);
    @include breakPoint(sp){
       bottom:5%; 
    }
    &::before,&::after{
        content: "";
        left: 20%;
        position: absolute;
        width: 60%;
        height: 2px;
        background-color: $color-base;
    }
    &::before{
        transform:rotate(45deg);
    }
    &::after{
        transform:rotate(-45deg);
    }
}
</style>