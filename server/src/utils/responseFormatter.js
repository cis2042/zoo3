/**
 * 標準化成功響應
 * @param {Object} res - Express 響應對象
 * @param {Object|Array} data - 響應數據
 * @param {String} message - 成功消息
 * @param {Number} statusCode - HTTP 狀態碼
 * @returns {Object} 格式化的響應
 */
const success = (res, data = null, message = '操作成功', statusCode = 200) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * 標準化錯誤響應
 * @param {Object} res - Express 響應對象
 * @param {String} message - 錯誤消息
 * @param {Number} statusCode - HTTP 狀態碼
 * @param {String} errorCode - 錯誤代碼
 * @returns {Object} 格式化的響應
 */
const error = (res, message = '操作失敗', statusCode = 400, errorCode = null) => {
  const response = {
    success: false,
    error: {
      message,
      code: errorCode || `ERR_${statusCode}`
    },
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(response);
};

/**
 * 分頁響應格式化
 * @param {Object} res - Express 響應對象
 * @param {Array} data - 分頁數據
 * @param {Number} total - 總記錄數
 * @param {Number} page - 當前頁碼
 * @param {Number} limit - 每頁記錄數
 * @param {String} message - 成功消息
 * @returns {Object} 格式化的分頁響應
 */
const paginate = (res, data, total, page, limit, message = '獲取數據成功') => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return success(res, {
    items: data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage
    }
  }, message);
};

module.exports = {
  success,
  error,
  paginate
};
