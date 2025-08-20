import dayjs from "dayjs";

export const formatDate = (date: Date | string, time?: boolean) => {
  return dayjs(date).format("DD.MM.YYYY") + (time ? ` ${dayjs(date).format("HH:mm")}` : "")
}