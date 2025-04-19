import { useMutation } from "@tanstack/react-query";
import { Button } from "../Button";
import "./LogoutButton.css";
import { logout } from "../../api/User";
import { queryClient } from "../../api/QueryClient";

export const LogoutButton = () => {
  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess() {
      queryClient.invalidateQueries({queryKey: ['users', 'me']});
    }
  }, queryClient);

  return (
    <div className="logout-button">
      <Button kind="secondary" onClick={() => logoutMutation.mutate()} isLoading={logoutMutation.isPending}>Выйти</Button>
    </div>
  );
};
