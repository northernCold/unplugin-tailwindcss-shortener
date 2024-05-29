export class Tracker {
  origins: string[];
  shorteds: string[];
  title: 'className' | 'selector';

  constructor(title: 'className' | 'selector') {
    this.title = title;
    this.origins = [];
    this.shorteds = [];
  }

  add(origin: string, shorted: string) {
    this.origins.push(origin);
    this.shorteds.push(shorted);
  }


  // 1. 计算 orginClassNames 的每个元素长度相加、 shortedClassNames 的每个元素长度相加
  // 2. 打印这两个数，并加上说明文字
  // 3. 这两个数的长度差和百分比，并加上说明文字
  print() {
    const originsLength = this.origins.reduce(
      (acc, cur) => acc + cur.length,
      0
    );
    const shortedsLength = this.shorteds.reduce(
      (acc, cur) => acc + cur.length,
      0
    );

    const reduce =
      ((originsLength - shortedsLength) /
      originsLength) *
      100;

    console.log("---------------");
    console.log(`origin ${this.title} length: ${originsLength}`);
    console.log(`shorte ${this.title} length: ${shortedsLength}`);
    console.log(`decrease: ${reduce}`);
    console.log("---------------");
  }
}

const classNameTracker = new Tracker('className');
const selectorTracker = new Tracker('selector');

export {
  classNameTracker,
  selectorTracker
};
