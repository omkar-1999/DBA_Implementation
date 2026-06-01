export const DEPLOYMENT_STATUS = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  REQUESTER_REVIEW: 'Requester Review',
  CLOSED: 'Closed',
  REJECTED: 'Rejected',
  PENDING_APPROVAL: 'Pending Approval',
  APPROVED: 'Approved',
}

export const USER_ROLES = {
  DBA: 'DBA',
  DEV: 'DEV',
}

export const COMMENT_ACTION = {
  LOCK: 'lock',
  REJECT: 'reject',
  REQUESTER_REVIEW: 'requester',
  COMPLETE: 'complete',
  APPROVE: 'approve',
}

export const WORKFLOW_STATUS_ID = {
  LOCKED: '2',
  REQUESTER_REVIEW: '3',
  CLOSED: '4',
  REJECTED: '5',
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
