<template>
  <div class="form-accordtion-container">
    <button
      @click="showCollapse = !showCollapse"
      class="accordion-buttontext-left card-header d-flex align-items-center w-100"
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

    <div class="accordion-wrapper">
      <b-collapse
        v-model="showCollapse"
        :id="'collapse-' + config.name"
        class="accordion"
      >
        <div v-for="element in items" :key="element.config.name">
          <component
            v-bind="element.config"
            :is="element.component"
            v-model="transientData[element.config.name]"
          />
        </div>
      </b-collapse>
    </div>
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
.form-accordtion-container {
  padding-bottom: 0.25rem;

  .accordion-button {
    cursor: pointer;
    outline: none;
    border: none;

    .button-label {
      margin-right: auto;
      margin-left: 1rem;
    }
  }

  .accordion-wrapper {
    padding: 0.5rem;
    padding-bottom: 0;
  }
}
</style>
