<template>
  <div>
    <button
      class="accordion-button text-left card-header d-flex align-items-center w-100 pl-3"
      @click="visible = !visible"
      >
        <i
          v-if="config.icon"
          class="fas mr-1 fa-fw"
          :class="`fa-${config.icon}`"
        />

        <span class="ml-1 mr-auto">{{ config.label }}</span>

        <i v-if="visible" class="fas fa-chevron-down accordion-arrow ml-auto" />
        <i v-else class="fas fa-chevron-right accordion-arrow ml-auto" />
    </button>

    <b-collapse v-model="visible">
      <div v-for="element in items" :key="element.config.name">
        <component
          v-bind="element.config"
          :is="element.component"
          v-model="transientData[element.config.name]"
          class="pl-3 pr-3 pt-2 pb-2 border-bottom m-0"
        />
      </div>
    </b-collapse>
  </div>
</template>

<script>
export default {
  props: ['transientData', 'value', 'name', 'config', 'selected'],
  data() {
    return {
      visible: Boolean(this.config.initiallyOpen),
      items: [],
    }
  },
  watch: {
    value: {
      handler() {
        this.items = this.value;
      },
      immediate: true,
    },
    items() {
      this.$emit('input', this.items);
    },
  },
}
</script>

<style scoped lang="scss">
.accordion-button {
  cursor: pointer;
  outline: none;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

</style>
