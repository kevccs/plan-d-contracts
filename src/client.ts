import type { AppSession, CheckInRow, ProfileRow, PublicProfileRow } from './domain';

type JsonObject = Record<string, unknown>;

export type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: HeadersInit;
};

export type PlanDTransport = {
  requestJson<T>(path: string, options?: RequestOptions): Promise<T>;
  requestRaw(path: string, options?: RequestOptions): Promise<Response>;
};

export type AuthUser = {
  id: string;
  email: string;
  emailConfirmed?: boolean;
  email_confirmed_at?: string | null;
  confirmed_at?: string | null;
  user_metadata?: JsonObject;
  app_metadata?: JsonObject;
  created_at?: string | null;
};

export type AuthCookieResponse = {
  success: true;
  user: AuthUser | null;
  confirmationRequired?: boolean;
};

export type AuthStateResponse = {
  success: true;
  authenticated: boolean;
  user: AuthUser | null;
  profile: ProfileRow | null;
};

export type ProfileResponse = {
  success: true;
  profile: ProfileRow;
};

export type ProfilesResponse = {
  success: true;
  profiles: PublicProfileRow[];
};

export type AutomationAcceptedResponse = {
  success: true;
  sessionId?: string;
  sessionTitle?: string;
  lifecycleStatus?: string;
  statusCode?: number;
  responseBody?: unknown;
};

export type GenericSuccess = {
  success: true;
};

export type SessionListResponse = {
  success: true;
  sessions: AppSession[];
  writersRoomAvailability?: Record<string, boolean>;
};

export type SessionDetailResponse = {
  success: true;
  session: AppSession | null;
  scriptReady?: boolean;
};

export type CheckInStateResponse = {
  success: true;
  session: AppSession | null;
  sessionState: JsonObject | null;
  checkIn: CheckInRow | null;
  preferredRoles: string[];
};

export type UploadImageResponse = {
  success: true;
  publicUrl: string;
  path: string;
};

export type SubmitCheckInResponse = {
  success: true;
  checkIn: CheckInRow;
};

export type AdminTestLabSummary = {
  session: AppSession | null;
  participantCount: number;
  lastSeededAt: string | null;
  lastTriggeredAt: string | null;
  seedConfig: unknown;
} | null | { error: string };

export type AdminOverviewResponse = {
  success: true;
  settings?: JsonObject;
  sessions?: AppSession[];
  testLabSummary?: AdminTestLabSummary;
};

export type AdminTeamBuilderResponse = {
  success: true;
  teams?: unknown[];
  participants?: unknown[];
  message?: string | null;
};

export type AdminTestSessionProvisionResponse = {
  success: true;
  session?: AppSession;
  participantCount?: number;
  lastSeededAt?: string;
  summary?: AdminTestLabSummary;
};

const toQueryString = (params: Record<string, string | null | undefined>) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });

  const value = query.toString();
  return value ? `?${value}` : '';
};

export function createPlanDClient(transport: PlanDTransport) {
  return {
    auth: {
      login: (body: { email: string; password: string }) =>
        transport.requestJson<AuthCookieResponse>('/api/auth/login', { method: 'POST', body }),
      signup: (body: { email: string; password: string; fullName?: string; redirectTo?: string }) =>
        transport.requestJson<AuthCookieResponse>('/api/auth/signup', { method: 'POST', body }),
      syncSession: (body: { accessToken: string; refreshToken: string; expiresIn?: number }) =>
        transport.requestJson<AuthCookieResponse>('/api/auth/session', { method: 'POST', body }),
      me: () => transport.requestJson<AuthStateResponse>('/api/auth/me', { method: 'GET' }),
      updateAccount: (body: { email?: string; password?: string }) =>
        transport.requestJson<GenericSuccess>('/api/auth/account', { method: 'PATCH', body }),
      logout: () => transport.requestJson<GenericSuccess>('/api/auth/logout', { method: 'POST' }),
      resetPassword: (body: { email: string; redirectTo?: string }) =>
        transport.requestJson<GenericSuccess>('/api/auth/reset-password', { method: 'POST', body }),
      magicLink: (body: { email: string; redirectTo?: string }) =>
        transport.requestJson<GenericSuccess>('/api/auth/magic-link', { method: 'POST', body }),
      resendConfirmation: (body: { email: string; redirectTo?: string }) =>
        transport.requestJson<GenericSuccess>('/api/auth/resend-confirmation', { method: 'POST', body }),
    },
    profiles: {
      list: () => transport.requestJson<ProfilesResponse>('/api/profiles', { method: 'GET' }),
      me: () => transport.requestJson<ProfileResponse>('/api/profile/me', { method: 'GET' }),
      updateMe: (profile: JsonObject) =>
        transport.requestJson<ProfileResponse>('/api/profile/me', {
          method: 'PUT',
          body: { profile },
        }),
    },
    sessions: {
      list: (params: { includeTest?: boolean } = {}) =>
        transport.requestJson<SessionListResponse>(
          `/api/sessions${params.includeTest ? '?includeTest=true' : ''}`,
          { method: 'GET' }
        ),
      detail: (sessionId: string) =>
        transport.requestJson<SessionDetailResponse>(`/api/sessions/${encodeURIComponent(sessionId)}`, {
          method: 'GET',
        }),
    },
    checkIn: {
      state: (sessionId?: string) =>
        transport.requestJson<CheckInStateResponse>(
          `/api/check-in/state${toQueryString({ sessionId })}`,
          { method: 'GET' }
        ),
      uploadImage: (body: { sessionId: string; fileName: string; mimeType: string; fileData: string }) =>
        transport.requestJson<UploadImageResponse>('/api/check-in/upload-image', { method: 'POST', body }),
      submit: (body: JsonObject) =>
        transport.requestJson<SubmitCheckInResponse>('/api/check-in/submit', { method: 'POST', body }),
    },
    dashboard: {
      state: (preferredSessionId?: string) =>
        transport.requestJson<JsonObject>(
          `/api/dashboard/state${toQueryString({ preferredSessionId })}`,
          { method: 'GET' }
        ),
    },
    writersRoom: {
      state: (sessionId: string) =>
        transport.requestJson<JsonObject>(
          `/api/writers-room/state${toQueryString({ sessionId })}`,
          { method: 'GET' }
        ),
      submitFeedback: (body: JsonObject) =>
        transport.requestJson<JsonObject>('/api/automation/submit-feedback', { method: 'POST', body }),
      finalize: (body: JsonObject) =>
        transport.requestJson<AutomationAcceptedResponse>('/api/automation/finalize-session', {
          method: 'POST',
          body,
        }),
    },
    projectBrief: {
      state: (params: { sessionId?: string; teamId?: string } = {}) =>
        transport.requestJson<JsonObject>(
          `/api/project-brief/state${toQueryString(params)}`,
          { method: 'GET' }
        ),
      upsertShot: (body: JsonObject) =>
        transport.requestJson<JsonObject>('/api/project-brief/shots/upsert', { method: 'POST', body }),
      deleteShot: (body: JsonObject) =>
        transport.requestJson<GenericSuccess>('/api/project-brief/shots/delete', { method: 'POST', body }),
      submitFinal: (body: JsonObject) =>
        transport.requestJson<JsonObject>('/api/project-brief/submission', { method: 'POST', body }),
    },
    showcase: {
      submissions: () => transport.requestJson<JsonObject>('/api/showcase/submissions', { method: 'GET' }),
    },
    social: {
      follows: () => transport.requestJson<JsonObject>('/api/social/follows', { method: 'GET' }),
      setFollow: (body: { targetUserId: string; shouldFollow: boolean }) =>
        transport.requestJson<GenericSuccess>('/api/social/follows', { method: 'POST', body }),
      conversations: () =>
        transport.requestJson<{ success: true; conversations: unknown[]; unreadTotal: number }>('/api/social/conversations', {
          method: 'GET',
        }),
      createConversation: (body: { targetUserId: string }) =>
        transport.requestJson<{ success: true; conversationId: string }>('/api/social/conversations', {
          method: 'POST',
          body,
        }),
      sendMessage: (conversationId: string, body: { text: string; image?: JsonObject | null }) =>
        transport.requestJson<{ success: true; message: JsonObject }>(
          `/api/social/conversations/${encodeURIComponent(conversationId)}/messages`,
          { method: 'POST', body }
        ),
      markConversationRead: (conversationId: string) =>
        transport.requestJson<{ success: true; conversationId: string; lastReadAt: string }>(
          `/api/social/conversations/${encodeURIComponent(conversationId)}/read`,
          { method: 'POST' }
        ),
    },
    admin: {
      overview: () => transport.requestJson<AdminOverviewResponse>('/api/admin/overview', { method: 'GET' }),
      saveSettings: (body: JsonObject) =>
        transport.requestJson<JsonObject>('/api/admin/settings', { method: 'PATCH', body }),
      saveSession: (body: JsonObject) =>
        transport.requestJson<JsonObject>('/api/admin/sessions/save', { method: 'POST', body }),
      deleteSession: (sessionId: string) =>
        transport.requestRaw(`/api/admin/sessions/${encodeURIComponent(sessionId)}`, { method: 'DELETE' }),
      teamBuilder: (sessionId: string) =>
        transport.requestJson<AdminTeamBuilderResponse>(
          `/api/admin/team-builder${toQueryString({ sessionId })}`,
          { method: 'GET' }
        ),
      mutateTeamBuilder: (body: JsonObject) =>
        transport.requestJson<AdminTeamBuilderResponse>('/api/admin/team-builder', { method: 'POST', body }),
      submissions: () => transport.requestJson<JsonObject>('/api/admin/submissions', { method: 'GET' }),
      reviewSubmission: (submissionId: string, body: JsonObject) =>
        transport.requestJson<JsonObject>(
          `/api/admin/submissions/${encodeURIComponent(submissionId)}/review`,
          { method: 'POST', body }
        ),
      provisionTestSession: () =>
        transport.requestJson<AdminTestSessionProvisionResponse>('/api/admin/test-sessions/provision', {
          method: 'POST',
        }),
      resetTestSession: (sessionId: string) =>
        transport.requestJson<JsonObject>(
          `/api/admin/test-sessions/${encodeURIComponent(sessionId)}/reset`,
          { method: 'POST' }
        ),
      triggerAutomation: (body: { sessionId?: string } = {}) =>
        transport.requestJson<AutomationAcceptedResponse>('/api/automation/trigger-current-session', {
          method: 'POST',
          body,
        }),
    },
  };
}

export type PlanDClient = ReturnType<typeof createPlanDClient>;
