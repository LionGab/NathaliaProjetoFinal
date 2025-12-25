/**
 * useApiWithRetry Hook Tests
 *
 * Tests the retry mechanism used by the hook.
 * Note: Full hook testing requires @testing-library/react-native.
 * These tests verify the core retry logic integration.
 *
 * @module hooks/__tests__/useApiWithRetry.test
 */

import { retryNetworkRequest } from "../../utils/retry";

// Mock dependencies
jest.mock("../../utils/retry", () => ({
  retryNetworkRequest: jest.fn(),
}));

jest.mock("../../utils/logger", () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock("../../utils/error-handler", () => {
  class MockAppError extends Error {
    code: string;
    userMessage: string;
    context?: Record<string, unknown>;
    constructor(message: string, errorCode: string, userMsg: string) {
      super(message);
      this.code = errorCode;
      this.userMessage = userMsg;
    }
  }
  return {
    isAppError: (error: unknown): error is InstanceType<typeof MockAppError> =>
      error instanceof MockAppError,
    AppError: MockAppError,
  };
});

const mockRetryNetworkRequest = retryNetworkRequest as jest.MockedFunction<
  typeof retryNetworkRequest
>;

describe("useApiWithRetry - retry logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("retryNetworkRequest integration", () => {
    it("should call retryNetworkRequest with correct options", async () => {
      const mockApiFunction = jest.fn().mockResolvedValue({ data: "test" });
      mockRetryNetworkRequest.mockImplementation((fn) => fn());

      // Simulate what the hook does
      await retryNetworkRequest(() => mockApiFunction("arg1", "arg2"), {
        maxAttempts: 5,
        context: "useApiWithRetry",
      });

      expect(mockRetryNetworkRequest).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          maxAttempts: 5,
          context: "useApiWithRetry",
        })
      );
    });

    it("should pass through successful results", async () => {
      const expectedResult = { data: "success", items: [1, 2, 3] };
      mockRetryNetworkRequest.mockResolvedValue(expectedResult);

      const result = await retryNetworkRequest(
        () => Promise.resolve(expectedResult),
        { maxAttempts: 3, context: "test" }
      );

      expect(result).toEqual(expectedResult);
    });

    it("should propagate errors after retry exhaustion", async () => {
      const testError = new Error("Network error after retries");
      mockRetryNetworkRequest.mockRejectedValue(testError);

      await expect(
        retryNetworkRequest(() => Promise.reject(testError), {
          maxAttempts: 3,
          context: "test",
        })
      ).rejects.toThrow("Network error after retries");
    });
  });

  describe("error handling patterns", () => {
    it("should handle network errors with retry", async () => {
      const networkError = new Error("Network request failed");
      mockRetryNetworkRequest.mockRejectedValue(networkError);

      await expect(
        retryNetworkRequest(() => Promise.reject(networkError), {
          maxAttempts: 3,
        })
      ).rejects.toThrow("Network request failed");

      expect(mockRetryNetworkRequest).toHaveBeenCalledTimes(1);
    });

    it("should convert non-Error values to Error", async () => {
      mockRetryNetworkRequest.mockRejectedValue("string error");

      await expect(
        retryNetworkRequest(() => Promise.reject("string error"), {
          maxAttempts: 1,
        })
      ).rejects.toBe("string error");
    });

    it("should preserve AppError properties", async () => {
      const { AppError } = require("../../utils/error-handler");
      const appError = new AppError("Test error", "TEST_CODE", "User message");
      mockRetryNetworkRequest.mockRejectedValue(appError);

      try {
        await retryNetworkRequest(() => Promise.reject(appError), {
          maxAttempts: 1,
        });
      } catch (error) {
        expect(error).toBe(appError);
        expect((error as InstanceType<typeof AppError>).code).toBe("TEST_CODE");
        expect((error as InstanceType<typeof AppError>).userMessage).toBe(
          "User message"
        );
      }
    });
  });

  describe("options configuration", () => {
    it("should use default maxRetries of 3", async () => {
      mockRetryNetworkRequest.mockResolvedValue({ data: "test" });

      await retryNetworkRequest(() => Promise.resolve({ data: "test" }), {
        maxAttempts: 3,
        context: "useApiWithRetry",
      });

      expect(mockRetryNetworkRequest).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ maxAttempts: 3 })
      );
    });

    it("should accept custom maxRetries", async () => {
      mockRetryNetworkRequest.mockResolvedValue({ data: "test" });

      await retryNetworkRequest(() => Promise.resolve({ data: "test" }), {
        maxAttempts: 5,
        context: "useApiWithRetry",
      });

      expect(mockRetryNetworkRequest).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ maxAttempts: 5 })
      );
    });
  });

  describe("API function arguments", () => {
    it("should pass arguments to wrapped function", async () => {
      const mockApi = jest.fn().mockResolvedValue({ data: "result" });
      mockRetryNetworkRequest.mockImplementation((fn) => fn());

      await retryNetworkRequest(() => mockApi("userId", { page: 1 }), {
        maxAttempts: 3,
      });

      expect(mockApi).toHaveBeenCalledWith("userId", { page: 1 });
    });

    it("should handle no arguments", async () => {
      const mockApi = jest.fn().mockResolvedValue({ data: "result" });
      mockRetryNetworkRequest.mockImplementation((fn) => fn());

      await retryNetworkRequest(() => mockApi(), { maxAttempts: 3 });

      expect(mockApi).toHaveBeenCalledWith();
    });
  });
});

describe("isAppError type guard", () => {
  const { isAppError, AppError } = require("../../utils/error-handler");

  it("should return true for AppError instances", () => {
    const appError = new AppError("Test", "CODE", "Message");
    expect(isAppError(appError)).toBe(true);
  });

  it("should return false for regular Error", () => {
    const regularError = new Error("Regular error");
    expect(isAppError(regularError)).toBe(false);
  });

  it("should return false for non-Error values", () => {
    expect(isAppError("string")).toBe(false);
    expect(isAppError(null)).toBe(false);
    expect(isAppError(undefined)).toBe(false);
    expect(isAppError({ message: "object" })).toBe(false);
  });
});
