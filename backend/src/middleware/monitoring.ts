import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

// Metrics collection
const metrics = {
  requestCount: 0,
  errorCount: 0,
  averageResponseTime: 0,
  totalResponseTime: 0,
  lastError: null as Error | null,
  lastErrorTime: null as Date | null,
  concurrentRequests: 0,
  maxConcurrentRequests: 0
};

// Performance monitoring middleware
export const monitorPerformance = (req: Request, res: Response, next: NextFunction) => {
  const startTime = performance.now();
  metrics.requestCount++;
  metrics.concurrentRequests++;
  metrics.maxConcurrentRequests = Math.max(metrics.maxConcurrentRequests, metrics.concurrentRequests);

  // Log request details
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Started`);

  // Capture response time
  res.on('finish', () => {
    const duration = performance.now() - startTime;
    metrics.totalResponseTime += duration;
    metrics.averageResponseTime = metrics.totalResponseTime / metrics.requestCount;
    metrics.concurrentRequests--;

    // Log response details
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Completed in ${duration.toFixed(2)}ms`);
  });

  next();
};

// Error monitoring middleware
export const monitorErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  metrics.errorCount++;
  metrics.lastError = err;
  metrics.lastErrorTime = new Date();

  // Log error details
  console.error(`[${new Date().toISOString()}] Error in ${req.method} ${req.path}:`, err);

  next(err);
};

// Get current metrics
export const getMetrics = () => ({
  ...metrics,
  uptime: process.uptime(),
  memoryUsage: process.memoryUsage(),
  timestamp: new Date()
});

// Reset metrics (useful for testing)
export const resetMetrics = () => {
  metrics.requestCount = 0;
  metrics.errorCount = 0;
  metrics.averageResponseTime = 0;
  metrics.totalResponseTime = 0;
  metrics.lastError = null;
  metrics.lastErrorTime = null;
  metrics.concurrentRequests = 0;
  metrics.maxConcurrentRequests = 0;
};

// Export metrics endpoint
export const metricsEndpoint = (req: Request, res: Response) => {
  res.json(getMetrics());
}; 