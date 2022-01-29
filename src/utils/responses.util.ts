export const createSuccessResponse = (payload?: {
  [key: string | number]: any;
}) => ({
  status: 'success',
  ...payload,
});

export const createFailureResponse = (payload?: {
  [key: string | number]: any;
}) => ({
  status: 'failure',
  ...payload,
});
