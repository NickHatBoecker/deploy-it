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
            <h5>Settings</h5>
            <b-button size="lg" variant="link" title="Close" @click="close()">
                <span class="bi-x-circle" />
            </b-button>
        </template>

        <p color="grey">Please provide absolute path to projects.json file. You can find more information on <a href="https://github.com/theskyliner/deploy-it/" target="_blank" rel="noopener">GitHub</a>.</p>
        <div class="mb-3">
            <b-form-input v-model="projectsPathField" placeholder="Enter path to projects.json" />
        </div>

        <div class="d-grid">
            <b-button
                type="button"
                variant="primary"
                block
                @click="$emit('save', projectsPathField)"
            >Save</b-button>
        </div>
    </b-modal>
</template>

<script>
export default {
    name: 'SettingsDialog',

    props: {
        value: { type: Boolean, required: true },
        projectsPath: { type: String, default: null },
    },

    data: () => ({ show: false, projectsPathField: null }),

    watch: {
        value () {
            this.show = this.value
        },

        show () {
            this.$emit('input', this.show)
        },

        projectsPath () {
            this.projectsPathField = this.projectsPath
        },
    },

    mounted () {
        this.projectsPathField = this.projectsPath
    },
}
</script>

<style lang="scss" scoped>
</style>
