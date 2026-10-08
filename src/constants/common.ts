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
  GENDER: 'gender',
} as const;

export const GENDER_OPTIONS = {
  WOMAN: 'Woman',
  MAN: 'Man',
} as const;

export const DOB_FIELDS = {
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
} as const;

export const AGE = {
  MIN: 18,
};

export const TOTAL_SLOTS = 6;
export const MIN_REQUIRED_PHOTOS = 2;

export const UPLOAD_IMAGE_STEPS = {
  IMAGES: 'images',
  CITY: 'city',
  NAME: 'name',
  BIO: 'bio',
  HOBBIES: 'hobbies',
} as const;

export const POPULAR_HOBBIES = [
  '🎵 Music',
  '✈️ Travel',
  '☕ Coffee',
  '🏋️ Fitness',
  '🎮 Gaming',
  '🍕 Foodie',
  '📚 Reading',
  '🐶 Pets',
  '🎬 Movies',
  '🎨 Art',
  '📷 Photography',
  '🧘 Yoga',
  '⚽ Sports',
  '🏕️ Camping',
  '🍳 Cooking',
  '🏊 Swimming',
  '🍷 Wine',
  '💃 Dancing',
] as const;

