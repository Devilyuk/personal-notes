import { FormField } from "../FormField";
import { Button } from "../Button";
import "./RegisterForm.css";
import { FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../api/User";
import { queryClient } from "../../api/QueryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string()
    .min(5, 'Имя не может содержать короче 5 символов')
    .max(30, 'Имя не может содержать более 30 символов'),
  email: z.string()
    .email('Некорректная почта')
    .min(5, 'Почта должна содержать более 5 символов'),
  password: z.string()
    .min(8, 'Пароль не может содержать менее 8 символов')
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterForm: FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm<RegisterForm>({
      resolver: zodResolver(registerSchema)
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterForm) => registerUser(data.username, data.email, data.password),
    onSuccess() {
      queryClient.refetchQueries({queryKey: ['users', 'me']});
    }
  }, queryClient)

  return (
    <form className="register-form" onSubmit={handleSubmit(({username, email, password}) => {
      registerMutation.mutate({username, email, password});
      reset();
    })}>
      <FormField label="Имя" errorMessage={errors.username?.message}>
        <input 
          type="text"
          {...register('username')}
        />
      </FormField>
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

      {registerMutation.error && <span>{registerMutation.error.message}</span>}

      <Button isLoading={registerMutation.isPending}>Зарегистрироваться</Button>
    </form>
  );
};
