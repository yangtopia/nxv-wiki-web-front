export interface KakaoAuthTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

export interface KakaoAccountResponse {
  id: number;
  connected_at: string;
  properties: Properties;
  kakao_account: KakaoAccount;
}

export interface KakaoAccount {
  profile_needs_agreement: boolean;
  profile: Profile;
  has_email: boolean;
  email_needs_agreement: boolean;
  is_email_valid: boolean;
  is_email_verified: boolean;
  email: string;
  has_age_range: boolean;
  age_range_needs_agreement: boolean;
  age_range: string;
  has_birthday: boolean;
  birthday_needs_agreement: boolean;
  birthday: string;
  birthday_type: string;
  has_gender: boolean;
  gender_needs_agreement: boolean;
  gender: string;
}

export interface Profile {
  nickname: string;
  thumbnail_image_url: string;
  profile_image_url: string;
}

export interface Properties {
  nickname: string;
  profile_image: string;
  thumbnail_image: string;
}
