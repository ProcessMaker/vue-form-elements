<template>
    <span v-if="$parent.required" :title="$t('required')" :class="classList">*</span>
</template>

<script>
export default {
  props: {
    toggleEnabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classList() {
      return {
        'required-asterisk': true,
        'toggle-enabled': this.toggleEnabled
      }
    }
  }
}
</script>
<style>
.required-asterisk {
  color: #dc3545;
  padding-right: 0.5em;
}

.required-asterisk.toggle-enabled {
  position:relative;
  left: -33px;
}

.conversational-chat .required-asterisk {
  display: none;
}
</style>