type LinkCheck = {
  url: string;
  verified: string;
  isVerifiable: Boolean;
  checklist:
    | {
        isHttps: boolean;
        isLessThanFiveSeconds: boolean;
        isBodyLessThanOneMegabyte: boolean;
        hasProfileLink: boolean;
        hasRelMeAttribute: boolean;
      }
    | undefined;
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
