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
};

const blockBase = BaseApi + '/blocks';

export const BlockApi = {
  postCreateBlock: blockBase + '/create',
  getListBlocks: blockBase + '/list'
};
