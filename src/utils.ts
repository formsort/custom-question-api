import WindowMessageEventsEmitter from './WindowMessageEmitter';

let emitterSingleton: WindowMessageEventsEmitter;
export const getEmitter = () => {
  if (!emitterSingleton) {
    emitterSingleton = new WindowMessageEventsEmitter();
  }
  return emitterSingleton;
};

export const sendMessageToWindowParent = (type: string, payload?: any) => {
  if (!window.parent) {
    throw new Error(
      'Custom questions must run within a Formsort flow custom question to work.'
    );
  }
  window.parent.postMessage(
    {
      type,
      payload,
    },
    '*'
  );
};

export const getValueFromWindowParent: <T>(
  requestEventType: string,
  responseEventType: string,
  requestPayload?: any
) => Promise<T> = (requestEventType, responseEventType, requestPayload) => {
  return new Promise((resolve) => {
    getEmitter().once(responseEventType, (res) => {
      resolve(res);
    });
    sendMessageToWindowParent(requestEventType, requestPayload);
  });
};
