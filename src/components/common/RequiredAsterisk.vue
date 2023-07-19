<template>
    <span v-if="$parent.required" :title="$t('required')" class="required-asterisk">*</span>
</template>

<script>
export default {
  name: "RequiredAsterisk"
};
</script>

<style>
.required-asterisk {
  color: #dc3545;
  padding-right: 0.5em;
}

.conversational-chat .required-asterisk {
  display: none;
}
</style>