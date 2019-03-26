<template>
    <div data-app>
        <v-toolbar color="blue darken-3" dark app fixed>
            <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
                <span class="hidden-sm-and-down">Deploy-it!</span>
            </v-toolbar-title>
            <!--<v-text-field
                    flat
                    solo-inverted
                    hide-details
                    prepend-inner-icon="search"
                    label="Search project"
                    class="hidden-sm-and-down"
            ></v-text-field>-->
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon @click="showSettingsModal = true">settings</v-icon>
            </v-btn>
            <v-btn icon>
                <v-icon @click="fetchProjects()" title="Refresh projects">refresh</v-icon>
            </v-btn>
        </v-toolbar>

        <v-container>
            <v-data-table
                    :headers="headers"
                    :items="projects"
                    hide-actions
                    item-key="name"
                    class="mt--large"
            >
                <template v-slot:items="props">
                    <td class="text-xs-left title">
                        <v-tooltip
                                right
                                max-width="500"
                                v-model="tooltipIsDisplayed[props.item.name]"
                                v-if="props.item.deployScript"
                        >
                            <template v-slot:activator="{ on }">
                                <v-icon
                                    left
                                    title="Deploy instructions"
                                    @click.native="toggleTooltip(props.item)"
                                    style="cursor: pointer;"
                                >info</v-icon>
                            </template>
                            <span>{{ props.item.deployScript }}</span>
                        </v-tooltip>
                        {{ props.item.name }}
                    </td>
                    <td class="text-xs-right">
                        <v-btn
                                :color="getButtonColor(props.item)"
                                dark
                                small
                                depressed
                                v-if="props.item.deployScript"
                                :loading="loading[props.item.name]"
                                @click.native="deploy(props.item)"
                                :title="getButtonTitle(props.item)"
                        >
                            <template v-if="buttonFailed !== props.item.name && buttonSucceded !== props.item.name">
                                <v-icon dark>play_arrow</v-icon>
                            </template>
                            <v-icon dark v-if="buttonFailed === props.item.name">refresh</v-icon>
                            <v-icon dark v-if="buttonSucceded === props.item.name">done</v-icon>
                        </v-btn>
                        <span v-else>No deployment instructions</span>
                    </td>
                </template>
            </v-data-table>
        </v-container>

        <!-- @TODO outsource dialog -->
        <v-dialog v-model="showSettingsModal" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="blue darken-3">
                    <v-btn icon dark @click="showSettingsModal = false; projectsPathInput = projectsPath">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Settings</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark flat @click="saveSettings()">Save</v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                    <v-container>
                        <p color="grey">Please provide absolute path to projects.json file. You can find more information on <a href="https://github.com/theskyliner/deploy-it/" target="_blank">gitHub</a>.</p>
                            <!-- @TODO file selection -->
                            <v-text-field v-model="projectsPathInput" placeholder="Absolute path to projects.json..." solo></v-text-field>
                    </v-container>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Vue from 'vue';

    const { exec } = require('child_process');
    const DEFAULT_BUTTON_COLOR = 'blue';
    const STORAGE_PROJECTS_PATH = 'nhb_deployit.projects_path';

    export default {
        name: 'home',

        data: function () {
            return {
                loader: null,
                loading: [],
                tooltipIsDisplayed: [],
                projects: [],
                headers: [
                    { text: 'Project', value: 'name', class: 'title' },
                    { text: 'Actions', value: 'actions', class: 'title', sortable: false, align: 'right' },
                ],
                buttonSucceded: '',
                buttonFailed: '',
                showSettingsModal: false,
                projectsPath: '',
                projectsPathInput: '',
            }
        },

        mounted: function () {
            if (localStorage.getItem(STORAGE_PROJECTS_PATH)) {
                this.projectsPath = localStorage.getItem(STORAGE_PROJECTS_PATH);
                this.projectsPathInput = this.projectsPath;
                this.fetchProjects();
            } else {
                this.showSettingsModal = true;
            }
        },

        methods: {
            deploy (project) {
                const that = this;

                that.buttonSucceded = '';
                that.buttonFailed = '';

                Vue.set(that.loading, project.name, true);

                exec(project.deployScript, (error, stdout, stderr) => {
                    if (error) {
                        alert(error);
                        Vue.set(that.loading, project.name, false);
                        that.buttonFailed = project.name;

                        setTimeout(() => {
                            that.buttonFailed = '';
                        }, 10000);

                        return;
                    }

                    Vue.set(that.loading, project.name, false);
                    that.buttonSucceded = project.name;

                    setTimeout(() => {
                        that.buttonSucceded = '';
                    }, 5000);
                });
            },

            getButtonColor (project) {
                if (this.loading[project.name]) {
                    return 'grey';
                }
                if (this.buttonSucceded === project.name) {
                    return 'green';
                }
                if (this.buttonFailed === project.name) {
                    return 'red';
                }

                return DEFAULT_BUTTON_COLOR;
            },

            getButtonTitle (project) {
                if (this.loading[project.name]) {
                    return 'Loading...';
                }
                if (this.buttonSucceded === project.name) {
                    return 'Done';
                }
                if (this.buttonFailed === project.name) {
                    return 'Retry';
                }

                return project.deployTitle ? project.deployTitle : 'Deploy';
            },

            toggleTooltip (project) {
                let newValue = true;
                if (this.tooltipIsDisplayed[project.name]) {
                    newValue = false;
                }

                this.tooltipIsDisplayed = []; // Reset other tooltips
                Vue.set(this.tooltipIsDisplayed, project.name, newValue);
            },

            saveSettings () {
                localStorage.setItem(STORAGE_PROJECTS_PATH, this.projectsPathInput);
                this.projectsPath = this.projectsPathInput;
                this.showSettingsModal = false;

                this.fetchProjects();
            },

            async fetchProjects () {
                const that = this;
                const fs = require('fs');

                if (!that.projectsPath) {
                    that.projects = [];
                    return;
                }

                fs.readFile(that.projectsPath, 'utf8', function(error, content) {
                    if (error) {
                        console.log(error);
                        that.projects = [];
                        return;
                    }

                    that.projects = JSON.parse(content);
                });
            },
        },
    }
</script>

<style>
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body { font-family: Arial, sans-serif; }

    .mt--large {
        margin-top: 48px;
    }
</style>
