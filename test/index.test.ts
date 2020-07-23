import { observer, observable } from '../src';

describe('observer', () => {
  it('works', () => {
    const store = observable({
      count: 1,
      increase() {
        this.count++;
      },
    });

    const miniComponent: any = {
      data: {
        count: 0,
      },
      setData(nextData: typeof miniComponent.data) {
        this.data = Object.assign(this.data, nextData);
      },
      onInit() {
        observer(this as any, () => store);
      },
      didUnmount() {},
    };
    // setup
    miniComponent.onInit();
    // init
    expect(miniComponent.data.count).toEqual(1);
    // update
    store.increase();
    expect(miniComponent.data.count).toEqual(2);
    store.increase();
    expect(miniComponent.data.count).toEqual(3);
    // dispose
    miniComponent.didUnmount();
    expect(miniComponent.data.count).toEqual(3);
    // should not react to
    store.increase();
    expect(miniComponent.data.count).toEqual(3);
  });
});
