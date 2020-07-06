<template>
  <div>
    <Header />
    <Alert />
    <nuxt />
  </div>
</template>

<script>
import Header from '~/components/Header'
import Alert from '~/components/Alert'

export default {
  components: {
    Header,
    Alert
  }
}
</script>>