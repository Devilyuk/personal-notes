import { useQuery } from "@tanstack/react-query";
import "./Account.css";
import { fetchMe } from "../../api/User";
import { queryClient } from "../../api/QueryClient";
import { Loader } from "../Loader";
import { FC } from "react";
import { AuthForm } from "../AuthForm";
import { Profile } from "../Profile/Profile";

export const Account: FC = () => {
  const meQuery = useQuery({
    queryFn: () => fetchMe(),
    queryKey: ['users', 'me'],
    retry: false
  }, queryClient);

  switch (meQuery.status) {
    case 'pending':
      return <Loader />

    case 'success':
      return <Profile user={meQuery.data} />

    case 'error':
      return <AuthForm />
  }
};
