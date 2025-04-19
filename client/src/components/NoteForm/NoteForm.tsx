import { FormField } from "../FormField";
import { Button } from "../Button";
import "./NoteForm.css";
import { FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { createNote } from "../../api/Note";
import { queryClient } from "../../api/QueryClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

const createNoteSchema = z.object({
  title:  z.string()
            .min(5, 'Длина заголовка должна быть не менее 5 символов!')
            .max(30, 'Длина заголовка не может быть больше 30 символов!'),
  text:   z.string()
          .min(10, 'Длина описания должна быть не менее 10 символов!')
          .max(300, 'Длина текста не может быть больше 300 символов!')
});

type CreateNoteForm = z.infer<typeof createNoteSchema>;

export const NoteForm: FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors
    }
  } = useForm<CreateNoteForm>({
    resolver: zodResolver(createNoteSchema)
  });

  const createNoteMutation = useMutation({
    mutationFn: (data: CreateNoteForm) => createNote(data.title, data.text),
    onSuccess() {
      queryClient.invalidateQueries({queryKey: ['notes']});
      reset();
    }
  }, queryClient)

  return (
    <form className="note-form" onSubmit={handleSubmit(({title, text}) => {
      createNoteMutation.mutate({title, text});
    })}>
      <FormField label="Заголовок" errorMessage={errors.title?.message}>
        <input 
          type="text" 
          {...register('title')}
        />
      </FormField>
      <FormField label="Текст" errorMessage={errors.text?.message}>
        <textarea
          {...register('text')}
        />
      </FormField>

      {createNoteMutation.error && <span>{createNoteMutation.error.message}</span> }

      <Button isLoading={createNoteMutation.isPending}>Сохрнаить</Button>
    </form>
  );
};
