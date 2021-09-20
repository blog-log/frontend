import { ReactElement } from "react";
import { Input } from "antd";
import { useRouter } from "next/router";

const { Search } = Input;

function SearchBar(): ReactElement {
  const router = useRouter();

  const onSearch = async (value: string) => {
    router.push({ pathname: "/search", query: { query: value } });
  };

  return (
    <Search
      placeholder={router.query["query"]?.toString() || "input search text"}
      onSearch={onSearch}
      style={{ width: 200 }}
    />
  );
}

export default SearchBar;
