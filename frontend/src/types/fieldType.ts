export interface FieldType {
  id: string;
  fullName?: string;

  birthDate?: Date | string;
  gender: number | string;
}
export interface IRes {
  message: string;
  data: FieldType[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
export interface IParams {
  gender: string;
  id: string;
  startedAt: any;
  endedAt: any;
  page: number;
  limit: number;
}
