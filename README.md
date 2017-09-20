# Meno [![Circle CI](https://circleci.com/gh/andrewscwei/meno/tree/master.svg?style=svg)](https://circleci.com/gh/andrewscwei/meno/tree/master) [![npm version](https://badge.fury.io/js/meno.svg)](https://badge.fury.io/js/meno)

Meno is an lean (`12.8kb`), [WebComponents](http://webcomponents.org/)-based (namely custom elements) UI library. It is an experimental project and is not meant for production use.

# Usage

```
$ npm install meno
```

## Example

Install dependencies and run the todo list app example:

```sh
$ yarn
$ cd example
$ yarn
$ cd ../
$ npm run example:dev
```

# API

Raw documentation is available [here](http://andrewscwei.github.io/meno).

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

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
