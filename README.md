# deploy-it

![Screenshot of deploy-it app](https://github.com/NickHatBoecker/deploy-it/blob/master/src/renderer/assets/screenshot.jpg?raw=true "Screenshot of deploy-it")

> An electron-vue app to deploy your projects with a click of a button on MacOS.

**ATTENTION**: This was only tested on MacOS.

#### Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:9080
yarn dev

# build electron application for MacOS
yarn run build:macos

# lint all JS/Vue component files in `src/`
npm run lint

```

#### Projects.json example

```json
[
    {
        "name": "deploy-it",
        "deployScript": "cd /var/www/deploy-it && npm run build",
        "method": "npm",
        "deployTitle": "Build"
    },
    {
        "name": "xrossplayer.de",
        "deployScript": "ssh root@superkrasserserver 'cd /home/maxmustermann/xrossplayer.de && /usr/bin/env git fetch && /usr/bin/env git remote prune origin && /usr/bin/env git checkout --force origin/master'",
        "method": "git"
    }
]
```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8d4ed60](https://github.com/SimulatedGREG/electron-vue/tree/8d4ed607d65300381a8f47d97923eb07832b1a9a) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
