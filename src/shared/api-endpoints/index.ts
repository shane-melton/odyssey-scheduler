export const BaseApi = '/api';

export const AuthBase = BaseApi + '/auth';

export const AuthApi = {
  postAuthStudent: AuthBase + '/student',
  postAuthAdmin: AuthBase + '/admin'
};

const schedulingBase = BaseApi + '/scheduler';

export const SchedulingApi = {
  getRecentClasses: schedulingBase + '/recent-classes',
  getRecentClassesAdmin: schedulingBase + '/recent-classes-admin',
  getAvailableClasses: schedulingBase + '/available-classes',
  postReservation: schedulingBase + '/reserve',
  postReservationAdmin: schedulingBase + '/admin/reserve',
  postDeleteReservation: schedulingBase + '/reservation/delete',
  getReservations: schedulingBase + '/reservations',
  getStudentReservations: schedulingBase + '/student/reservations',
  updateReservationStatus: schedulingBase + '/reservation/update'
};

const blockBase = BaseApi + '/blocks';

export const BlockApi = {
  postCreateBlock: blockBase + '/create',
  getListBlocks: blockBase + '/list',
  postUpdateBlock: blockBase + '/update',
  deleteBlock: function(blockId: string) {
    return blockBase + '/delete/' + blockId;
  }
};

const studentBase = BaseApi + '/students';

export const StudentApi = {
  getMe: studentBase + '/me',
  getStudent: studentBase + 'get',
  postImport: studentBase + '/import',
  postImportUpdate: studentBase + '/import-update',
  postCreate: studentBase + '/create',
  postUpdate: studentBase + '/update',
  postDelete: studentBase + '/delete'
};
