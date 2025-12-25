/**
 * Habits Store Tests
 *
 * Comprehensive unit tests for useHabitsStore.
 * Tests habit tracking, streak calculations, and daily resets.
 *
 * @module state/__tests__/habits-store.test
 */

import { act } from "react";
import { useHabitsStore, Habit } from "../store";

// Mock external dependencies
jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

// Helper to create a mock habit
const createMockHabit = (overrides: Partial<Habit> = {}): Habit => ({
  id: "habit-test",
  title: "Test Habit",
  description: "A test habit description",
  icon: "checkmark",
  color: "#4A90D9",
  category: "health",
  completed: false,
  streak: 0,
  bestStreak: 0,
  completedDates: [],
  ...overrides,
});

// Store the original default habits for comparison
const getDefaultHabitsCount = () => 8; // Based on DEFAULT_HABITS in store.ts

describe("useHabitsStore", () => {
  // Store initial state for reset
  const initialHabits = useHabitsStore.getState().habits.map((h) => ({
    ...h,
    completed: false,
    streak: 0,
    bestStreak: 0,
    completedDates: [],
  }));

  beforeEach(() => {
    // Reset store to initial state before each test
    act(() => {
      useHabitsStore.setState({
        habits: initialHabits.map((h) => ({ ...h })),
        weeklyCompletion: [0, 0, 0, 0, 0, 0, 0],
        totalStreak: 0,
      });
    });
  });

  describe("initial state", () => {
    it("should have default habits", () => {
      const state = useHabitsStore.getState();

      expect(state.habits).toHaveLength(getDefaultHabitsCount());
      expect(state.weeklyCompletion).toEqual([0, 0, 0, 0, 0, 0, 0]);
      expect(state.totalStreak).toBe(0);
    });

    it("should have all habits uncompleted initially", () => {
      const state = useHabitsStore.getState();

      state.habits.forEach((habit) => {
        expect(habit.completed).toBe(false);
        expect(habit.streak).toBe(0);
      });
    });

    it("should have valid categories for all default habits", () => {
      const validCategories = ["self-care", "health", "mindfulness", "connection", "growth"];
      const state = useHabitsStore.getState();

      state.habits.forEach((habit) => {
        expect(validCategories).toContain(habit.category);
      });
    });

    it("should have unique IDs for all default habits", () => {
      const state = useHabitsStore.getState();
      const ids = state.habits.map((h) => h.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("toggleHabit", () => {
    it("should complete a habit", () => {
      const habitId = useHabitsStore.getState().habits[0].id;
      const today = "2025-01-15";

      act(() => {
        useHabitsStore.getState().toggleHabit(habitId, today);
      });

      const habit = useHabitsStore.getState().habits.find((h) => h.id === habitId);
      expect(habit?.completed).toBe(true);
      expect(habit?.completedDates).toContain(today);
    });

    it("should increment streak when completing", () => {
      const habitId = useHabitsStore.getState().habits[0].id;
      const today = "2025-01-15";

      act(() => {
        useHabitsStore.getState().toggleHabit(habitId, today);
      });

      const habit = useHabitsStore.getState().habits.find((h) => h.id === habitId);
      expect(habit?.streak).toBe(1);
    });

    it("should uncomplete a habit", () => {
      const habitId = useHabitsStore.getState().habits[0].id;
      const today = "2025-01-15";

      // Complete first
      act(() => {
        useHabitsStore.getState().toggleHabit(habitId, today);
      });

      // Then uncomplete
      act(() => {
        useHabitsStore.getState().toggleHabit(habitId, today);
      });

      const habit = useHabitsStore.getState().habits.find((h) => h.id === habitId);
      expect(habit?.completed).toBe(false);
      expect(habit?.completedDates).not.toContain(today);
    });

    it("should decrement streak when uncompleting (min 0)", () => {
      const habitId = useHabitsStore.getState().habits[0].id;
      const today = "2025-01-15";

      // Complete
      act(() => {
        useHabitsStore.getState().toggleHabit(habitId, today);
      });

      // Uncomplete
      act(() => {
        useHabitsStore.getState().toggleHabit(habitId, today);
      });

      const habit = useHabitsStore.getState().habits.find((h) => h.id === habitId);
      expect(habit?.streak).toBe(0);
    });

    it("should not go below 0 streak", () => {
      const habitId = useHabitsStore.getState().habits[0].id;

      // Set streak to 0 explicitly
      act(() => {
        useHabitsStore.setState((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId ? { ...h, streak: 0, completed: true, completedDates: ["2025-01-15"] } : h
          ),
        }));
      });

      // Try to uncomplete (would decrement streak)
      act(() => {
        useHabitsStore.getState().toggleHabit(habitId, "2025-01-15");
      });

      const habit = useHabitsStore.getState().habits.find((h) => h.id === habitId);
      expect(habit?.streak).toBe(0); // Should not go negative
    });

    it("should update bestStreak when streak exceeds it", () => {
      const habitId = useHabitsStore.getState().habits[0].id;

      // Complete multiple days
      act(() => {
        useHabitsStore.getState().toggleHabit(habitId, "2025-01-13");
      });

      // Reset completed state but keep streak for next toggle
      act(() => {
        useHabitsStore.setState((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId ? { ...h, completed: false } : h
          ),
        }));
      });

      act(() => {
        useHabitsStore.getState().toggleHabit(habitId, "2025-01-14");
      });

      act(() => {
        useHabitsStore.setState((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId ? { ...h, completed: false } : h
          ),
        }));
      });

      act(() => {
        useHabitsStore.getState().toggleHabit(habitId, "2025-01-15");
      });

      const habit = useHabitsStore.getState().habits.find((h) => h.id === habitId);
      expect(habit?.bestStreak).toBe(3);
    });

    it("should not affect other habits when toggling one", () => {
      const habits = useHabitsStore.getState().habits;
      const habitId1 = habits[0].id;
      const habitId2 = habits[1].id;
      const today = "2025-01-15";

      act(() => {
        useHabitsStore.getState().toggleHabit(habitId1, today);
      });

      const habit2 = useHabitsStore.getState().habits.find((h) => h.id === habitId2);
      expect(habit2?.completed).toBe(false);
      expect(habit2?.streak).toBe(0);
    });

    it("should handle non-existent habit ID gracefully", () => {
      const originalHabits = [...useHabitsStore.getState().habits];

      act(() => {
        useHabitsStore.getState().toggleHabit("non-existent-id", "2025-01-15");
      });

      // All habits should remain unchanged
      const newHabits = useHabitsStore.getState().habits;
      expect(newHabits).toEqual(originalHabits);
    });
  });

  describe("addHabit", () => {
    it("should add a new habit", () => {
      const newHabit = createMockHabit({ id: "custom-habit" });
      const initialCount = useHabitsStore.getState().habits.length;

      act(() => {
        useHabitsStore.getState().addHabit(newHabit);
      });

      const state = useHabitsStore.getState();
      expect(state.habits).toHaveLength(initialCount + 1);
      expect(state.habits.find((h) => h.id === "custom-habit")).toBeDefined();
    });

    it("should add habit to the end of the list", () => {
      const newHabit = createMockHabit({ id: "new-habit", title: "New Habit" });

      act(() => {
        useHabitsStore.getState().addHabit(newHabit);
      });

      const habits = useHabitsStore.getState().habits;
      expect(habits[habits.length - 1].id).toBe("new-habit");
    });

    it("should add habit with all properties preserved", () => {
      const customHabit = createMockHabit({
        id: "custom-1",
        title: "Custom Title",
        description: "Custom description",
        icon: "star",
        color: "#FF0000",
        category: "mindfulness",
        completed: true,
        streak: 5,
        bestStreak: 10,
        completedDates: ["2025-01-14", "2025-01-15"],
      });

      act(() => {
        useHabitsStore.getState().addHabit(customHabit);
      });

      const addedHabit = useHabitsStore.getState().habits.find((h) => h.id === "custom-1");
      expect(addedHabit).toEqual(customHabit);
    });
  });

  describe("removeHabit", () => {
    it("should remove a habit by id", () => {
      const habitIdToRemove = useHabitsStore.getState().habits[0].id;
      const initialCount = useHabitsStore.getState().habits.length;

      act(() => {
        useHabitsStore.getState().removeHabit(habitIdToRemove);
      });

      const state = useHabitsStore.getState();
      expect(state.habits).toHaveLength(initialCount - 1);
      expect(state.habits.find((h) => h.id === habitIdToRemove)).toBeUndefined();
    });

    it("should not affect other habits when removing one", () => {
      const habits = useHabitsStore.getState().habits;
      const habitToRemove = habits[0];
      const habitToKeep = habits[1];

      act(() => {
        useHabitsStore.getState().removeHabit(habitToRemove.id);
      });

      const remainingHabit = useHabitsStore.getState().habits.find(
        (h) => h.id === habitToKeep.id
      );
      expect(remainingHabit).toEqual(habitToKeep);
    });

    it("should handle removing non-existent habit gracefully", () => {
      const initialCount = useHabitsStore.getState().habits.length;

      act(() => {
        useHabitsStore.getState().removeHabit("non-existent-id");
      });

      expect(useHabitsStore.getState().habits).toHaveLength(initialCount);
    });

    it("should remove custom habits", () => {
      const customHabit = createMockHabit({ id: "custom-to-remove" });

      act(() => {
        useHabitsStore.getState().addHabit(customHabit);
      });

      const countAfterAdd = useHabitsStore.getState().habits.length;

      act(() => {
        useHabitsStore.getState().removeHabit("custom-to-remove");
      });

      expect(useHabitsStore.getState().habits).toHaveLength(countAfterAdd - 1);
    });
  });

  describe("resetDailyHabits", () => {
    it("should reset all habits to uncompleted", () => {
      // Complete some habits first
      const habits = useHabitsStore.getState().habits;

      act(() => {
        useHabitsStore.getState().toggleHabit(habits[0].id, "2025-01-15");
        useHabitsStore.getState().toggleHabit(habits[1].id, "2025-01-15");
        useHabitsStore.getState().toggleHabit(habits[2].id, "2025-01-15");
      });

      // Verify some are completed
      expect(useHabitsStore.getState().habits.filter((h) => h.completed).length).toBe(3);

      // Reset
      act(() => {
        useHabitsStore.getState().resetDailyHabits();
      });

      // All should be uncompleted
      const state = useHabitsStore.getState();
      state.habits.forEach((habit) => {
        expect(habit.completed).toBe(false);
      });
    });

    it("should preserve streaks when resetting", () => {
      const habitId = useHabitsStore.getState().habits[0].id;

      // Complete a habit
      act(() => {
        useHabitsStore.getState().toggleHabit(habitId, "2025-01-15");
      });

      const streakBefore = useHabitsStore.getState().habits.find(
        (h) => h.id === habitId
      )?.streak;

      // Reset
      act(() => {
        useHabitsStore.getState().resetDailyHabits();
      });

      const streakAfter = useHabitsStore.getState().habits.find(
        (h) => h.id === habitId
      )?.streak;

      expect(streakAfter).toBe(streakBefore);
    });

    it("should preserve completedDates when resetting", () => {
      const habitId = useHabitsStore.getState().habits[0].id;

      // Complete a habit
      act(() => {
        useHabitsStore.getState().toggleHabit(habitId, "2025-01-15");
      });

      // Reset
      act(() => {
        useHabitsStore.getState().resetDailyHabits();
      });

      const habit = useHabitsStore.getState().habits.find((h) => h.id === habitId);
      expect(habit?.completedDates).toContain("2025-01-15");
    });

    it("should preserve bestStreak when resetting", () => {
      const habitId = useHabitsStore.getState().habits[0].id;

      // Set a best streak
      act(() => {
        useHabitsStore.setState((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId ? { ...h, bestStreak: 10 } : h
          ),
        }));
      });

      // Reset
      act(() => {
        useHabitsStore.getState().resetDailyHabits();
      });

      const habit = useHabitsStore.getState().habits.find((h) => h.id === habitId);
      expect(habit?.bestStreak).toBe(10);
    });
  });

  describe("getCompletedToday", () => {
    it("should return 0 when no habits are completed", () => {
      const count = useHabitsStore.getState().getCompletedToday();
      expect(count).toBe(0);
    });

    it("should return correct count of completed habits", () => {
      const habits = useHabitsStore.getState().habits;

      act(() => {
        useHabitsStore.getState().toggleHabit(habits[0].id, "2025-01-15");
        useHabitsStore.getState().toggleHabit(habits[1].id, "2025-01-15");
        useHabitsStore.getState().toggleHabit(habits[2].id, "2025-01-15");
      });

      const count = useHabitsStore.getState().getCompletedToday();
      expect(count).toBe(3);
    });

    it("should return correct count after toggling habits", () => {
      const habits = useHabitsStore.getState().habits;

      act(() => {
        useHabitsStore.getState().toggleHabit(habits[0].id, "2025-01-15");
        useHabitsStore.getState().toggleHabit(habits[1].id, "2025-01-15");
      });

      expect(useHabitsStore.getState().getCompletedToday()).toBe(2);

      // Uncomplete one
      act(() => {
        useHabitsStore.getState().toggleHabit(habits[0].id, "2025-01-15");
      });

      expect(useHabitsStore.getState().getCompletedToday()).toBe(1);
    });

    it("should return total count when all habits are completed", () => {
      const habits = useHabitsStore.getState().habits;

      act(() => {
        habits.forEach((habit) => {
          useHabitsStore.getState().toggleHabit(habit.id, "2025-01-15");
        });
      });

      const count = useHabitsStore.getState().getCompletedToday();
      expect(count).toBe(habits.length);
    });
  });

  describe("edge cases", () => {
    it("should handle completing same habit on different dates", () => {
      const habitId = useHabitsStore.getState().habits[0].id;

      act(() => {
        useHabitsStore.getState().toggleHabit(habitId, "2025-01-13");
      });

      // Reset completed status but keep streak
      act(() => {
        useHabitsStore.setState((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId ? { ...h, completed: false } : h
          ),
        }));
      });

      act(() => {
        useHabitsStore.getState().toggleHabit(habitId, "2025-01-14");
      });

      act(() => {
        useHabitsStore.setState((state) => ({
          habits: state.habits.map((h) =>
            h.id === habitId ? { ...h, completed: false } : h
          ),
        }));
      });

      act(() => {
        useHabitsStore.getState().toggleHabit(habitId, "2025-01-15");
      });

      const habit = useHabitsStore.getState().habits.find((h) => h.id === habitId);
      expect(habit?.completedDates).toContain("2025-01-13");
      expect(habit?.completedDates).toContain("2025-01-14");
      expect(habit?.completedDates).toContain("2025-01-15");
      expect(habit?.streak).toBe(3);
    });

    it("should handle empty habits array after removing all", () => {
      const habits = useHabitsStore.getState().habits;

      act(() => {
        habits.forEach((habit) => {
          useHabitsStore.getState().removeHabit(habit.id);
        });
      });

      expect(useHabitsStore.getState().habits).toHaveLength(0);
      expect(useHabitsStore.getState().getCompletedToday()).toBe(0);
    });

    it("should handle adding habit with same id as existing (creates duplicate)", () => {
      const existingId = useHabitsStore.getState().habits[0].id;
      const duplicateHabit = createMockHabit({ id: existingId, title: "Duplicate" });
      const initialCount = useHabitsStore.getState().habits.length;

      act(() => {
        useHabitsStore.getState().addHabit(duplicateHabit);
      });

      // Note: Current implementation allows duplicates
      expect(useHabitsStore.getState().habits).toHaveLength(initialCount + 1);
    });

    it("should handle multiple rapid toggles", () => {
      const habitId = useHabitsStore.getState().habits[0].id;
      const today = "2025-01-15";

      act(() => {
        // Toggle 5 times rapidly
        for (let i = 0; i < 5; i++) {
          useHabitsStore.getState().toggleHabit(habitId, today);
        }
      });

      // 5 toggles: completed -> uncompleted -> completed -> uncompleted -> completed
      const habit = useHabitsStore.getState().habits.find((h) => h.id === habitId);
      expect(habit?.completed).toBe(true);
    });
  });

  describe("habit categories", () => {
    it("should have habits in each category", () => {
      const habits = useHabitsStore.getState().habits;
      const categories = new Set(habits.map((h) => h.category));

      // Check that we have diversity in categories
      expect(categories.size).toBeGreaterThan(1);
    });

    it("should filter habits by category correctly", () => {
      const habits = useHabitsStore.getState().habits;
      const healthHabits = habits.filter((h) => h.category === "health");

      expect(healthHabits.length).toBeGreaterThan(0);
      healthHabits.forEach((habit) => {
        expect(habit.category).toBe("health");
      });
    });
  });

  describe("weeklyCompletion state", () => {
    it("should have 7 days in weeklyCompletion", () => {
      const state = useHabitsStore.getState();
      expect(state.weeklyCompletion).toHaveLength(7);
    });

    it("should initialize all days to 0", () => {
      const state = useHabitsStore.getState();
      state.weeklyCompletion.forEach((day) => {
        expect(day).toBe(0);
      });
    });
  });
});
