const handleAsyncError = async <T = any>(
  func: (...params: any[]) => Promise<T>,
  ...params: any[]
): Promise<T> => {
  try {
    return await func(...params);
  } catch (error: any) {
    if (error['data']?.reason) {
      console.log(
        `Ocorreu um erro na execução da função porque ${error.data?.reason}`
      );
    } else {
      console.log(error);
    }
    throw new Error('server error');
  }
};

export default handleAsyncError;
