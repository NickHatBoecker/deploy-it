<template>
    <div>
        <b-table
            :fields="fields"
            :items="items"
            class="bg-primary"
            striped
            hover
            dark
        >
            <template #cell(actions)="data">
                <b-button
                    variant="outline-primary"
                    class="me-1"
                    title="Show deploy instructions"
                    @click="showDeployInstructions(data.item)"
                >
                    <span class="bi-info-circle" />
                </b-button>

                <b-button
                    :variant="`outline-${getDeployButtonColor(data.item)}`"
                    :title="data.item.deployTitle || 'Deploy'"
                    :disabled="!! currentlyDeployingItem"
                    @click="deployProject(data.item)"
                >
                    <span :class="`bi-${getDeployButtonIcon(data.item)}`" />
                </b-button>
            </template>
        </b-table>

        <instructions-dialog
            v-model="showInstructions"
            :item="selectedItem"
        />
    </div>
</template>

<script>
import InstructionsDialog from './InstructionsDialog'

const { exec } = require('child_process')

export default {
    name: 'ItemList',

    components: { InstructionsDialog },

    props: {
        /**
         * { name, method, deployTitle, deployScript }
         */
        items: { type: Array, default: () => [] },
    },

    data: () => ({
        fields: [
            { key: 'name', label: 'Project', class: 'text-center' },
            { key: 'method', label: 'Method', class: 'text-center' },
            { key: 'actions', label: 'Actions', class: 'text-center', sortable: false },
        ],

        currentlyDeployingItem: null,
        selectedItem: null,
        showInstructions: false,
    }),

    methods: {
        deployProject (item) {
            if (this.currentlyDeployingItem) return

            this.currentlyDeployingItem = item.name

            const env = process.env
            env.PATH = `${env.PATH}:/usr/local/bin`

            exec(item.deployScript, { env }, (error) => {
                if (error) alert(error)
                this.currentlyDeployingItem = null
            })
        },

        showDeployInstructions (item) {
            this.selectedItem = item
            this.showInstructions = true
        },

        getDeployButtonColor (item) {
            if (this.currentlyDeployingItem && this.currentlyDeployingItem !== item.name) {
                return 'dark'
            }

            if (this.currentlyDeployingItem && this.currentlyDeployingItem === item.name) {
                return 'danger'
            }

            return 'success'
        },

        getDeployButtonIcon (item) {
            if (this.currentlyDeployingItem && this.currentlyDeployingItem === item.name) {
                return 'three-dots'
            }

            return 'play'
        },
    },
}
</script>

<style lang="scss" scoped>
</style>
