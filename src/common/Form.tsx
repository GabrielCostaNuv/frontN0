import { useContext } from "react";
import { useForm } from "react-hook-form";
import { ChatContext } from "./context/ChatContext";
import RecordVoice from "./RecordVoice";
import { useToast } from "@chakra-ui/react";
import TaskUI from "./TaskUI";

export type Inputs = {
  text: string;
};

export default function Form({
  closePopBlueBall,
  // closePopBlueBallVoice
}: {
  closePopBlueBall: () => void;
  // closePopBlueBallVoice: () => void;
}) {
  const context = useContext(ChatContext);
  const { register, handleSubmit, setValue, getValues } = useForm<Inputs>();
  const toast = useToast();

  if (!context) {
    return null;
  }

  const { addMessage } = context;

  // Função para mostrar erro via Toast (pode ser a mesma lógica do TaskUI)
  const toastError = (message: string) => {
    toast({
      title: "Erro",
      description: message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  // Lógica para rodar a tarefa, utilizando a instrução do campo de texto
  const runTask = () => {
    const text = getValues("text");
    if (text && text.trim()) {
      addMessage(text); // Adiciona a mensagem no chat
      // Adicione aqui a lógica de execução da tarefa, como em TaskUI
      console.log("Tarefa executada com o texto:", text);
      setValue("text", ""); // Limpa o campo após execução
      closePopBlueBall(); // Fecha o formulário
    } else {
      toastError("Não é permitido o envio de um comando vazio.");
    }
  };

  // Evento de teclado - enviar ao pressionar Enter (e Shift para não enviar)
  // const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (event.key === "Enter" && !event.shiftKey) {
  //     event.preventDefault();
  //     runTask(); // Chama a função de execução da tarefa
  //   }
  // };

  // Função que permite alterar o valor do texto da textarea através da voz (ou outro mecanismo)
  // function changeValueInput(text: string) {
  //   setValue("text", text);
  // }

  return (
    <form className="form-container" onSubmit={handleSubmit(runTask)}>
      {/* <textarea
        cols={33}
        rows={3}
        className="text-area"
        placeholder="Digite aqui o seu comando."
        {...register("text")}
        onKeyDown={handleKeyDown}
      ></textarea> */}
      


      <TaskUI closePopBlueBall={closePopBlueBall}  />


      <button type="submit" className="hidden">
        Enviar
      </button>
    </form>
  );
}
