# Buchsbaum-Tax

export NODE_OPTIONS=--openssl-legacy-provider

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

---

## Project Specific:

#### `Some insight into the architecture`

**_The Tables_**
To manage with the flexibility needed in this project for the table cells the tables are essentially `flexbox` and we have the cells have an `edit-mode` and a `read-mode` which is toggled on click.

**_The Store/API_**
Using injection into the Axios requests (see `plugins/axios.js` and the `axios` settings in `nuxt.config` files) we send the `model` we would like to mutate in the request to handle the store but just making the request in the `plugins/api.js` file

#### `Icons`

We used [HeroIcons](https://heroicons.com/) as SVGs as our Icons

#### `Design`

Most of the design is based on [TailwindUI](https://tailwindui.com/) (at least that was the inspiration)

#### `Plugins`

- [vue2-datepicker](https://github.com/mengxiong10/vue2-datepicker)
- [v-hotkey](https://github.com/Dafrok/v-hotkey)
- [v-tooltip](https://github.com/Akryum/floating-vue)

---

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).

### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).
