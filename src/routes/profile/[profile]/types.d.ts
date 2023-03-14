type Checklist = {
  isHttps: boolean;
  isSuccessful: boolean;
  isLessThanFiveSeconds: boolean | null;
  hasProfileLink: boolean | null;
  hasRelMeAttribute: boolean | null;
};

type LinkCheck = {
  url: string;
  verified: string;
  isVerifiable: Boolean;
  allPassed: boolean;
  checklist: Checklist | undefined;
};

type MastodonProfile = {
  display_name: string;
  fields: {
    name: string;
    value: string;
    verified_at: string;
  }[];
};

type MastodonField = {
  name: string;
  value: string;
  verified_at: string;
};
