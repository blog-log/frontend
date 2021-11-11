import type { GetServerSideProps } from "next";
import type { Session } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import { useSession, getSession } from "next-auth/client";
import {
  Row,
  Col,
  Card,
  Divider,
  Alert,
  Typography,
  Popover,
  Button,
} from "antd";

import {
  IDocument,
  IRepo,
  RepoProvider,
} from "../modules/user/services/database";
import {
  GithubProvider,
  IInstallation,
} from "../modules/signup/services/github";
import { useRouter } from "next/router";
import { SessionWithToken } from "../common/types/session";
import { repoIdToName, repoNameToId } from "../common/utils/repo";
import { getRepoSlug } from "../common/utils/path";

const { Title } = Typography;

interface IUser {
  session: Session | null;
  installations: IInstallation[];
  repos: IRepo[];
  docs: IDocument[];
}

function User(props: IUser) {
  const router = useRouter();
  const [session, loading]: [SessionWithToken | null, boolean] = useSession();

  if (loading) return null;

  if (typeof window !== "undefined" && loading) return null;

  if (!loading && !session) return <p>Access Denied</p>;

  return (
    <div className="bg-white p-3 md:p-8 mb-4 md:mb-8 lg:mb-12">
      {router.query?.setup_action && router.query?.setup_action === "install" && (
        // onClose removes any query params so on refresh alert will not show again
        <InstallAlert onClose={() => router.replace("/user")} />
      )}

      {router.query?.setup_action && router.query?.setup_action === "update" && (
        // onClose removes any query params so on refresh alert will not show again
        <UpdateAlert onClose={() => router.replace("/user")} />
      )}

      {!router.query?.setup_action && props.installations.length === 0 && (
        <NeedInstallAlert />
      )}

      <Divider orientation="left">Installations</Divider>
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {props.installations &&
          props.installations.map((installation, index) => (
            <div key={index}>
              <Link passHref href={installation.url}>
                <a>
                  <Card hoverable key={`${index}-${installation.url}`}>
                    <Title level={5}>{installation.account}</Title>
                  </Card>
                </a>
              </Link>
            </div>
          ))}
      </div>

      <Divider orientation="left">Repositories</Divider>
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {props.repos &&
          props.repos.map((repo, index) => (
            <div key={index}>
              <Link passHref href={repo.id}>
                <a>
                  <Card hoverable key={`${index}-${repo}`} title={repo.id}>
                    {repo.error && (
                      <Alert
                        message="Error"
                        type="error"
                        showIcon
                        description={JSON.stringify(repo.error)}
                      />
                    )}
                    {repo.warning &&
                      repo.warning.length > 0 &&
                      repo.warning[0] !== null && (
                        <Alert
                          message="Warning"
                          type="warning"
                          showIcon
                          description={JSON.stringify(repo.warning)}
                        />
                      )}
                    {!repo.error && !repo.warning && (
                      <Alert message="Success" type="success" showIcon />
                    )}
                  </Card>
                </a>
              </Link>
            </div>
          ))}
      </div>
      <Divider orientation="left">Documents</Divider>
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {props.docs &&
          props.docs.map((doc, index) => (
            <div key={index}>
              <Popover
                content={
                  <DocumentPopoverContent
                    ghLink={`${doc.repo}/blob/${doc.branch}/${doc.path}`}
                    blLink={getRepoSlug(doc)}
                  />
                }
                trigger="click"
              >
                <Card
                  hoverable
                  key={`${index}-${doc.repo}-${doc.path}`}
                  title={doc.title}
                >
                  content description
                </Card>
              </Popover>
            </div>
          ))}
      </div>
    </div>
  );
}

function DocumentPopoverContent({
  ghLink,
  blLink,
}: {
  ghLink: string;
  blLink: string;
}) {
  const router = useRouter();

  return (
    <Row gutter={[4, 4]}>
      <Col key={1} span={12}>
        <Button
          className="flex justify-center items-center"
          shape="circle"
          icon={
            <Image src="/github.svg" alt="Github Logo" height={20} width={20} />
          }
          onClick={() => router.push(ghLink)}
        />
      </Col>
      <Col key={2} span={12}>
        <Link passHref href={blLink}>
          <Button shape="circle">BL</Button>
        </Link>
      </Col>
    </Row>
  );
}

const InstallAlert = ({ onClose }: { onClose: () => void }) => (
  <Alert
    message="Installed Github App 🎉🎉🎉"
    description="Please allow for up to a minute for repositories and documents to begin to show below"
    type="info"
    showIcon
    closable
    onClose={onClose}
  />
);

const UpdateAlert = ({ onClose }: { onClose: () => void }) => (
  <Alert
    message="Updated Github App"
    description="Please allow for up to a minute for changes to begin to show below"
    type="info"
    showIcon
    closable
    onClose={onClose}
  />
);

const NeedInstallAlert = () => (
  <Alert
    message="Install Github App Required"
    description={
      <>
        Please completed github app installation step{" "}
        <Link passHref href="/flow/getting_started/install">
          <span className="cursor-pointer underline">here</span>
        </Link>
      </>
    }
    type="warning"
    showIcon
  />
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session?.accessToken) {
    // create clients
    const githubProvider = new GithubProvider(session?.accessToken as string);
    const repoProvider = new RepoProvider();

    const accessibleInstallations = await githubProvider.getInstallations();

    const accessibleRepos = await githubProvider.getRepos();

    const docs = await repoProvider.searchDocuments(accessibleRepos);

    const repos = await repoProvider.searchRepos(accessibleRepos);

    // remove this after restructuring how repos added in database
    // https://trello.com/c/CMN7anfI
    if (repos) {
      repos.forEach((repo) => {
        accessibleRepos.forEach((accessibleRepo) => {
          if (repoIdToName(accessibleRepo) === repo.id) {
            repo.id = accessibleRepo;
          }
        });
      });
    }

    return {
      props: {
        session,
        installations: accessibleInstallations,
        repos,
        docs,
      },
    };
  }

  return {
    props: { session },
  };
};

export default User;
