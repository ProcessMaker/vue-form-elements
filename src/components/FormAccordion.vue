<template>
  <div>
    <button
      @click="showCollapse = !showCollapse"
      class="accordion-button text-left card-header d-flex align-items-center w-100"
      >
        <i
          v-if="config.icon"
          class="fas mr-1"
          :class="`fa-${config.icon}`"
        />

        <span class="button-label">{{ config.label }}</span>

        <i
          v-if="showCollapse"
          class="fas fa-chevron-down accordion-arrow ml-auto"
        />

        <i
          v-else
          class="fas fa-chevron-right accordion-arrow ml-auto"
        />
    </button>

    <b-collapse
      v-model="showCollapse"
      :id="'collapse-' + config.name"
    >
      <div v-for="element in items" :key="element.config.name">
        <component
          v-bind="element.config"
          :is="element.component"
          v-model="transientData[element.config.name]"
          class="pl-4 pr-4 pt-3 pb-3 border-bottom m-0"
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
      showCollapse: Boolean(this.config.initiallyOpen),
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

  .button-label {
    margin-right: auto;
    margin-left: 1rem;
  }
}
</style>
