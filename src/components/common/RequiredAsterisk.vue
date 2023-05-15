<template>
    <span v-if="$parent.required" :title="$t('required')" class="required-asterisk">*</span>
</template>

<style>
.required-asterisk {
  color: #dc3545;
  padding-right: 0.5em;
}
</style>