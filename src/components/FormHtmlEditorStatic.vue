<template>
    <div>
        <span v-html="value"></span>
    </div>
</template>

<script>
export default {
    props: ['value']
}
</script>