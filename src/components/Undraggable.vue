<template>
  <div @dragstart="prevent" @dragover="prevent">
    <slot />
  </div>
</template>

<script>
export default {
  methods: {
    prevent(event) {
      event.preventDefault();
    },
  },
};
</script>
