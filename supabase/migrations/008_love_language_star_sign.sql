alter table public.profiles
  add column if not exists love_language text check (love_language in ('words-of-affirmation', 'acts-of-service', 'receiving-gifts', 'quality-time', 'physical-touch')),
  add column if not exists star_sign     text check (star_sign in ('aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'));
