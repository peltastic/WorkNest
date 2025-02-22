import classes from "@/app/styles/SuccessNotification.module.css";
import classes2 from "@/app/styles/ErrorNotification.module.css";

import { notifications } from "@mantine/notifications";
import { successColor } from "./constants";
export function notify(
  type: "success" | "error" | "message",
  title: string,
  message?: string
) {
  if (type === "success") {
    notifications.show({
      title: title,
      message: message,
      color: successColor,
      classNames: classes,
      position: "top-right",
    });
  } else if (type === "message") {
    notifications.show({
      title: title,
      message: message,
      color: "#181818",
      position: "top-right",
    });
  } else {
    notifications.show({
      title: title,
      message: message,
      classNames: classes2,
      position: "top-right",
      color: "red",
    });
  }
}
