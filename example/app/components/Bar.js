// © Andrew Wei

'use strict';

import { Element, NodeState, DirtyType } from 'meno';

class Bar extends Element('bar') {
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
    return require('templates/components/bar.pug')({ n: Math.floor(Math.random() * (200 - 10)) + 10 });
  }
}

export default Bar;
