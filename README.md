# Kestah Website Builder

A simple static website generator using Gulp for running tasks and Browser Sync for browser reloading on development state.

## About

Kestah give you
* a basic skeleton for developing a static HTML5, CSS3 and Javascript only website
* some basic tasks using Gulp:
	* `stylus` for styling CSS via [Stylus]
	* `clean` for cleaning built folder
	* `dev` for auto-reloading browser when developing
	* `build` for building files

## Usage

### Prerequisites

* NodeJS >= 6
* npm
* gulp >= 3
* browser-sync >= 2

### Installation

```
git clone https://github.com/siege250294/kestab-web.git`
cd kestah-web
npm install --all
```

### Running

```
npm run dev
```

### Building for distribution

```
npm run build
```

## Structure of Kestah

### `gulpfile.js`

The main file for all gulp tasks. You need to add a new task to this file before running

### `./src`

Root source folder that will be served when developing by using Browser Sync. This folder include some other folder:

### `./css`

All CSS files include built files should be placed in this folder.

### `./js`

This folder contains all Javascript file for running development server and for building.

### './img'

Images should be placed in this folder for minifying before distribution.

### `./styl`

This folder contains all the Stylus files. When saving, the `.styl` files will be converted to `.css` files and put into `./css` folder in appropriate name.

## License

MIT License

Copyright &copy; 2017 Nhan Hoang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[Stylus]: http://stylus-lang.com/