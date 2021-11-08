import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import fm, { FrontMatterResult } from "front-matter";
import { GetServerSideProps } from "next";

interface IPage {
  content: FrontMatterResult<string>;
}

function Page(props: IPage) {
  return (
    <>
      {props.content && props.content.body && (
        <ReactMarkdown remarkPlugins={[gfm]}>
          {props.content.body}
        </ReactMarkdown>
      )}
    </>
  );
}

function getRepoRaw(path: string): string {
  const splitPath = path.split("/");
  splitPath.shift();
  splitPath.shift();
  const slug = `https://raw.githubusercontent.com/${splitPath.join("/")}`;
  return slug;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API
  const url = getRepoRaw(context.resolvedUrl);

  const res = await fetch(url);
  const text = await res.text();
  const content = fm<string>(text);

  return { props: { content } };
};

export default Page;
