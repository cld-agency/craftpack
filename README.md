# Craftpack
## WIP

Using the method described in
[An Annotated webpack 4 Config for Frontend Web Development](https://nystudio107.com/blog/an-annotated-webpack-4-config-for-frontend-web-development)
to create a base Craft CMS project with Webpack goodness.

## Features
A WIP list.

- [ ] [HMR](https://webpack.js.org/concepts/hot-module-replacement/) in MAMP
- [ ] Autoprefixing
- [ ] JavaScript linting
- [ ] Sass linting
- [x] [HMR](https://webpack.js.org/concepts/hot-module-replacement/) in Vagrant
- [x] Asset manifests
- [x] Automatic generation and inclusion of Favicon HTML
- [x] CSS Minification
- [x] ES6 support
- [x] Image minification for repository images
- [x] Modern and Legacy builds in production
- [x] PurgeCSS
- [x] Sass
- [x] Tailwind
- [x] Vue.js

## Instructions
### Development/Local Environments
#### Developing in [Homestead](https://laravel.com/docs/5.7/homestead)
*Preface*: An assumption has been made the the Craftpack project has been
cloned into `~/Code/craftpack` - Vagrant needs to know where the project is so
for consistencies sake I've set it to there.

##### Installation
1. `cd ~/Code && git clone git@github.com:cld-agency/craftpack.git` - Jump into
the code directory and clone the project.
2. `composer install` - Installs all PHP dependencies as well as Homestead.
3. `vagrant up` - Brings up the Homestead environment.
4. `vagrant ssh` - SSH into Homestead. Frontend assets *must* be installed there.
5. `cd code && npm install` - Installs frontend assets.
6. `cp .env.example .env` - The environment example is configured for Homestead
out of the box.
7. Populate the `SECURITY_KEY` value in the `.env` file. I use the
"CodeIgniter Encryption Keys" section on [https://randomkeygen.com/]().
8. Install Craft: [http://craftpack.test/index.php?p=admin/install]() (you may
need to add a record to `/etc/hosts`: `192.168.10.10 craftpack.test`). See
`.env` for database details.
9. Install the `Twigpack` plugin in Craft.
10. Create a homepage in the usual way, setting the template to be `_entry` for
the purposes of this demo.

##### Usage
Once you have completed installation you can activate the development build
tasks by running `npm run dev`. This must be done from within Homestead, so
`vagrant ssh` in, `cd code` and then run the dev command. The initial run can
take a little while to complete, but progress will be displayed.

Once that's all finished pop to [http://craftpack.test/]() to see the Confetti!
To See HMR in action, try changing the `background-color` in
`src/css/components/global.scss` and saving the file.

#### Developing in MAMP
**TO DO**

### Production Environments
Full instruction **TO DO** but in a nutshell: `npm run build`.
