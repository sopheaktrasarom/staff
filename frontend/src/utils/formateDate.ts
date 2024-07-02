import dayjs from "dayjs";

export function formateDate(date: any) {
  return dayjs(date).format("YYYY-MM-DD");
}
