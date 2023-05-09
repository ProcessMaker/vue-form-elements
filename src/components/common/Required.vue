<template>
    <span v-if="$parent.required" class="required-indicator">*</span>
</template>

<style>
.required-indicator {
  color: #dc3545;
  padding-right: 0.5em;
}
</style>