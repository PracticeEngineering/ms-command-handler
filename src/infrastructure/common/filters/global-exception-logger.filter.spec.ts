import { Test, TestingModule } from '@nestjs/testing';
import { GlobalExceptionLoggerFilter } from './global-exception-logger.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { LOGGER_PROVIDER_TOKEN } from '../../logger/logger.constants';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from 'pino';

describe('GlobalExceptionLoggerFilter', () => {
  let filter: GlobalExceptionLoggerFilter;
  let logger: Logger;
  let httpAdapterHost: HttpAdapterHost;

  const mockLogger = {
    error: jest.fn(),
  };

  const mockHttpAdapter = {
    getRequestUrl: jest.fn(),
    reply: jest.fn(),
  };

  const mockHttpAdapterHost = {
    httpAdapter: mockHttpAdapter,
  };

  const mockGetResponse = jest.fn();
  const mockGetRequest = jest.fn();
  const mockHttpArgumentsHost = {
    getResponse: mockGetResponse,
    getRequest: mockGetRequest,
  };
  const mockArgumentsHost = {
    switchToHttp: jest.fn(() => mockHttpArgumentsHost),
  } as unknown as ArgumentsHost;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalExceptionLoggerFilter,
        {
          provide: HttpAdapterHost,
          useValue: mockHttpAdapterHost,
        },
        {
          provide: LOGGER_PROVIDER_TOKEN,
          useValue: mockLogger,
        },
      ],
    }).compile();

    filter = module.get<GlobalExceptionLoggerFilter>(GlobalExceptionLoggerFilter);
    logger = module.get<Logger>(LOGGER_PROVIDER_TOKEN);
    httpAdapterHost = module.get<HttpAdapterHost>(HttpAdapterHost);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should log and handle HttpException correctly', () => {
      const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);
      const requestUrl = '/test';
      mockHttpAdapter.getRequestUrl.mockReturnValue(requestUrl);

      filter.catch(exception, mockArgumentsHost);

      expect(logger.error).toHaveBeenCalled();
      expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
        undefined, // response object
        expect.objectContaining({
          statusCode: HttpStatus.NOT_FOUND,
          path: requestUrl,
          message: 'Not Found',
        }),
        HttpStatus.NOT_FOUND,
      );
    });

    it('should log and handle a generic Error as Internal Server Error', () => {
      const exception = new Error('Generic error');
      const requestUrl = '/error-path';
      mockHttpAdapter.getRequestUrl.mockReturnValue(requestUrl);

      filter.catch(exception, mockArgumentsHost);

      expect(logger.error).toHaveBeenCalled();
      expect(mockHttpAdapter.reply).toHaveBeenCalledWith(
        undefined, // response object
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          path: requestUrl,
          message: 'Internal server error',
        }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });
});
