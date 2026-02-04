<script lang="ts">
  let count = 0
  const inc = () => count += 1
</script>

<button on:click={inc}>
  Count: {count}
</button>
