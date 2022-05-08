import Recorder from "./RecorderManager";

class RecorderManagerFactory {
  static instance: Recorder | undefined;

  static getInstance(): Recorder {
    if (!this.instance) {
      this.instance = new Recorder();
      // delete instance.constructor;
    }
    return this.instance;
  }
}

const updateContent = () => {
  const container = document?.getElementById("json");
  if (container) {
    container.textContent = JSON.stringify(
      RecorderManagerFactory.getInstance().getData(),
      undefined,
      2
    );
  }
};

setInterval(updateContent, 1000);
// const button = document.getElementById("refresh");
// if (button) {
//   button.onclick = updateContent;
// }

export default RecorderManagerFactory;
