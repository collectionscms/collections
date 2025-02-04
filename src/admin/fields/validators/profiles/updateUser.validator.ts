import { ObjectSchema } from 'yup';
import { yup } from '../../yup.js';

export type FormValues = {
  name: string;
  bio?: string | null;
  image?: string | null;
  bioUrl?: string | null;
  employer?: string | null;
  jobTitle?: string | null;
  awards?: string[] | null;
  spokenLanguages?: string[] | null;
  xUrl?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  linkedInUrl?: string | null;
  alumni?: { name?: string; url?: string | null }[] | null;
};

export const updateUser = (): ObjectSchema<FormValues> => {
  return yup.object().shape({
    name: yup.string().required().max(250),
    bio: yup.string().nullable(),
    image: yup.string().nullable(),
    bioUrl: yup.string().url().nullable(),
    employer: yup.string().nullable(),
    jobTitle: yup.string().nullable(),
    awards: yup.array().nullable(),
    spokenLanguages: yup.array().nullable(),
    xUrl: yup.string().url().nullable(),
    instagramUrl: yup.string().url().nullable(),
    facebookUrl: yup.string().url().nullable(),
    linkedInUrl: yup.string().url().nullable(),
    alumni: yup.array().of(
      yup.object().shape({
        name: yup.string().max(250),
        url: yup.string().url().nullable(),
      })
    ),
  });
};
