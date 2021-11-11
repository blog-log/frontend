import type { IncomingMessage } from "http";

export enum DeviceType {
  WEB = "web",
  MOBILE = "mobile",
}

export function getDeviceType(req: IncomingMessage | undefined): DeviceType {
  let isMobileView = (
    req ? req.headers["user-agent"] : navigator.userAgent
  )?.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  );

  return isMobileView ? DeviceType.MOBILE : DeviceType.WEB;
}
