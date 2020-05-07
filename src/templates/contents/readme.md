# KESTAB Template Builder

A simple static website generator best suit for developing templates using Handlebars templates, Gulp for running tasks and Browser Sync for browser reloading on development state.

## About

KESTAB give you

-   a basic skeleton for developing a static HTML5, CSS3 and Javascript only website
-   `handlebars` templating with data generate, helpers and layouts
-   some basic tasks using Gulp:
    _ `clean` for cleaning built folder
    _ `dev` for auto-reloading browser in development
    _ `build` for building files
    _ `serve` for starting production server

## Usage

### Prerequisites

-   `NodeJS` >= 10
-   `npm` or `yarn`
-   `gulp` >= 4
-   `browser-sync` >= 2

### Installation

```
git clone https://github.com/siege250294/kestab-web.git
cd kestah-web
npm install
npm run dev
```

### Running build and start a production server

```
npm start
```

### Start developing

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

### `./src/css`

All CSS files include built files should be placed in this folder.

### `./src/js`

This folder contains all Javascript file for running development server and for building.

### `./src/img`

Images should be placed in this folder for minifying before distribution.

## License

MIT License

Copyright &copy; 2017 [Nhan Hoang]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[nhan hoang]: https://kendyits.me
