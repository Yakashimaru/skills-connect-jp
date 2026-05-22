UPDATE public.profiles SET birth_year=1992, gender='female'
  WHERE id=(SELECT id FROM auth.users WHERE email='yuki.tanaka@example.com');

UPDATE public.profiles SET birth_year=1985, gender='male'
  WHERE id=(SELECT id FROM auth.users WHERE email='hiroshi.sato@example.com');

UPDATE public.profiles SET birth_year=1995, gender='female'
  WHERE id=(SELECT id FROM auth.users WHERE email='aiko.yamamoto@example.com');

UPDATE public.profiles SET birth_year=1990, gender='male'
  WHERE id=(SELECT id FROM auth.users WHERE email='kenji.watanabe@example.com');
