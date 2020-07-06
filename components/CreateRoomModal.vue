<template>
  <div class="modal">
    <form @submit.prevent="onSubmit">
        <div>
            <div class="modal__imgBox" :class="{ 'border-red': form.imageUrl.errorMessage }">
                <template v-if="form.imageUrl.val">
                    <img
                    :src="form.imageUrl.val"
                    @click="selectImage"
                    class="modal__imgBox-img"/>
                </template>
                <template v-else>
                <figure @click="selectImage" class="modal__imgBox-icon">
                    <img src="~/static/images/img.svg" alt="">
                </figure>
                </template>
                <input
                ref="image"
                @change="onFileSelect"
                type="file"
                style="display: none"
                accept="image/*"
                />
            </div>
            <span
            v-show="form.imageUrl.errorMessage"
            class="modal__imgBox-note"
            >
                {{ form.imageUrl.errorMessage }}
            </span>
        </div>
        
        <div class="modal__room">
            <textarea
                v-model="form.name.val"
                @blur="validateName"
                :class="{ 'border-red-500': form.name.errorMessage }"
                placeholder="部屋の名前を入力しよう！"
                class=""
                maxlength="mexLength"
            />
            <span v-show="form.name.errorMessage">
                {{ form.name.errorMessage }}
            </span>
        </div>

        <div class="modal__btn">
        <button class=""
        >
            作成
        </button>
        </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.modal{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background: #fff;
    margin: 0 auto;
    max-width: 500px;
    backface-visibility: #fff;
    width: 88%;
    padding: 30px;
    border-radius: 20px;
    &__imgBox{
        background:$color-light-base ;
        width: 200px;
        height: 200px;
        margin:  0 auto;
        overflow: hidden;
        border-radius: 20px;
        &-img{
            width: 200px;
            height: 200px;
            object-fit: cover;
        }
        &-icon{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            img{
                max-width: 70px;
            }
        }
        &-note{
            text-align: center;
            display: block;
            color: red;
            margin: 5px auto 0;
        }
    }
    &__room{
    margin-top: 30px;
        textarea{
        display: block;
        width: 100%;
        margin-top: 5px;
        background: #e8edf3;
        font-size: 1.6rem;
        padding: 10px;
        border-radius: 5px;
        box-sizing: border-box;
        }
        span{
            display: block;
            margin-top: 5px;
            color: red;
        }
    }
    &__btn button{
    width: 100%;
    margin-top: 30px;
    background-image: linear-gradient(45deg, #b6dcff 0%, #b9b6e5 95%);
    color: #fff;
    text-align: center;
    line-height: 50px;
    border-radius: 25px;
    font-size: 1.6rem;
    }
}
</style>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      form: {
        name: {
          label: '名前',
          val: null,
          errorMessage: null
        },
        imageUrl: {
          label: '画像',
          val: null,
          errorMessage: null
        }
      }
    }
  },

  computed: {
    isValidateError() {
      return this.form.name.errorMessage || this.form.imageUrl.errorMessage
    },

    maxLength() {
      return 35
    }
  },

  methods: {
    ...mapMutations('alert', ['setMessage']),

    selectImage() {
      this.$refs.image.click()
    },

    onFileSelect(e) {
      const files = e.target.files
      if (files.length === 0) return

      const reader = new FileReader()
      reader.readAsDataURL(files[0])

      reader.addEventListener('load', () => {
        this.upload({
          localImageFile: files[0]
        })
      })
    },

    // 画像アップロード処理
    async upload({ localImageFile }) {
      const user = await this.$auth()

      // 未ログインの場合
      if (!user) this.$router.push('/login')

      // ストレージオブジェクト作成
      const storageRef = this.$fireStorage.ref()

      // ファイルのパスを設定
      const imageRef = storageRef.child(
        `images/${user.uid}/rooms/${localImageFile.name}`
      )

      // ファイルを適用してファイルアップロード開始
      const snapShot = await imageRef.put(localImageFile)
      this.form.imageUrl.val = await snapShot.ref.getDownloadURL()

      this.validateImageUrl()
    },

    validateName() {
      const { name } = this.form

      if (!name.val) {
        name.errorMessage = `${name.label}は必須入力項目です`
        return
      }

      if (name.val.length > this.maxLength) {
        name.errorMessage = `${name.label}は${this.maxLength}文字以内です。`
        return
      }

      name.errorMessage = null
    },

    validateImageUrl() {
      const { imageUrl } = this.form

      if (!imageUrl.val) {
        imageUrl.errorMessage = `${imageUrl.label}は必須入力項目です`
        return
      }

      imageUrl.errorMessage = null
    },

    async onSubmit() {
      // 認証チェック
      const user = this.$auth.currentUser
      if (!user) this.$router.push('/login')

      // 入力値チェック
      this.validateName()
      this.validateImageUrl()
      if (this.isValidateError) return

      // 登録データを準備
      const params = {
        name: this.form.name.val,
        topImageUrl: this.form.imageUrl.val,
        createdAt: this.$firebase.firestore.FieldValue.serverTimestamp()
      }

      try {
        await this.$firestore.collection('rooms').add(params)
        this.$emit('closeModal')
      } catch (e) {
        this.setMessage({ message: '登録に失敗しました。' })
      }
    }
  }
}
</script>