"use client";
import { useEffect, useState } from "react";

import dayjs from "dayjs";
import axios from "axios";

import { Button, notification, Input, DatePicker, Table, Select } from "antd";
import { FieldType, IParams, IRes } from "@/types/fieldType";

import { formateDate } from "@/utils/formateDate";
import { exportToExcel } from "@/utils/exportToExcel";
import ModalDelete from "@/components/ModalDelete";
import ModalAction from "@/components/ModalAction";
import { useDebounce } from "@/hooks/useDebounce";

export default function Page() {
  const [staffData, setStaffData] = useState<IRes>({} as IRes);
  const [currentStaff, setCurrentStaff] = useState<FieldType>({} as FieldType);
  const [isOpen, setOpen] = useState(false);
  const [isOpenDelete, setOpenDelete] = useState(false);
  const [gender, setGender] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearchID = useDebounce(searchId);
  const [searchBirthDay, setSearchBirthDay] = useState<string[]>([]);
  const { RangePicker } = DatePicker;

  const endPoint = process.env.NEXT_PUBLIC_API as string;
  type NotificationType = "success" | "info" | "warning" | "error";
  const [api, contextHolder] = notification.useNotification();

  const handleShowNotification = (type: NotificationType, message: string) => {
    api[type]({
      message,
      duration: 2,
    });
  };

  const params = { page, limit: 10 } as IParams;
  const columns = [
    {
      title: "Staff ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "name",
    },
    {
      title: "BirthDay",
      dataIndex: "birthDate",
      key: "birthDate",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: FieldType) => (
        <div className="flex gap-10">
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
              setCurrentStaff(record);
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => {
              setOpenDelete(true);
              setCurrentStaff(record);
            }}
            type="primary"
            danger
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  //Data to export to excel
  const exportData = staffData?.data?.map((item) => ({
    "Staff ID": item.id,
    FullName: item.fullName,
    BirthDay: item.birthDate,
    Gender: item.gender,
  }));

  useEffect(() => {
    getStaff();
  }, [page, debouncedSearchID, gender, searchBirthDay]);

  const getStaff = async () => {
    if (gender) {
      params.gender = gender;
    }
    if (debouncedSearchID) {
      params.id = debouncedSearchID;
    }
    if (searchBirthDay?.length == 2) {
      params.startedAt = formateDate(searchBirthDay[0]);
      params.endedAt = formateDate(searchBirthDay[1]);
    }

    try {
      setIsLoading(true);
      const response = await axios.get(endPoint, {
        params,
      });

      const newData = response.data?.data?.map((item: FieldType) => {
        return {
          ...item,
          key: item.id,
          birthDate: dayjs(item.birthDate).format("YYYY-MM-DD"),
        };
      });
      setIsLoading(false);
      setStaffData({ ...response.data, data: newData });
    } catch (e) {
      console.log("e", e);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (values: FieldType) => {
    const newValues = {
      ...values,
      gender: values.gender == 1 ? "Male" : "Female",
      birthDate: formateDate(values.birthDate),
    };
    try {
      setIsLoadingCreate(true);
      if (currentStaff.id) {
        await axios.put(`${endPoint}/${currentStaff.id}`, newValues);
      } else {
        await axios.post(`${endPoint}`, newValues);
      }

      setIsLoadingCreate(false);
      getStaff();
      handleCancel();
      setGender(null);
      setSearchBirthDay([]);
      handleShowNotification(
        "success",
        `${currentStaff.id ? "Update" : "Create"} staff successfully`
      );
    } catch (e) {
      handleShowNotification(
        "error",
        `Staff is failed to ${currentStaff.id ? "update" : "create"}`
      );
    } finally {
      setIsLoadingCreate(false);
    }
  };

  const showModal = () => {
    setOpen(true);
    setCurrentStaff({} as FieldType);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  function checkIsExported() {
    const isSearchAdvanced =
      gender || debouncedSearchID || searchBirthDay?.length == 2;
    if (staffData?.data?.length > 0 && !isLoading && isSearchAdvanced) {
      return true;
    }
    return false;
  }

  async function handleDeleteStaff(id: string) {
    try {
      await axios.delete(`${endPoint}/${id}`);
      handleCancelDelete();
      await getStaff();
      handleShowNotification("success", "Delete Staff successfully");
    } catch (e) {
      handleShowNotification("error", " Staff is failed to delete");
    }
  }
  function handleCancelDelete() {
    setCurrentStaff({} as FieldType);
    setOpenDelete(false);
  }

  return (
    <main className="py-10 w-[80%] mx-auto">
      {contextHolder}
      <h1 className="font-bold text-center text-4xl">Staff Manangement</h1>
      <ModalDelete
        currentStaff={currentStaff}
        isOpenDelete={isOpenDelete}
        handleCancelDelete={handleCancelDelete}
        handleDelete={() => handleDeleteStaff(currentStaff?.id)}
      />
      <ModalAction
        isLoadingCreate={isLoadingCreate}
        currentStaff={currentStaff}
        setCurrentStaff={setCurrentStaff}
        handleSubmit={handleSubmit}
        isModalOpen={isOpen}
        handleCancel={handleCancel}
      />
      <div className="flex justify-between gap-5 my-3">
        <div className="grid grid-cols-3  gap-4">
          <Input
            placeholder="Search By Staff ID"
            onChange={(e) => {
              setSearchId(e.currentTarget.value);
            }}
          />

          <Select
            allowClear
            value={gender}
            placeholder="Seach By Gender"
            onChange={(e) => {
              setGender(e);
            }}
          >
            <Select.Option value={"male"}>Male</Select.Option>
            <Select.Option value={"female"}>Female</Select.Option>
          </Select>

          <div>
            <RangePicker
              value={searchBirthDay as any}
              onChange={(e) => {
                setSearchBirthDay(e as any);
              }}
            />
          </div>
        </div>
        <div className="gap-4 flex ">
          <Button type="primary" onClick={showModal}>
            Add Staff
          </Button>

          {checkIsExported() && (
            <Button type="default" onClick={() => exportToExcel(exportData)}>
              Export to Excel
            </Button>
          )}
        </div>
      </div>

      <Table
        tableLayout="auto"
        loading={isLoading}
        dataSource={staffData?.data}
        columns={columns}
        pagination={{
          pageSize: params.limit,
          total: staffData?.meta?.totalItems,
          onChange: (page) => {
            setPage(page);
          },
        }}
      />
    </main>
  );
}
