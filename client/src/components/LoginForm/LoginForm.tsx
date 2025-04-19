import "./LoginForm.css";
import { FormField } from "../FormField";
import { Button } from "../Button";
import { FC } from "react";
import { queryClient } from "../../api/QueryClient";
import { login } from "../../api/User";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string()
    .email('Некорректная почта')
    .min(5, 'Почта должна содержать более 5 символов'),
  password: z.string()
    .min(8, 'Пароль не может содержать менее 8 символов')
})

type LoginForm = z.infer<typeof loginSchema>;

export const LoginForm: FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginForm) => login(data.email, data.password),
    onSuccess() {
      queryClient.invalidateQueries({queryKey: ['users', 'me']});
    }
  }, queryClient)

  return (
    <form className="login-form" onSubmit={handleSubmit(({email, password}) => {
      loginMutation.mutate({email, password});
      reset()
    })}>
      <FormField label="Email" errorMessage={errors.email?.message}>
        <input
          type="email"
          {...register('email')}
        />
      </FormField>
      <FormField label="Пароль" errorMessage={errors.password?.message}>
        <input
          type="password"
          {...register('password')}
        />
      </FormField>

      {loginMutation.error && <span>{loginMutation.error.message}</span>}

      <Button>Войти</Button>
    </form>
  );
};
