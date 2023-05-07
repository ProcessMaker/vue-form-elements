<template>
    <div>
        <b-dropdown id="dropdown-1" text="Dropdown Button BootstrapVue" class="m-md-2">
            <b-dropdown-item>First Action</b-dropdown-item>
            <b-dropdown-item>Second Action</b-dropdown-item>
            <b-dropdown-item>Third Action</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item active>Active action</b-dropdown-item>
            <b-dropdown-item disabled>Disabled action</b-dropdown-item>
        </b-dropdown>
    </div>
</template>
<script>
export default {
    setup() {},
    data() {
        return {};
    }
};
</script>
<style scoped>
</style>