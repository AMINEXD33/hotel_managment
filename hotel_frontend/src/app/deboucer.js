export default class SearchCalls {
  constructor() {
    this.currentTimout = NaN;
  }

  debounce(callBack, args, latency) {
    let tm = setTimeout(() => {
      clearTimeout(tm);
      if (this.currentTimout != tm) {
        return;
      }
      return callBack(...args);
    }, latency);
    this.currentTimout = tm;
  }
}
