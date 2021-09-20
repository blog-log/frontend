export const SEARCH_BASE_URL =
  process.env.SEARCH_BASE_URL ||
  "https://vcyrfqec34.execute-api.us-east-1.amazonaws.com";

export const GCLOUD_BASE_URL =
  process.env.GCLOUD_BASE_URL ||
  "https://us-central1-bloglog-dev.cloudfunctions.net";

export const STAGE = process.env.STAGE;

export const DATABASE_DOCUMENT_SEARCH_URL = `${GCLOUD_BASE_URL}/bloglog-database-${STAGE}-documentSearch`;

export const DATABASE_REPO_SEARCH_URL = `${GCLOUD_BASE_URL}/bloglog-database-${STAGE}-repoSearch`;
