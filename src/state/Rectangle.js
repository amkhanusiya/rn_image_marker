export class Rectangle {
  id: string;
  tag: string;
  start: {x: 0, y: 0};
  end: {x: 0, y: 0};
  dimensions: {w: 0, h: 0};

  constructor() {
    this.start = {x: 0, y: 0};
    this.end = {x: 0, y: 0};
    this.dimensions = {w: 0, h: 0};
  }
}

export default new Rectangle();
