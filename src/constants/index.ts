export const USER_ROLES = {
  REP: 'rep',
  ADMIN: 'admin'
} as const;

export const ERROR_MESSAGES = {
  FETCH_USERS: 'Failed to load users',
  SHARE_CUSTOMER: 'Failed to share customer',
  UPDATE_VEHICLE: 'Failed to update vehicle',
  VALIDATION: {
    SELECT_USER: 'Please select a user',
    INVALID_USER: 'Invalid user selected'
  }
} as const;

export const SUCCESS_MESSAGES = {
  SHARE_CUSTOMER: 'Customer shared successfully',
  UPDATE_VEHICLE: 'Vehicle updated successfully'
} as const; 