# Meno [![Circle CI](https://circleci.com/gh/andrewscwei/meno/tree/master.svg?style=svg)](https://circleci.com/gh/andrewscwei/meno/tree/master) [![npm version](https://badge.fury.io/js/meno.svg)](https://badge.fury.io/js/meno)

## Caveats

2017.09.14 - Avoid using custom tags directly. Use the `is` attribute instead. Currently the registered custom element constructor is not used when an element is added using `innerHTML`.

```html
<!-- Don't do this -->
<my-element></my-element>

<!-- Do this instead -->
<div is='my-element'></div>
```

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
