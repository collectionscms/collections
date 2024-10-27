import { Content } from "./content";

export type Post = {
  contents: {
    [language: string]: Content;
  };
};
