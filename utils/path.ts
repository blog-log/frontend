import { IDocument } from "../service/provider/database";

export function getRepoSlug(page: IDocument): string {
  const splitRepo = page.repo.split("/");
  const slug = `/github/${splitRepo[splitRepo.length - 2]}/${
    splitRepo[splitRepo.length - 1]
  }/${page.branch}/${page.path}`;
  return slug;
}
