const logger = require('../config/logger');

/**
 * 自定義錯誤類
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode || `ERR_${statusCode}`;
    this.isOperational = true; // 標記為可操作的錯誤

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 錯誤處理中間件
 */
const notFoundHandler = (req, res, next) => {
  const error = new AppError(`找不到路徑: ${req.originalUrl}`, 404, 'ERR_NOT_FOUND');
  next(error);
};

/**
 * 全局錯誤處理中間件
 */
const errorHandler = (err, req, res, next) => {
  // 預設錯誤狀態和訊息
  let statusCode = err.statusCode || 500;
  let errorMessage = err.message || '伺服器內部錯誤';
  let errorCode = err.errorCode || 'ERR_INTERNAL_SERVER';
  let stack = process.env.NODE_ENV === 'production' ? null : err.stack;
  
  // 記錄錯誤
  if (statusCode >= 500) {
    logger.error(`${errorCode}: ${errorMessage}`, { 
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      stack: err.stack
    });
  } else {
    logger.warn(`${errorCode}: ${errorMessage}`, { 
      url: req.originalUrl,
      method: req.method,
      ip: req.ip
    });
  }

  // 處理特定類型的錯誤
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'ERR_VALIDATION';
    errorMessage = err.message;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'ERR_INVALID_TOKEN';
    errorMessage = '無效的認證令牌';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'ERR_TOKEN_EXPIRED';
    errorMessage = '認證令牌已過期';
  }

  // 發送錯誤響應
  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: errorMessage,
      ...(stack && { stack })
    }
  });
};

module.exports = {
  AppError,
  notFoundHandler,
  errorHandler
};
