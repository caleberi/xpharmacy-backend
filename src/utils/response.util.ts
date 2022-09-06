export class ResponseHelper{
  static createSuccessResponse = (payload?: {
    [key: string | number]: any;
  }) => ({
    status: 'success',
    data: payload,
  });

  static createFailureResponse = (payload?: {
    [key: string | number]: any;
  }) => ({
    status: 'failure',
    data: payload,
  });
  
}