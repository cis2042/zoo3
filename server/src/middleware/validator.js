const { validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

/**
 * 驗證請求中間件
 * 使用 express-validator 驗證請求數據
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // 執行所有驗證
    await Promise.all(validations.map(validation => validation.run(req)));

    // 獲取驗證結果
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }

    // 格式化錯誤消息
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));

    // 創建錯誤對象
    const error = new AppError('請求驗證失敗', 400, 'ERR_VALIDATION');
    error.validationErrors = formattedErrors;
    
    return next(error);
  };
};

module.exports = {
  validate
};
