<template>
    <main class="container">
        <div class="register">
            <h2 class="register__ttl">アカウント登録</h2>
            <form class="register__box" @submit.prevent="onSubmit">
                <div class="register__imgBox">
                    <template v-if="form.imageUrl.val">
                        <img class="register__imgBox-img" :src="form.imageUrl.val" @click="selectImage"/>
                    </template>
                    <template v-else>
                        <div :class="{ 'border-red': form.imageUrl.errorMessage }"  class="register__imgBox-icon">
                            <img src="~/static/images/icon.svg" @click="selectImage">
                        </div>
                    </template>

                    <input @change="onSelectFile"
                    ref="image"
                    type="file"
                    style="display: none"
                    accept="image/*"/>
                    <span v-show="form.imageUrl.errorMessage" class="register__imgBox-note">
                        {{form.imageUrl.errorMessage}}
                    </span>
                </div>

                <div class="register__user">
                    <label class="register__user-name">名前</label>
                    <div class="register__user-text">
                        <input v-model="form.name.val" :class="{ 'border-red': form.name.errorMessage }" type="text" class=""
                        @blur="validateName"/>
                        <span v-show="form.name.errorMessage" class="">{{
                            form.name.errorMessage
                        }}</span>
                    </div>
                </div>

                <div class="register__btn">
                    <button>登録</button>
                </div>
            </form>
        </div>
    </main>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
    middleware: ['checkRegister'],
    data() {
    return {
        form: {
        name: {
            label: '名前',
            val: null,
            errorMessage: null
        },
        imageUrl: {
            label: 'アイコン画像',
            val: null,
            errorMessage: null
        }
        }
    }
    },
    computed: {
    isValidateError() {
        return this.form.name.errorMessage || this.form.imageUrl.errorMessage
        }
    },
    methods: {
        ...mapMutations('alert', ['setMessage']),
        //ref='image'をクリックしたことになる
        selectImage() {
            this.$refs.image.click()
        },
        //画像を選択したタイミングで下記が発火
        onSelectFile(e) {
            const files = e.target.files
            //ファイルが空だった場合値を返す
            if (files.length === 0) return
            const reader = new FileReader()
            //readAsDataURL() = 指定された File オブジェクトを読み込む
            reader.readAsDataURL(files[0])
            //addEventListener() = 特定のイベントが対象に配信されるたびに呼び出される関数を設定
            reader.addEventListener('load', () => {
                //データをアップロード
                this.upload({
                localImageFile: files[0]
                })
            })
        },
        //画像のアップロード処理
        async upload({ localImageFile }) {
            const user = await this.$auth()
            
            // 未ログインの場合
            if (!user) this.$router.push('/login')

            // // ストレージオブジェクト作成
            const storageRef = this.$fireStorage.ref()

            // ファイルのパスを設定
            const imageRef = storageRef.child(
                `images/${user.uid}/${localImageFile.name}`
            )

            // ファイルを適用してファイルアップロード開始
            const snapShot = await imageRef.put(localImageFile)
            this.form.imageUrl.val = await snapShot.ref.getDownloadURL()

            this.validateImageUrl()
        },
        //↓↓バリデーション記述↓↓
        validateName() {
            const { name } = this.form
            const maxLength = 8
                if (!name.val) {
                    name.errorMessage = `${name.label}は必須入力項目です`
                    return
                }
                if (name.val.length > maxLength) {
                name.errorMessage = `${name.label}は${maxLength}文字以内です。`
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
            const user = await this.$auth()
            // 未ログインの場合
            if (!user) this.$router.push('/login')

            this.validateName()
            this.validateImageUrl()

            if (this.isValidateError) return
            try {
            await this.$firestore
                .collection("users")
                .doc(user.uid)
                .set({
                name: this.form.name.val,
                iconImageUrl: this.form.imageUrl.val
                })
            this.$router.push('/')
            } catch (e) {
            this.setMessage({ message: '登録に失敗しました。' })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.register{
    background: #fff;
    margin: 0 auto;
    max-width: 500px;
    backface-visibility: #fff;
    width: 100%;
    box-shadow: 0px 0px 16px -9px #888;
    padding: 60px;
    @include breakPoint(sp){
      width: 100%;
      padding: 30px 6%;
    }
    &__box{
        margin-top: 30px
    }
    &__ttl{
        font-size: 2.6rem;
        text-align: center;
    }
    &__imgBox{
        &-img{
            width: 250px;
            height: 250px;
            border-radius: 100%;
            object-fit: cover;
            margin: 0 auto;
            @include breakPoint(sp){
                width: 150px;
                height: 150px;
            }
        }
        &-note{
            text-align: center;
            display: block;
            color: red;
            margin: 5px auto 0;
        }
        &-icon{
            width: 250px;   
            height: 250px;
            background:#e8edf3 ;
            border-radius: 100%;
            object-fit: cover;
            margin: 0 auto;
            border: 1px solid #b5c2e4;
            position: relative;
            @include breakPoint(sp){
                width: 150px;
                height: 150px;
            }
            img{
                width: 130px;
                position: absolute;
                transform: translate(-50%,-50%);
                top: 50%;
                left: 50%;
                @include breakPoint(sp){
                    width: 80px;
                }
            }
        }
    }
    &__user{
        margin-top: 30px;
        &-text {
            input{
            display: block;
            width: 100%;
            margin-top: 5px;
            background: #e8edf3;
            font-size: 2rem;
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

    }
    &__btn button{
        width: 100%;
        margin-top: 50px;
        background-image: linear-gradient(45deg, #b6dcff 0%, #b9b6e5 95%);
        color: #fff;
        text-align: center;
        line-height: 50px;
        border-radius: 25px;
        font-size: 1.6rem;
    }
}
</style>
