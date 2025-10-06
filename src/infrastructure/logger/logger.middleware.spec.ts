import { Test, TestingModule } from '@nestjs/testing';
import { LoggerMiddleware } from './logger.middleware';
import { LOGGER_PROVIDER_TOKEN } from './logger.constants';
import { Logger } from 'pino';
import { Request, Response, NextFunction } from 'express';

// Mock pino-http
const pinoHttpMiddleware = jest.fn();
jest.mock('pino-http', () => jest.fn(() => pinoHttpMiddleware));

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;

  const mockLogger = {} as Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerMiddleware,
        {
          provide: LOGGER_PROVIDER_TOKEN,
          useValue: mockLogger,
        },
      ],
    }).compile();

    middleware = module.get<LoggerMiddleware>(LoggerMiddleware);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    it('should call pino-http middleware and then next()', () => {
      const req = {} as Request;
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      middleware.use(req, res, next);

      // Check that the pino-http function was called with req and res
      expect(pinoHttpMiddleware).toHaveBeenCalledWith(req, res);

      // Check that next() was called
      expect(next).toHaveBeenCalled();
    });
  });
});
