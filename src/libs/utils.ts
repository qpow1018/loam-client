class Utils {
  public async waitFor(milliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('');
      }, milliseconds);
    });
  }
}

const _instance = new Utils();
export default _instance;