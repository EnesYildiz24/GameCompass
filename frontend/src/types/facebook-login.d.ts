import 'vite/client';

declare module '@greatsumini/react-facebook-login' {
  interface DialogParamsExt {
    auth_type?: 'rerequest' | 'reauthenticate';
  }
}
