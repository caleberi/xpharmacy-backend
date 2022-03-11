export const createSuccessResponse = (payload?: {
  [key: string | number]: any;
}) => ({
  status: 'success',
  data: payload,
});

export const createFailureResponse = (payload?: {
  [key: string | number]: any;
}) => ({
  status: 'failure',
  data: payload,
});
