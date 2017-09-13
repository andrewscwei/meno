// © Andrew Wei

'use strict';

import { Element, NodeState, DirtyType } from 'meno';

class Foo extends Element('foo') {
  static get extends() { return 'div'; }

  init() {
    this.respondsTo(10.0, 'resize');
    super.init();
  }

  update() {
    if (this.nodeState === NodeState.UPDATED && this.isDirty(DirtyType.SIZE)) {
      this.setDirty(DirtyType.RENDER);
    }

    super.update();
  }

  template(data) {
    const template = require('templates/components/foo.pug');
    const d = { n: Math.floor(Math.random() * (200 - 10)) + 10 };
    console.log(template(d))
    return template(d);
  }
}

export default Foo;
