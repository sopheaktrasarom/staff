import { FieldType } from "@/types/fieldType";
import { Modal } from "antd";

interface IProps {
  handleCancelDelete: () => void;
  isOpenDelete: boolean;
  currentStaff: FieldType;
  handleDelete: () => void;
}
export default function ModalDelete(props: IProps) {
  const { currentStaff, isOpenDelete, handleDelete, handleCancelDelete } =
    props;

  return (
    <Modal
      onCancel={handleCancelDelete}
      title="Confirm Delete"
      open={isOpenDelete}
      onOk={handleDelete}
      destroyOnClose={true}
    >
      <p>
        Do you want to delete{" "}
        <span className="font-bold">{currentStaff.fullName}</span>?
      </p>
    </Modal>
  );
}
