export const BaseApi = '/api';

export const AuthBase = BaseApi + '/auth';

export const AuthApi = {
  postAuthStudent: AuthBase + '/student',
  postAuthAdmin: AuthBase + '/admin'
};

const schedulingBase = BaseApi + '/scheduler';

export const SchedulingApi = {
  getRecentClasses: schedulingBase + '/recent-classes',
  getAvailableClasses: schedulingBase + '/available-classes',
  postReservation: schedulingBase + '/reserve',
  getReservations: schedulingBase + '/reservations',
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
  postImport: studentBase + '/import',
  postImportUpdate: studentBase + '/import-update'
};
