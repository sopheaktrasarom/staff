import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello Crud Node Express" });
});

interface StaffMember {
  id: string;
  fullName?: string;
  birthDate?: any;
  gender: string;
}

const staffData: StaffMember[] = [];

//Endpoint to get all staff members
app.get("/api/staff", (req: Request, res: Response) => {
  let filteredStaffData = staffData;

  const gender = (req.query.gender as string)?.toLowerCase();
  if (req.query.gender) {
    filteredStaffData = filteredStaffData.filter(
      (item) => item?.gender.toLowerCase() == gender
    );
  }
  if (req.query.id) {
    filteredStaffData = filteredStaffData.filter((item) =>
      item.id.includes(req.query.id as string)
    );
  }
  if (req.query.startedAt && req.query.endedAt) {
    filteredStaffData = filteredStaffData.filter((item) => {
      const birthday: any = dayjs(item.birthDate);
      return (
        birthday?.isSame(req.query.startedAt) ||
        birthday?.isSame(req.query.endedAt)
      );
    });
  }
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const newStaffData = filteredStaffData.map((item) => {
    return { ...item, birthDate: dayjs(item.birthDate) };
  });
  const paginatedData = newStaffData.slice(startIndex, endIndex);
  const meta = {
    page,
    limit,
    totalItems: newStaffData.length,
    totalPages: Math.ceil(newStaffData.length / limit),
  };
  res.status(200).json({ message: "success", data: paginatedData, meta });
});

app.post("/api/staff", (req: Request, res: Response) => {
  const newStaff: StaffMember = {
    id: uuidv4().slice(0, 8),
    fullName: req.body.fullName,
    birthDate: dayjs(req.body.birthDate),
    gender: req.body.gender,
  };
  staffData.unshift(newStaff);
  res.status(200).json(newStaff);
});

app.delete("/api/staff/:id", (req: Request, res: Response) => {
  const currentStaff = staffData.find((item) => item.id == req.params.id);
  const indexToDelete = staffData.indexOf(currentStaff as StaffMember);
  staffData.splice(indexToDelete, 1);
  res.status(200).json(currentStaff);
});
app.put("/api/staff/:id", (req: Request, res: Response) => {
  const index = staffData.findIndex((item) => item.id == req.params.id);
  const { fullName, birthDate, gender } = req.body;
  const updateStaff: StaffMember = {
    id: req.params.id,
    birthDate,
    fullName,
    gender,
  };
  staffData[index] = updateStaff;
  res.status(200).json(updateStaff);
});
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
