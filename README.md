# Deploy-it!

> An electron-vue app to deploy your projects with a click of a button.

<img src="https://github.com/theskyliner/deploy-it/raw/master/screenshots/2.jpg" width="100%">

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# lint all JS/Vue component files in `src/`
npm run lint

```

#### Projects.json

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

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
