/**
 * Retry Utility Tests
 *
 * Tests for withRetry and retryNetworkRequest functions.
 *
 * @module utils/__tests__/retry.test
 */

import { withRetry, retryNetworkRequest } from "../retry";

// Mock logger
jest.mock("../logger", () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

describe("withRetry", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("success cases", () => {
    it("should return result on first success", async () => {
      const mockFn = jest.fn().mockResolvedValue("success");

      const result = await withRetry(mockFn);

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should succeed after retries", async () => {
      const mockFn = jest
        .fn()
        .mockRejectedValueOnce(new Error("fail 1"))
        .mockRejectedValueOnce(new Error("fail 2"))
        .mockResolvedValue("success");

      const result = await withRetry(mockFn, {
        maxAttempts: 3,
        initialDelay: 10,
        maxDelay: 50,
      });

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(3);
    });
  });

  describe("failure cases", () => {
    it("should throw after max attempts", async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error("persistent error"));

      await expect(
        withRetry(mockFn, { maxAttempts: 3, initialDelay: 10 })
      ).rejects.toThrow("persistent error");

      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it("should throw immediately for non-retryable errors", async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error("critical error"));
      const retryable = jest.fn().mockReturnValue(false);

      await expect(
        withRetry(mockFn, { maxAttempts: 3, retryable })
      ).rejects.toThrow("critical error");

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(retryable).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("exponential backoff", () => {
    it("should call function correct number of times with backoff", async () => {
      const mockFn = jest
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValue("success");

      const result = await withRetry(mockFn, {
        maxAttempts: 3,
        initialDelay: 10,
        backoffMultiplier: 2,
      });

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it("should respect maxDelay", async () => {
      const mockFn = jest
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockRejectedValueOnce(new Error("fail"))
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValue("success");

      const startTime = Date.now();
      const result = await withRetry(mockFn, {
        maxAttempts: 4,
        initialDelay: 10,
        maxDelay: 20,
        backoffMultiplier: 2,
      });
      const elapsed = Date.now() - startTime;

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(4);
      // With maxDelay=20, delays should be 10, 20, 20 = ~50ms max
      expect(elapsed).toBeLessThan(200);
    });
  });

  describe("options", () => {
    it("should use default options when not provided", async () => {
      const mockFn = jest.fn().mockResolvedValue("result");

      await withRetry(mockFn);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should use custom maxAttempts", async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error("fail"));

      await expect(
        withRetry(mockFn, { maxAttempts: 2, initialDelay: 10 })
      ).rejects.toThrow("fail");

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it("should pass context to logger", async () => {
      const { logger } = require("../logger");
      const mockFn = jest.fn().mockRejectedValue(new Error("fail"));

      await expect(
        withRetry(mockFn, { maxAttempts: 1, context: "TestContext" })
      ).rejects.toThrow();

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("Failed after"),
        "TestContext",
        expect.any(Error)
      );
    });
  });

  describe("edge cases", () => {
    it("should handle non-Error throws", async () => {
      const mockFn = jest.fn().mockRejectedValue("string error");

      await expect(withRetry(mockFn, { maxAttempts: 1 })).rejects.toBe(
        "string error"
      );
    });

    it("should preserve error instance", async () => {
      class CustomError extends Error {
        code: number;
        constructor(code: number) {
          super("Custom error");
          this.code = code;
        }
      }

      const customError = new CustomError(500);
      const mockFn = jest.fn().mockRejectedValue(customError);

      await expect(withRetry(mockFn, { maxAttempts: 1 })).rejects.toBe(
        customError
      );
    });

    it("should log debug on retry attempts", async () => {
      const { logger } = require("../logger");
      const mockFn = jest
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValue("success");

      await withRetry(mockFn, {
        maxAttempts: 2,
        initialDelay: 10,
        context: "TestContext",
      });

      expect(logger.debug).toHaveBeenCalledWith(
        expect.stringContaining("Retry attempt"),
        "TestContext",
        expect.any(Object)
      );
    });
  });
});

describe("retryNetworkRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("network error detection", () => {
    it("should retry on network errors", async () => {
      const mockFn = jest
        .fn()
        .mockRejectedValueOnce(new Error("Network request failed"))
        .mockResolvedValue("success");

      const result = await retryNetworkRequest(mockFn, { initialDelay: 10 });

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it("should retry on timeout errors", async () => {
      const mockFn = jest
        .fn()
        .mockRejectedValueOnce(new Error("Request timeout"))
        .mockResolvedValue("success");

      const result = await retryNetworkRequest(mockFn, { initialDelay: 10 });

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it("should retry on fetch errors", async () => {
      const mockFn = jest
        .fn()
        .mockRejectedValueOnce(new Error("Failed to fetch"))
        .mockResolvedValue("success");

      const result = await retryNetworkRequest(mockFn, { initialDelay: 10 });

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it("should retry on connection errors", async () => {
      const mockFn = jest
        .fn()
        .mockRejectedValueOnce(new Error("Connection refused"))
        .mockResolvedValue("success");

      const result = await retryNetworkRequest(mockFn, { initialDelay: 10 });

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe("non-network errors", () => {
    it("should NOT retry on validation errors", async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error("Validation failed"));

      await expect(
        retryNetworkRequest(mockFn, { maxAttempts: 3, initialDelay: 10 })
      ).rejects.toThrow("Validation failed");

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should NOT retry on auth errors", async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error("Unauthorized"));

      await expect(
        retryNetworkRequest(mockFn, { maxAttempts: 3, initialDelay: 10 })
      ).rejects.toThrow("Unauthorized");

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should NOT retry on non-Error values", async () => {
      const mockFn = jest.fn().mockRejectedValue("string error");

      await expect(
        retryNetworkRequest(mockFn, { maxAttempts: 3, initialDelay: 10 })
      ).rejects.toBe("string error");

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should NOT retry on business logic errors", async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error("Invalid user ID"));

      await expect(
        retryNetworkRequest(mockFn, { maxAttempts: 3, initialDelay: 10 })
      ).rejects.toThrow("Invalid user ID");

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("options passthrough", () => {
    it("should respect maxAttempts option", async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error("Network error"));

      await expect(
        retryNetworkRequest(mockFn, { maxAttempts: 2, initialDelay: 10 })
      ).rejects.toThrow("Network error");

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it("should pass context option", async () => {
      const { logger } = require("../logger");
      const mockFn = jest.fn().mockRejectedValue(new Error("Network error"));

      await expect(
        retryNetworkRequest(mockFn, {
          maxAttempts: 1,
          context: "NetworkTest",
        })
      ).rejects.toThrow();

      expect(logger.error).toHaveBeenCalledWith(
        expect.any(String),
        "NetworkTest",
        expect.any(Error)
      );
    });
  });

  describe("mixed scenarios", () => {
    it("should retry network errors then succeed", async () => {
      const mockFn = jest
        .fn()
        .mockRejectedValueOnce(new Error("Network timeout"))
        .mockRejectedValueOnce(new Error("Connection failed"))
        .mockResolvedValue({ data: "success" });

      const result = await retryNetworkRequest(mockFn, {
        maxAttempts: 3,
        initialDelay: 10,
      });

      expect(result).toEqual({ data: "success" });
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it("should stop retrying after non-network error", async () => {
      const mockFn = jest
        .fn()
        .mockRejectedValueOnce(new Error("Network timeout"))
        .mockRejectedValueOnce(new Error("Invalid token"));

      await expect(
        retryNetworkRequest(mockFn, { maxAttempts: 3, initialDelay: 10 })
      ).rejects.toThrow("Invalid token");

      // Should have tried twice: first network error, then stopped at auth error
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
});
