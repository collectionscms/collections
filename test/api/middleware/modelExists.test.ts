import { jest } from '@jest/globals';
import { NextFunction, Request, Response, response } from 'express';
import { modelExists } from '../../../src/api/middleware/modelExists.js';

describe('ModelExists middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  describe('modelExists', () => {
    beforeEach(() => {
      mockRequest = {
        schema: {
          models: {
            1: {
              id: 1,
              model: 'mock_model',
              singleton: false,
              statusField: null,
              draftValue: null,
              publishValue: null,
              archiveValue: null,
              fields: {
                id: { alias: false, interface: 'input', special: null, field: 'id' },
                createdAt: {
                  alias: false,
                  interface: 'dateTime',
                  special: null,
                  field: 'createdAt',
                },
                updatedAt: {
                  alias: false,
                  interface: 'dateTime',
                  special: null,
                  field: 'updatedAt',
                },
                date: {
                  alias: false,
                  interface: 'dateTime',
                  special: 'cast-timestamp',
                  field: 'date',
                },
              },
            },
          },
          relations: [],
        },
      };
    });

    it('should get model by id', () => {
      mockRequest.params = {
        identifier: '1',
      };

      modelExists(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockRequest.model?.model).toBe('mock_model');
    });

    it('should get model by name', () => {
      mockRequest.params = {
        identifier: 'mock_model',
      };

      modelExists(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockRequest.model?.id).toBe(1);
    });

    it('should call next function', () => {
      modelExists(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should throw forbidden', async () => {
      mockRequest.params = {
        identifier: 'no_exist_model',
      };

      modelExists(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockRequest.model).toBeUndefined();
    });
  });
});
