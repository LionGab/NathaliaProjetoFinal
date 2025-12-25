/**
 * Zustand Store Tests
 *
 * Comprehensive unit tests for useAppStore, useChatStore,
 * useCycleStore, useAffirmationsStore, and useCheckInStore.
 *
 * @module state/__tests__/store.test
 */

import { act } from "react";
import {
  useAppStore,
  useCommunityStore,
  useChatStore,
  useCycleStore,
  useAffirmationsStore,
  useCheckInStore,
} from "../store";
import type { UserProfile, Post, DailyLog, Affirmation, Interest, ChatMessage } from "../../types/navigation";

// Mock external dependencies
jest.mock("../../api/auth", () => ({
  onAuthStateChange: jest.fn(),
}));

jest.mock("../../api/database", () => ({
  getUserProfile: jest.fn().mockResolvedValue({ data: null, error: null }),
}));

jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

jest.mock("../../services/revenuecat", () => ({
  loginUser: jest.fn().mockResolvedValue(undefined),
}));

// Helper to create a mock user profile
const createMockUser = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  id: "user-123",
  email: "test@example.com",
  name: "Test User",
  avatarUrl: undefined,
  stage: "pregnant",
  dueDate: "2025-06-15",
  interests: ["nutrition", "exercise"] as Interest[],
  createdAt: "2025-01-01T00:00:00Z",
  hasCompletedOnboarding: true,
  ...overrides,
});

// Helper to create a mock post
const createMockPost = (overrides: Partial<Post> = {}): Post => ({
  id: "post-123",
  content: "Test post content",
  authorId: "user-123",
  authorName: "Test User",
  authorAvatar: undefined,
  createdAt: "2025-01-01T00:00:00Z",
  likesCount: 0,
  commentsCount: 0,
  isLiked: false,
  ...overrides,
});

// Helper to create a mock affirmation
const createMockAffirmation = (overrides: Partial<Affirmation> = {}): Affirmation => ({
  id: "affirmation-123",
  text: "You are doing great!",
  category: "self-love",
  ...overrides,
});

// Helper to create a mock daily log
const createMockDailyLog = (overrides: Partial<DailyLog> = {}): DailyLog => ({
  id: "log-123",
  date: "2025-01-15",
  mood: ["happy"],
  symptoms: ["fatigue"],
  notes: "Feeling good today",
  ...overrides,
});

// Helper to create a mock chat message
const createMockMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: "msg-123",
  role: "user",
  content: "Test message",
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe("useAppStore", () => {
  // Reset store before each test
  beforeEach(() => {
    act(() => {
      useAppStore.setState({
        user: null,
        authUserId: null,
        isAuthenticated: false,
        isOnboardingComplete: false,
        currentOnboardingStep: "welcome",
        theme: "light",
        isDarkMode: false,
        onboardingDraft: {
          name: "",
          stage: null,
          dueDate: null,
          interests: [],
        },
      });
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = useAppStore.getState();

      expect(state.user).toBeNull();
      expect(state.authUserId).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isOnboardingComplete).toBe(false);
      expect(state.currentOnboardingStep).toBe("welcome");
      expect(state.theme).toBe("light");
      expect(state.isDarkMode).toBe(false);
      expect(state.onboardingDraft).toEqual({
        name: "",
        stage: null,
        dueDate: null,
        interests: [],
      });
    });
  });

  describe("user actions", () => {
    it("should set user", () => {
      const mockUser = createMockUser();

      act(() => {
        useAppStore.getState().setUser(mockUser);
      });

      expect(useAppStore.getState().user).toEqual(mockUser);
    });

    it("should set user to null", () => {
      const mockUser = createMockUser();

      act(() => {
        useAppStore.getState().setUser(mockUser);
      });

      act(() => {
        useAppStore.getState().setUser(null);
      });

      expect(useAppStore.getState().user).toBeNull();
    });

    it("should set authUserId", () => {
      act(() => {
        useAppStore.getState().setAuthUserId("user-456");
      });

      expect(useAppStore.getState().authUserId).toBe("user-456");
    });

    it("should set authenticated state", () => {
      act(() => {
        useAppStore.getState().setAuthenticated(true);
      });

      expect(useAppStore.getState().isAuthenticated).toBe(true);

      act(() => {
        useAppStore.getState().setAuthenticated(false);
      });

      expect(useAppStore.getState().isAuthenticated).toBe(false);
    });

    it("should update user partially", () => {
      const mockUser = createMockUser();

      act(() => {
        useAppStore.getState().setUser(mockUser);
      });

      act(() => {
        useAppStore.getState().updateUser({ name: "Updated Name", stage: "postpartum" });
      });

      const user = useAppStore.getState().user;
      expect(user?.name).toBe("Updated Name");
      expect(user?.stage).toBe("postpartum");
      expect(user?.email).toBe("test@example.com"); // Unchanged
    });

    it("should not update user when user is null", () => {
      act(() => {
        useAppStore.getState().updateUser({ name: "Should Not Set" });
      });

      expect(useAppStore.getState().user).toBeNull();
    });

    it("should clear user and reset auth state", () => {
      const mockUser = createMockUser();

      act(() => {
        useAppStore.getState().setUser(mockUser);
        useAppStore.getState().setAuthUserId("user-123");
        useAppStore.getState().setAuthenticated(true);
        useAppStore.getState().setOnboardingComplete(true);
      });

      act(() => {
        useAppStore.getState().clearUser();
      });

      const state = useAppStore.getState();
      expect(state.user).toBeNull();
      expect(state.authUserId).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isOnboardingComplete).toBe(false);
    });
  });

  describe("onboarding actions", () => {
    it("should set onboarding complete", () => {
      act(() => {
        useAppStore.getState().setOnboardingComplete(true);
      });

      expect(useAppStore.getState().isOnboardingComplete).toBe(true);
    });

    it("should set onboarding step", () => {
      act(() => {
        useAppStore.getState().setOnboardingStep("interests");
      });

      expect(useAppStore.getState().currentOnboardingStep).toBe("interests");
    });

    it("should update onboarding draft partially", () => {
      act(() => {
        useAppStore.getState().updateOnboardingDraft({ name: "Maria" });
      });

      expect(useAppStore.getState().onboardingDraft.name).toBe("Maria");
      expect(useAppStore.getState().onboardingDraft.stage).toBeNull();

      act(() => {
        useAppStore.getState().updateOnboardingDraft({ stage: "pregnant", interests: ["mental_health"] as Interest[] });
      });

      const draft = useAppStore.getState().onboardingDraft;
      expect(draft.name).toBe("Maria");
      expect(draft.stage).toBe("pregnant");
      expect(draft.interests).toEqual(["mental_health"]);
    });

    it("should clear onboarding draft", () => {
      act(() => {
        useAppStore.getState().updateOnboardingDraft({
          name: "Maria",
          stage: "pregnant",
          dueDate: "2025-06-01",
          interests: ["exercise", "sleep"] as Interest[],
        });
      });

      act(() => {
        useAppStore.getState().clearOnboardingDraft();
      });

      expect(useAppStore.getState().onboardingDraft).toEqual({
        name: "",
        stage: null,
        dueDate: null,
        interests: [],
      });
    });
  });

  describe("theme actions", () => {
    it("should set theme", () => {
      act(() => {
        useAppStore.getState().setTheme("dark");
      });

      expect(useAppStore.getState().theme).toBe("dark");

      act(() => {
        useAppStore.getState().setTheme("system");
      });

      expect(useAppStore.getState().theme).toBe("system");
    });

    it("should set isDarkMode", () => {
      act(() => {
        useAppStore.getState().setIsDarkMode(true);
      });

      expect(useAppStore.getState().isDarkMode).toBe(true);
    });
  });

  describe("loadUserProfile", () => {
    it("should handle profile loading error gracefully", async () => {
      const { getUserProfile } = require("../../api/database");
      getUserProfile.mockResolvedValueOnce({
        data: null,
        error: new Error("Profile not found"),
      });

      await act(async () => {
        await useAppStore.getState().loadUserProfile("user-123");
      });

      // Should not throw, user remains null
      expect(useAppStore.getState().user).toBeNull();
    });

    it("should set user when profile loads successfully", async () => {
      const mockProfile = createMockUser();
      const { getUserProfile } = require("../../api/database");
      getUserProfile.mockResolvedValueOnce({
        data: mockProfile,
        error: null,
      });

      await act(async () => {
        await useAppStore.getState().loadUserProfile("user-123");
      });

      expect(useAppStore.getState().user).toEqual(mockProfile);
    });
  });
});

describe("useCommunityStore", () => {
  beforeEach(() => {
    act(() => {
      useCommunityStore.setState({
        posts: [],
        groups: [],
      });
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = useCommunityStore.getState();

      expect(state.posts).toEqual([]);
      expect(state.groups).toEqual([]);
    });
  });

  describe("post actions", () => {
    it("should set posts", () => {
      const posts = [createMockPost({ id: "1" }), createMockPost({ id: "2" })];

      act(() => {
        useCommunityStore.getState().setPosts(posts);
      });

      expect(useCommunityStore.getState().posts).toHaveLength(2);
    });

    it("should add post to beginning", () => {
      const existingPost = createMockPost({ id: "existing" });
      const newPost = createMockPost({ id: "new", content: "New post" });

      act(() => {
        useCommunityStore.getState().setPosts([existingPost]);
      });

      act(() => {
        useCommunityStore.getState().addPost(newPost);
      });

      const posts = useCommunityStore.getState().posts;
      expect(posts).toHaveLength(2);
      expect(posts[0].id).toBe("new");
      expect(posts[1].id).toBe("existing");
    });

    it("should toggle like on post", () => {
      const post = createMockPost({ id: "post-1", isLiked: false, likesCount: 5 });

      act(() => {
        useCommunityStore.getState().setPosts([post]);
      });

      // Like the post
      act(() => {
        useCommunityStore.getState().toggleLike("post-1");
      });

      let updatedPost = useCommunityStore.getState().posts[0];
      expect(updatedPost.isLiked).toBe(true);
      expect(updatedPost.likesCount).toBe(6);

      // Unlike the post
      act(() => {
        useCommunityStore.getState().toggleLike("post-1");
      });

      updatedPost = useCommunityStore.getState().posts[0];
      expect(updatedPost.isLiked).toBe(false);
      expect(updatedPost.likesCount).toBe(5);
    });

    it("should not affect other posts when toggling like", () => {
      const posts = [
        createMockPost({ id: "1", likesCount: 10 }),
        createMockPost({ id: "2", likesCount: 5 }),
      ];

      act(() => {
        useCommunityStore.getState().setPosts(posts);
      });

      act(() => {
        useCommunityStore.getState().toggleLike("1");
      });

      const state = useCommunityStore.getState().posts;
      expect(state[0].likesCount).toBe(11);
      expect(state[1].likesCount).toBe(5); // Unchanged
    });
  });

  describe("group actions", () => {
    it("should set groups", () => {
      const groups = [
        { id: "g1", name: "Grávidas", memberCount: 100 },
        { id: "g2", name: "Puérperas", memberCount: 50 },
      ];

      act(() => {
        useCommunityStore.getState().setGroups(groups as never);
      });

      expect(useCommunityStore.getState().groups).toHaveLength(2);
    });
  });
});

describe("useChatStore", () => {
  beforeEach(() => {
    act(() => {
      useChatStore.setState({
        conversations: [],
        currentConversationId: null,
        isLoading: false,
        isHistoryOpen: false,
        hasAcceptedAITerms: false,
      });
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = useChatStore.getState();

      expect(state.conversations).toEqual([]);
      expect(state.currentConversationId).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isHistoryOpen).toBe(false);
      expect(state.hasAcceptedAITerms).toBe(false);
    });
  });

  describe("conversation actions", () => {
    it("should create a new conversation", () => {
      let conversationId: string;

      act(() => {
        conversationId = useChatStore.getState().createConversation();
      });

      const state = useChatStore.getState();
      expect(state.conversations).toHaveLength(1);
      expect(state.currentConversationId).toBe(conversationId!);
      expect(state.conversations[0].title).toBe("Nova conversa");
      expect(state.conversations[0].messages).toEqual([]);
    });

    it("should delete a conversation", () => {
      let id1: string, id2: string;

      // Create first conversation
      act(() => {
        id1 = useChatStore.getState().createConversation();
      });

      // Add second conversation manually to ensure different ID
      act(() => {
        id2 = (Date.now() + 1000).toString();
        useChatStore.setState((state) => ({
          conversations: [
            {
              id: id2,
              title: "Second conversation",
              messages: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.conversations,
          ],
          currentConversationId: id2,
        }));
      });

      expect(useChatStore.getState().conversations).toHaveLength(2);

      act(() => {
        useChatStore.getState().deleteConversation(id1!);
      });

      const state = useChatStore.getState();
      expect(state.conversations).toHaveLength(1);
      expect(state.conversations[0].id).toBe(id2!);
    });

    it("should update currentConversationId when deleting current", () => {
      let id1: string, id2: string;

      // Create conversations in separate act blocks to avoid same timestamp
      act(() => {
        id1 = useChatStore.getState().createConversation();
      });

      // Use setState to add second conversation with different ID
      act(() => {
        id2 = (Date.now() + 1).toString();
        useChatStore.setState((state) => ({
          conversations: [
            {
              id: id2,
              title: "Second conversation",
              messages: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.conversations,
          ],
        }));
        useChatStore.getState().setCurrentConversation(id1!);
      });

      act(() => {
        useChatStore.getState().deleteConversation(id1!);
      });

      // After deleting id1, should fall back to first remaining conversation (id2)
      expect(useChatStore.getState().currentConversationId).toBe(id2!);
    });

    it("should set currentConversationId to null when deleting last conversation", () => {
      let id: string;

      act(() => {
        id = useChatStore.getState().createConversation();
      });

      act(() => {
        useChatStore.getState().deleteConversation(id!);
      });

      expect(useChatStore.getState().currentConversationId).toBeNull();
    });

    it("should set current conversation", () => {
      let id: string;

      act(() => {
        id = useChatStore.getState().createConversation();
        useChatStore.getState().setCurrentConversation(null);
      });

      expect(useChatStore.getState().currentConversationId).toBeNull();

      act(() => {
        useChatStore.getState().setCurrentConversation(id!);
      });

      expect(useChatStore.getState().currentConversationId).toBe(id!);
    });
  });

  describe("message actions", () => {
    it("should add message to existing conversation", () => {
      let conversationId: string;

      act(() => {
        conversationId = useChatStore.getState().createConversation();
      });

      const message = createMockMessage({
        id: "msg-1",
        content: "Hello NathIA!",
      });

      act(() => {
        useChatStore.getState().addMessage(message);
      });

      const conversation = useChatStore.getState().conversations.find(
        (c) => c.id === conversationId!
      );
      expect(conversation?.messages).toHaveLength(1);
      expect(conversation?.messages[0].content).toBe("Hello NathIA!");
    });

    it("should create conversation when adding message without current", () => {
      const message = createMockMessage({
        id: "msg-1",
        content: "First message",
      });

      act(() => {
        useChatStore.getState().addMessage(message);
      });

      const state = useChatStore.getState();
      expect(state.conversations).toHaveLength(1);
      expect(state.currentConversationId).not.toBeNull();
      expect(state.conversations[0].messages).toHaveLength(1);
    });

    it("should update conversation title from first user message", () => {
      const message = createMockMessage({
        id: "msg-1",
        content: "How do I handle morning sickness during pregnancy?",
      });

      act(() => {
        useChatStore.getState().addMessage(message);
      });

      const conversation = useChatStore.getState().conversations[0];
      // Title is first 30 chars + "..." when creating new conversation
      expect(conversation.title).toBe("How do I handle morning sickne...");
    });

    it("should get current messages", () => {
      act(() => {
        useChatStore.getState().createConversation();
        useChatStore.getState().addMessage(createMockMessage({
          id: "msg-1",
          content: "Test",
        }));
      });

      const messages = useChatStore.getState().getCurrentMessages();
      expect(messages).toHaveLength(1);
    });

    it("should return empty array when no current conversation", () => {
      const messages = useChatStore.getState().getCurrentMessages();
      expect(messages).toEqual([]);
    });
  });

  describe("UI state actions", () => {
    it("should set loading state", () => {
      act(() => {
        useChatStore.getState().setLoading(true);
      });

      expect(useChatStore.getState().isLoading).toBe(true);

      act(() => {
        useChatStore.getState().setLoading(false);
      });

      expect(useChatStore.getState().isLoading).toBe(false);
    });

    it("should toggle history sidebar", () => {
      expect(useChatStore.getState().isHistoryOpen).toBe(false);

      act(() => {
        useChatStore.getState().toggleHistory();
      });

      expect(useChatStore.getState().isHistoryOpen).toBe(true);

      act(() => {
        useChatStore.getState().toggleHistory();
      });

      expect(useChatStore.getState().isHistoryOpen).toBe(false);
    });

    it("should accept AI terms", () => {
      expect(useChatStore.getState().hasAcceptedAITerms).toBe(false);

      act(() => {
        useChatStore.getState().acceptAITerms();
      });

      expect(useChatStore.getState().hasAcceptedAITerms).toBe(true);
    });
  });

  describe("conversation management", () => {
    it("should clear current chat", () => {
      act(() => {
        useChatStore.getState().createConversation();
        useChatStore.getState().addMessage(createMockMessage({
          id: "msg-1",
          content: "Test",
        }));
      });

      expect(useChatStore.getState().conversations).toHaveLength(1);

      act(() => {
        useChatStore.getState().clearCurrentChat();
      });

      expect(useChatStore.getState().conversations).toHaveLength(0);
      expect(useChatStore.getState().currentConversationId).toBeNull();
    });

    it("should update conversation title", () => {
      let conversationId: string;

      act(() => {
        conversationId = useChatStore.getState().createConversation();
      });

      act(() => {
        useChatStore.getState().updateConversationTitle(conversationId!, "Custom Title");
      });

      const conversation = useChatStore.getState().conversations[0];
      expect(conversation.title).toBe("Custom Title");
    });
  });
});

describe("useCycleStore", () => {
  beforeEach(() => {
    act(() => {
      useCycleStore.setState({
        lastPeriodStart: null,
        cycleLength: 28,
        periodLength: 5,
        dailyLogs: [],
      });
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = useCycleStore.getState();

      expect(state.lastPeriodStart).toBeNull();
      expect(state.cycleLength).toBe(28);
      expect(state.periodLength).toBe(5);
      expect(state.dailyLogs).toEqual([]);
    });
  });

  describe("period tracking", () => {
    it("should set last period start date", () => {
      act(() => {
        useCycleStore.getState().setLastPeriodStart("2025-01-01");
      });

      expect(useCycleStore.getState().lastPeriodStart).toBe("2025-01-01");
    });

    it("should set cycle length", () => {
      act(() => {
        useCycleStore.getState().setCycleLength(30);
      });

      expect(useCycleStore.getState().cycleLength).toBe(30);
    });

    it("should set period length", () => {
      act(() => {
        useCycleStore.getState().setPeriodLength(7);
      });

      expect(useCycleStore.getState().periodLength).toBe(7);
    });
  });

  describe("daily logs", () => {
    it("should add daily log", () => {
      const log = createMockDailyLog({ date: "2025-01-15" });

      act(() => {
        useCycleStore.getState().addDailyLog(log);
      });

      expect(useCycleStore.getState().dailyLogs).toHaveLength(1);
      expect(useCycleStore.getState().dailyLogs[0]).toEqual(log);
    });

    it("should replace log for same date", () => {
      const log1 = createMockDailyLog({ date: "2025-01-15", mood: ["happy"] });
      const log2 = createMockDailyLog({ date: "2025-01-15", mood: ["tired"] });

      act(() => {
        useCycleStore.getState().addDailyLog(log1);
      });

      act(() => {
        useCycleStore.getState().addDailyLog(log2);
      });

      const logs = useCycleStore.getState().dailyLogs;
      expect(logs).toHaveLength(1);
      expect(logs[0].mood).toEqual(["tired"]);
    });

    it("should update daily log by id", () => {
      const log = createMockDailyLog({ id: "log-1", mood: ["happy"] });

      act(() => {
        useCycleStore.getState().addDailyLog(log);
      });

      act(() => {
        useCycleStore.getState().updateDailyLog("log-1", { mood: ["tired"], notes: "Updated notes" });
      });

      const updatedLog = useCycleStore.getState().dailyLogs[0];
      expect(updatedLog.mood).toEqual(["tired"]);
      expect(updatedLog.notes).toBe("Updated notes");
    });

    it("should get daily log by date", () => {
      const log = createMockDailyLog({ date: "2025-01-15" });

      act(() => {
        useCycleStore.getState().addDailyLog(log);
      });

      const foundLog = useCycleStore.getState().getDailyLog("2025-01-15");
      expect(foundLog).toEqual(log);
    });

    it("should return undefined for non-existent date", () => {
      const foundLog = useCycleStore.getState().getDailyLog("2025-01-15");
      expect(foundLog).toBeUndefined();
    });
  });
});

describe("useAffirmationsStore", () => {
  beforeEach(() => {
    act(() => {
      useAffirmationsStore.setState({
        todayAffirmation: null,
        favoriteAffirmations: [],
        lastShownDate: null,
      });
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = useAffirmationsStore.getState();

      expect(state.todayAffirmation).toBeNull();
      expect(state.favoriteAffirmations).toEqual([]);
      expect(state.lastShownDate).toBeNull();
    });
  });

  describe("affirmation actions", () => {
    it("should set today affirmation", () => {
      const affirmation = createMockAffirmation();

      act(() => {
        useAffirmationsStore.getState().setTodayAffirmation(affirmation);
      });

      expect(useAffirmationsStore.getState().todayAffirmation).toEqual(affirmation);
    });

    it("should add to favorites", () => {
      const affirmation1 = createMockAffirmation({ id: "1" });
      const affirmation2 = createMockAffirmation({ id: "2" });

      act(() => {
        useAffirmationsStore.getState().addToFavorites(affirmation1);
      });

      act(() => {
        useAffirmationsStore.getState().addToFavorites(affirmation2);
      });

      expect(useAffirmationsStore.getState().favoriteAffirmations).toHaveLength(2);
    });

    it("should remove from favorites", () => {
      const affirmation1 = createMockAffirmation({ id: "1" });
      const affirmation2 = createMockAffirmation({ id: "2" });

      act(() => {
        useAffirmationsStore.getState().addToFavorites(affirmation1);
        useAffirmationsStore.getState().addToFavorites(affirmation2);
      });

      act(() => {
        useAffirmationsStore.getState().removeFromFavorites("1");
      });

      const favorites = useAffirmationsStore.getState().favoriteAffirmations;
      expect(favorites).toHaveLength(1);
      expect(favorites[0].id).toBe("2");
    });

    it("should set last shown date", () => {
      act(() => {
        useAffirmationsStore.getState().setLastShownDate("2025-01-15");
      });

      expect(useAffirmationsStore.getState().lastShownDate).toBe("2025-01-15");
    });
  });
});

describe("useCheckInStore", () => {
  const mockToday = "2025-01-15";

  beforeEach(() => {
    // Mock Date.now and toISOString to return consistent date
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-15T12:00:00Z"));

    act(() => {
      useCheckInStore.setState({
        checkIns: [],
        todayCheckIn: null,
        streak: 0,
      });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = useCheckInStore.getState();

      expect(state.checkIns).toEqual([]);
      expect(state.todayCheckIn).toBeNull();
      expect(state.streak).toBe(0);
    });
  });

  describe("mood check-in", () => {
    it("should set today mood for new check-in", () => {
      act(() => {
        useCheckInStore.getState().setTodayMood(4);
      });

      const state = useCheckInStore.getState();
      expect(state.checkIns).toHaveLength(1);
      expect(state.checkIns[0].mood).toBe(4);
      expect(state.checkIns[0].date).toBe(mockToday);
      expect(state.todayCheckIn?.mood).toBe(4);
    });

    it("should update mood for existing check-in", () => {
      act(() => {
        useCheckInStore.getState().setTodayMood(3);
      });

      act(() => {
        useCheckInStore.getState().setTodayMood(5);
      });

      const state = useCheckInStore.getState();
      expect(state.checkIns).toHaveLength(1);
      expect(state.checkIns[0].mood).toBe(5);
    });
  });

  describe("energy check-in", () => {
    it("should set today energy for new check-in", () => {
      act(() => {
        useCheckInStore.getState().setTodayEnergy(3);
      });

      const state = useCheckInStore.getState();
      expect(state.checkIns).toHaveLength(1);
      expect(state.checkIns[0].energy).toBe(3);
    });

    it("should update energy for existing check-in", () => {
      act(() => {
        useCheckInStore.getState().setTodayMood(4);
      });

      act(() => {
        useCheckInStore.getState().setTodayEnergy(2);
      });

      const state = useCheckInStore.getState();
      expect(state.checkIns).toHaveLength(1);
      expect(state.checkIns[0].mood).toBe(4);
      expect(state.checkIns[0].energy).toBe(2);
    });
  });

  describe("sleep check-in", () => {
    it("should set today sleep for new check-in", () => {
      act(() => {
        useCheckInStore.getState().setTodaySleep(5);
      });

      const state = useCheckInStore.getState();
      expect(state.checkIns).toHaveLength(1);
      expect(state.checkIns[0].sleep).toBe(5);
    });
  });

  describe("note check-in", () => {
    it("should set note for existing check-in", () => {
      act(() => {
        useCheckInStore.getState().setTodayMood(4);
      });

      act(() => {
        useCheckInStore.getState().setTodayNote("Feeling great today!");
      });

      const state = useCheckInStore.getState();
      expect(state.checkIns[0].note).toBe("Feeling great today!");
    });

    it("should not add note when no existing check-in", () => {
      act(() => {
        useCheckInStore.getState().setTodayNote("Should not be added");
      });

      expect(useCheckInStore.getState().checkIns).toHaveLength(0);
    });
  });

  describe("check-in queries", () => {
    it("should get today check-in", () => {
      act(() => {
        useCheckInStore.getState().setTodayMood(4);
        useCheckInStore.getState().setTodayEnergy(3);
      });

      const todayCheckIn = useCheckInStore.getState().getTodayCheckIn();
      expect(todayCheckIn).not.toBeNull();
      expect(todayCheckIn?.mood).toBe(4);
      expect(todayCheckIn?.energy).toBe(3);
    });

    it("should return null when no today check-in", () => {
      const todayCheckIn = useCheckInStore.getState().getTodayCheckIn();
      expect(todayCheckIn).toBeNull();
    });

    it("should check if check-in is complete", () => {
      expect(useCheckInStore.getState().isCheckInComplete()).toBe(false);

      act(() => {
        useCheckInStore.getState().setTodayMood(4);
      });

      expect(useCheckInStore.getState().isCheckInComplete()).toBe(false);

      act(() => {
        useCheckInStore.getState().setTodayEnergy(3);
      });

      expect(useCheckInStore.getState().isCheckInComplete()).toBe(false);

      act(() => {
        useCheckInStore.getState().setTodaySleep(5);
      });

      expect(useCheckInStore.getState().isCheckInComplete()).toBe(true);
    });
  });

  describe("complete check-in flow", () => {
    it("should handle complete check-in flow", () => {
      // Set all three required fields
      act(() => {
        useCheckInStore.getState().setTodayMood(4);
        useCheckInStore.getState().setTodayEnergy(3);
        useCheckInStore.getState().setTodaySleep(5);
        useCheckInStore.getState().setTodayNote("Great day!");
      });

      const state = useCheckInStore.getState();
      expect(state.isCheckInComplete()).toBe(true);

      const checkIn = state.checkIns[0];
      expect(checkIn.mood).toBe(4);
      expect(checkIn.energy).toBe(3);
      expect(checkIn.sleep).toBe(5);
      expect(checkIn.note).toBe("Great day!");
    });
  });
});
