<template>
    <b-modal
            v-model="show"
            header-bg-variant="dark"
            header-text-variant="primary"
            body-bg-variant="dark"
            body-text-variant="light"
            hide-footer
    >
        <template #modal-header="{ close }">
            <h5>{{ item.name }}</h5>
            <b-button size="lg" variant="link" title="Close" @click="close()">
                <span class="bi-x-circle" />
            </b-button>
        </template>

        <template v-if="item">
            <p>Following code will be executed on deployment:</p>
            <pre class="bg-primary text-dark px-3 py-4">{{ item.deployScript }}</pre>
        </template>
        <p v-else>No item selected</p>
    </b-modal>
</template>

<script>
    export default {
        name: 'InstructionsDialog',

        props: {
            value: { type: Boolean, required: true },

            /**
             * { name, method, deployTitle, deployScript }
             */
            item: { type: Object, default: null },
        },

        data: () => ({ show: false }),

        watch: {
            value () {
                this.show = this.value
            },

            show () {
                this.$emit('input', this.show)
            },
        },
    }
</script>

<style lang="scss" scoped>
</style>
