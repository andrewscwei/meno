# Meno ![](https://img.shields.io/maintenance/no/2019) [![npm](https://img.shields.io/npm/v/meno.svg)](https://www.npmjs.com/package/meno) [![CI](https://github.com/andrewscwei/meno/workflows/CI/badge.svg)](https://github.com/andrewscwei/meno/actions?query=workflow%3ACI) [![CD](https://github.com/andrewscwei/meno/workflows/CD/badge.svg)](https://github.com/andrewscwei/meno/actions?query=workflow%3ACD)

Meno is a lean (`~8kb`), [Web Components](http://webcomponents.org/)-based (namely custom elements and shadow DOM) UI library. It is an experimental project and is not meant for production use. It utilizes/supports the following modern tech methodologies:

1. The MVVM pattern.
2. Webpack as a build tool, therefore the entry files are Javascript rather than HTML (Meno has yet to adopt HTML imports for the sole reason of keeping Webpack so it can leverage its many cool features such as hot module reloading).
3. W3C custom elements and shadow DOM to embrace a future-proof components-oriented solution.
4. Supports templating engine like Pug (Webpack makes this possible).
5. Supports CSS preprocessors (Webpack makes this possible).
6. In-house implementation of virtual DOM for rendering performance.
7. Separation of concerns—a component is composed of 3 files, a Javascript file as the view model that houses view/business logic, a template file (i.e. HTML, Pug, etc) to define the presentation layer, and a stylesheet file (i.e. CSS, Sass) to define the styles. You can choose to express the presentation layer in hyperscript (custom implementation) within the Javascript view model. You can even define the styles in Javascript if you want.

## Dependencies

This library requires Web Components to work, namely custom elements and shadow DOM. Shadow DOM is optional, it will not be used if the browser doesn't support it, though in this case you won't be able to use shadow CSS. At the very least you need to polyfill custom elements. The following package are recommended:

- [`@webcomponents/webcomponentsjs`](https://www.npmjs.com/package/@webcomponents/webcomponentsjs)

See the todo list demo for a working example of how Meno is used along with these polyfills.

## Usage

```
$ npm install meno
```

## Demo

Check out the [todo list demo](http://andrewscwei.github.io/meno), or clone this project and run it yourself:

```sh
# Install dependencies for Meno
npm install

# Install dependencies for the demo
cd demo
npm install
cd ..

# Run the demo in development
npm run demo:dev

# Run the demo in production
npm run demo
```

## Disclaimer

Meno is an on-going pet project for experimenting with web UI building techniques. It is a stand-alone front-end library that, at its current state, is not production ready, has an ever-changing API, and lacks proper documentation. Its features are driven by internal requirements and is meant for internal use only.

## Caveats

When extending another DOM tag (i.e. specifying the `extends` static property of `Element`), you must use the `is` syntax to define your DOM element.

```html
<!-- Do this -->
<button is='my-button'></button>

<!-- Don't do this -->
<my-button></my-button>
```
