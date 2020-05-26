<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
export default {
  async mounted () {
    const res = await this.$http.get('/api/test')
    console.log(res)
  }
}
</script>
