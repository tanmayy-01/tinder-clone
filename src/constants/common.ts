export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
  LIGHT_CONTENT: 'light-content',
  DARK_CONTENT: 'dark-content',
} as const;

export const COUNTRIES = [
  { code: 'IN', dialCode: '+91', name: 'India' },
  { code: 'US', dialCode: '+1', name: 'United States' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom' },
  { code: 'CA', dialCode: '+1', name: 'Canada' },
  { code: 'AU', dialCode: '+61', name: 'Australia' },
  { code: 'DE', dialCode: '+49', name: 'Germany' },
  { code: 'FR', dialCode: '+33', name: 'France' },
  { code: 'AE', dialCode: '+971', name: 'United Arab Emirates' },
];

export const SIGNUP_STEPS = {
  EMAIL: 'email',
  PHONE: 'phone',
  PASSWORD: 'password',
  DOB: 'dob',
} as const;

export const DOB_FIELDS = {
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
} as const;

export const AGE = {
  MIN: 18,
};
