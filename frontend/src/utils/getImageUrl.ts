export function getImageUrl(path: string) {
    const isHttp = /^https?:\/\//i.test(path);
    const HOST = import.meta.env.VITE_API_SERVER_URL;
    return isHttp ? path : `${HOST}/api/upload/${path}`;
  }
  