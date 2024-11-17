<template>
    <div id="app">
        <navbar @openSettings="showSettingsModal = true" />

        <div style="padding: 0 24px; margin-bottom: 12px;">
            <input v-model="searchTerm" type="text" placeholder="Search" style="width: 100%;" />
        </div>

        <item-list :items="filteredProjects" />
        <settings-dialog
            v-model="showSettingsModal"
            :projects-path="projectsPath"
            @save="saveSettings"
        />
    </div>
</template>

<script>
import Navbar from './components/Navbar'
import ItemList from './components/ItemList'
import SettingsDialog from './components/SettingsDialog'

const STORAGE_PROJECTS_PATH = 'nhb_deployit.projects_path'

export default {
    name: 'deploy-it',

    components: { ItemList, Navbar, SettingsDialog },

    data: () => ({
        projects: [],
        projectsPath: null,
        showSettingsModal: false,
        searchTerm: '',
    }),

    computed: {
        filteredProjects () {
            return this.projects.filter(x => {
                if (this.searchTerm) {
                    const lowerQuery = this.searchTerm.toLowerCase()
                    if (!x.name.toLowerCase().includes(lowerQuery)) return false
                }

                return true
            })
        },
    },

    async mounted () {
        if (localStorage.getItem(STORAGE_PROJECTS_PATH)) {
            this.projectsPath = localStorage.getItem(STORAGE_PROJECTS_PATH)
            await this.fetchProjects()
        } else {
            this.showSettingsModal = true
        }
    },

    methods: {
        async fetchProjects () {
            const that = this
            const fs = require('fs')

            if (!this.projectsPath) {
                return
            }

            fs.readFile(this.projectsPath, 'utf8', (error, content) => {
                if (error) {
                    console.log(error)
                    return
                }

                that.projects = (JSON.parse(content)).filter(x => {
                    if (typeof x.active === 'undefined') return true
                    return x.active
                })
            })
        },

        saveSettings (projectsPath) {
            localStorage.setItem(STORAGE_PROJECTS_PATH, projectsPath)

            this.projectsPath = projectsPath
            this.showSettingsModal = false
            this.fetchProjects()
        },
    },
}
</script>
