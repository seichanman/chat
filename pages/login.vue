<template>
  <main class="container">
    <div class="login">
      <h2 class="login__ttl">ログイン</h2>
      <form class="login__btn" @submit.prevent="onSubmit">
          <button type="submit">Google でログイン</button>
      </form>
    </div>
  </main>
</template>

<script>
export default {
    middleware: ['checkLogin'],
    methods: {
        onSubmit() {
        //Google プロバイダ オブジェクトのインスタンスを作成
        const provider = new this.$firebase.auth.GoogleAuthProvider()
        //Firebase の Google ログイン用のプロバイダーを引数に signInWithRedirect関数を呼び出します。Redirect と名前にあるように、引数で受け取ったプロバイダーのログイン画面にリダイレクトします
        this.$fireAuth.signInWithRedirect(provider)
        }
    }
}
</script>

<style lang="scss">
.login{
    margin: 50px auto;
    background: #fff;
    max-width: 500px;
    backface-visibility: #fff;
    width: 100%;
    box-shadow: 0px 0px 16px -9px #888;
    padding: 60px;
    @include breakPoint(sp){
      width: 88%;
    }
    &__ttl{
      font-size: 2.6rem;
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #ddd;
      margin-bottom: 40px;
    }
    &__btn button{
      width:100%;
      background:#ca453c; 
      color: #fff;
      line-height: 50px;
      font-size: 1.6rem;
      cursor: pointer;
      transition: .1s;
      border: 1px solid #ca453c; 
      &:hover{
        color:  #ca453c;
        background: #fff;
      }
    }
}
</style>