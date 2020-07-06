//プロジェクトの設定の一番下の箇所のCDN箇所参照
//firebaseをインポート
import firebase from 'firebase/app'
//firebaseのfiresotreというサービスをインポート
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

import config from '~/firebaseConfig.json'

if (!firebase.apps.length) {
  firebase.initializeApp({ ...config })
}
//...スプレッド構文 = 配列やオブジェクトの要素を文字通り展開する構文
//要はいちいちimportしなくても使用できるようにしている
//https://qiita.com/ono-ta/items/9f2fc82882d367da220e
export default ({ app }, inject) => {
  inject('firebase', firebase)
  inject('firestore', firebase.firestore())
  inject('fireAuth', firebase.auth())
  inject('fireStorage', firebase.storage())
}