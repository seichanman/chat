<template>
    <main class="container">
        <div class="chat-talk">
            <div v-for="chat in chats" :key="chat.id">
                <!-- 自分の発言の場合 -->
                <template v-if="isMyChat(chat.userId)">
                    <div class="chat-talk__my">
                        <pre class="">{{ chat.body }}</pre>
                    </div>
                </template>
                <!-- 相手の発言の場合 -->
                <template v-else>
                    <div class="chat-talk__your">
                        <div class="chat-talk__your-img">
                            <img :src="chat.iconImageUrl" class="" />
                        </div>
                        <div class="chat-talk__your-inner">
                            <span class="chat-talk__your-name">{{ chat.name }}</span>
                            <div class="chat-talk__your-text">
                                <pre class="">{{ chat.body }}</pre>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="chat">
            <form
                @submit.prevent="onSubmit"
                class="">
                    <textarea
                    v-model="form.message.val"
                    placeholder="発言してみよう"
                    class="chat__text"
                    name="form.body"
                    />
                <button
                :disable="isValidateError"
                :class="{ 'text-blue': !isValidateError }"
                class="chat__post"
                >
                送信
                </button>
            </form>
        </div>
    </main>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    middleware: ['checkAuth'],
    data() {
        return {
        form: {
            message: {
            val: null
            }
        },
        unsubscribe: null
        }
    },
    computed: {
        ...mapGetters('chats', ['chats']),
        isValidateError() {
        return !this.form.message.val
        }
    },
    async asyncData({ store, params }) {
        const roomId = params.id
        const unsubscribe = await store.dispatch('chats/subscribe', { roomId })
        return {
        unsubscribe
        }
    },
    destroyed() {
    this.$store.dispatch('chats/clear')
    if (this.unsubscribe) this.unsubscribe()
    },
    methods: {
    ...mapMutations('alert', ['setMessage']),
    isMyChat(userId) {
        const { uid } = this.$fireAuth.currentUser
        return userId === uid
    },

    async onSubmit() {
      if (this.isValidateError) return

      const user = await this.$user()

      // 未ログインの場合
      if (!user) this.$router.push('/login')
      const roomId = this.$route.params.id

      // 登録データを準備
      const chat = {
        userId: user.uid,
        name: user.name,
        iconImageUrl: user.iconImageUrl,
        body: this.form.message.val,
        createdAt: this.$firebase.firestore.FieldValue.serverTimestamp()
      }

      try {
        await this.$firestore
          .collection('rooms')
          .doc(roomId)
          .collection('chats')
          .add(chat)
        this.resetForm()
        this.scrollBottom()
      } catch (e) {
        this.setMessage({ message: '登録に失敗しました。' })
      }
    },

    scrollBottom() {
      const element = document.documentElement
      const bottom = element.scrollHeight - element.clientHeight
      window.scroll(0, bottom)
    },

    resetForm() {
      this.form.message.val = null
    }
  }
}
</script>

<style lang="scss" scoped>
    .chat-talk{
        max-width: 500px;
        margin: 0 auto 100px;
        overflow: auto;
        &__my{
            display: flex;
            justify-content: flex-end;
            margin-bottom: 10px;
            pre{
                white-space: break-spaces;
                background: #a1c0fa;
                padding: 15px;
                border-top-right-radius: 20px;
                border-top-left-radius: 20px;
                border-bottom-left-radius: 20px;
                display: inline-block;
            }
        }
        &__your{
            display: flex;
            &-img img{
                width: 40px;
                height: 40px;
                object-fit: cover;
                border-radius: 50%;
            }
            &-inner{
                flex: 1;
                margin-left: 20px;
                margin-bottom: 10px;
            }
            &-name{
                margin-bottom: 5px;
                display: inline-block;
            }
            &-text{
                width: 100%;
                pre{
                white-space: break-spaces;
                background: #ddd;
                padding: 15px;
                border-top-right-radius: 20px;
                border-bottom-right-radius: 20px;
                border-bottom-left-radius: 20px;
                display: inline-block;
                }
            }
        }
    }
    .chat{
        border-top: 1px solid #ddd;
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        padding: 20px 6%;
        background: #fff;
        form{
            display: flex;
            align-items: center;
            max-width: 500px;
            margin: 0 auto;
        }
        &__text{
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 10px;
            width: 80%;
        }
        &__post{
            margin-left: 15px;
        }
    }
</style>