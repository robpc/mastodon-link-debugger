type LinkCheck = {
  url: string;
  verified: string;
  checklist: {
    isHttps: boolean;
    isBodyLessThanOneMegabyte: boolean;
    hasProfileLink: boolean;
    hasRelMeAttribute: boolean;
  };
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
