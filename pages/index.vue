<template>
  <main class="container">
    <div class="room">
      <div v-for="room in rooms"
          :key="room.id"
          @click="moveToRoomPage(room.id)"
          class="room__item">
          <img
            :src="room.topImageUrl"
            class="room__item-img"
          />
          <p class="room__item-text">{{ room.name }}</p>
      </div>
    </div>
    <!-- ルーム作成ボタン -->
    <div class="create-btn" @click="openModal">
      <span></span>
      <span></span>
    </div>
    <!-- ルーム作成Modal -->
    <ModalBase v-if="isCreateMode" @closeModal="closeModal">
      <CreateRoomModal @closeModal="closeModal" />
    </ModalBase>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import ModalBase from '~/components/ModalBase'
import CreateRoomModal from '~/components/CreateRoomModal'

export default {
  middleware: ['checkAuth'],
  components: {
    ModalBase,
    CreateRoomModal
  },

  data() {
    return {
      isCreateMode: false,
      unsubscribe: null
    }
  },
  computed: {
    ...mapGetters('rooms', ['rooms'])
  },
  async asyncData({ store }) {
    const unsubscribe = await store.dispatch('rooms/subscribe')
    return {
      unsubscribe
    }
  },

  destroyed() {
    this.$store.dispatch('rooms/clear')
    if (this.unsubscribe) this.unsubscribe()
  },

  methods: {
    moveToRoomPage(roomId) {
      this.$router.push(`/rooms/${roomId}`)
    },
    openModal() {
      this.isCreateMode = true
    },
    closeModal() {
      this.isCreateMode = false
    }
  }
}
</script>

<style lang="scss" scoped>
.create-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
      background: linear-gradient(45deg, #569dea 0%, #0062cc 95%);
  border-radius: 50%;
  span {
    position: absolute;
    right: 0;
    width: 30px;
    height: 2px;
    transition: all .2s;
    background-color: #fff;
    border-radius: 2px;
    &:nth-of-type(1) {
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    }
    &:nth-of-type(2) {
    top: 50%;
    left: 50%;
    transform:translateY(-50%) translateX(-50%) rotate(90deg);
    }
  }
}

.room{
  max-width: 500px;
  margin: 0 auto;
  &__item{
    background: #fff;
    box-shadow: 0px 0px 16px -9px #888;
    border-radius: 5px;
    display: flex;
    padding: 20px;

    &-img{
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 50%;
    }
    &-text{
      margin-left: 20px;
      font-size: 1.8rem;
    }
    &:nth-child(n + 2){
      margin-top: 15px;
    }
  }
}
</style>