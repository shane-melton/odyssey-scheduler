export interface IStudentUploadResult {
  key: string;
}

export interface ICsvStudent {
  firstName: string;
  lastName: string;
  grade: string;
  birthdate: string;
  studentNumber: string;
  courseSection: string;
  room: string;
}

export const EmptyCsvStudent: ICsvStudent = {
  firstName: '',
  lastName: '',
  birthdate: '',
  courseSection: '',
  grade: '',
  room: '',
  studentNumber: ''
};
