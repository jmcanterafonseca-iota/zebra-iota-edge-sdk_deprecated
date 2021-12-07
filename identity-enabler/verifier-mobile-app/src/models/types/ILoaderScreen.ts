interface ScreenVisible {
  visible: true;
  message?: string;
}

interface ScreenHidden {
  visible: false;
}

export type ILoaderScreen = ScreenVisible | ScreenHidden;
