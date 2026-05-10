export type AppRole = 'participant' | 'admin';

export type SessionStatus =
  | 'draft'
  | 'checkin_open'
  | 'checkin_closed'
  | 'orchestrating'
  | 'released'
  | 'submissions_open'
  | 'submissions_closed'
  | 'published'
  | 'archived'
  | 'cancelled';

export type AppSession = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  base_location_name?: string | null;
  base_location_address?: string | null;
  checkin_open_at: string;
  checkin_close_at: string;
  submission_close_at: string;
  status: SessionStatus;
  timezone?: string | null;
  is_test?: boolean | null;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ProfileRow = {
  user_id: string;
  email?: string | null;
  display_name?: string | null;
  role?: AppRole | null;
  role_preferences?: string[] | null;
  suburb?: string | null;
  state_region?: string | null;
  country_code?: string | null;
  bio?: string | null;
  profile_photo_path?: string | null;
  profile_photo_url?: string | null;
  portfolio_links?: string[] | null;
  portfolio_items?: unknown;
  available_equipment?: string[] | null;
  social_links?: unknown;
  availability_status?: string | null;
  gallery_images?: string[] | null;
  display_name_changed_at?: string | null;
  public_profile?: boolean | null;
};

export type PublicProfileRow = Partial<ProfileRow> & Pick<ProfileRow, 'user_id'>;

export type CheckInRow = {
  id?: string;
  session_id?: string | null;
  user_id?: string | null;
  attendance_status?: string | null;
  role_preferences_for_today?: string[] | null;
  genre_preferences?: string[] | null;
  resource_details?: unknown;
  reference_image_urls?: string[] | null;
  checked_in_at?: string | null;
};

export type ApiSuccess<T extends Record<string, unknown> = Record<string, never>> = {
  success: true;
} & T;

export type ApiFailure = {
  success: false;
  message: string;
  responseBody?: unknown;
};

export type ApiResult<T extends Record<string, unknown> = Record<string, never>> =
  | ApiSuccess<T>
  | ApiFailure;
