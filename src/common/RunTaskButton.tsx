import { Button, HStack, Icon } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAppState } from "../state/store";
import { useTasks } from "../pages/tasks/hooks";
import { BsPlayFill, BsStopFill, BsSave } from "react-icons/bs";

export default function RunTaskButton(props: { runTask: () => void }) {
  const { saveTask } = useTasks();
  const [taskCompleted, setTaskCompleted] = useState(false); // 🔹 Estado para esconder o botão ao digitar
  const state = useAppState((state) => ({
    taskState: state.currentTask.status,
    instructions: state.ui.instructions ?? "", // 🔹 Garante que `instructions` nunca seja null
    interruptTask: state.currentTask.actions.interrupt,
  }));

  // 🔍 Log para depuração
  useEffect(() => {
    console.log("Estado da Tarefa:", state.taskState);
    console.log("Instruções:", state.instructions);
  }, [state.taskState]);

  useEffect(() => {
    if (state.taskState === "success") {
      setTaskCompleted(true); // ✅ Mostra o botão quando a tarefa é concluída
    }
  }, [state.taskState]);

  useEffect(() => {
    setTaskCompleted(false); // ✅ Esconde o botão ao modificar o input
  }, [state.instructions]); // Sempre que o usuário digitar algo novo, o botão some

  let button = (
    <Button
      rightIcon={<Icon as={BsPlayFill} boxSize={6} />}
      onClick={props.runTask}
      colorScheme="green"
      disabled={state.taskState === "running" || !state.instructions}
    >
      Start Task
    </Button>
  );

  if (state.taskState === "running") {
    button = (
      <Button
        rightIcon={<Icon as={BsStopFill} boxSize={6} />}
        onClick={state.interruptTask}
        colorScheme="red"
      >
        Stop
      </Button>
    );
  }

  const handleSaveTask = () => {
    saveTask({
      id: crypto.randomUUID(),
      name: "Nova Tarefa",
      command: state.instructions, // 🔹 Sempre será uma string
    });
    setTaskCompleted(false); // 🔹 Esconde o botão após salvar
  };

  return (
    <HStack alignItems="center">
      {button}
      {taskCompleted && (
        <Button
          rightIcon={<Icon as={BsSave} boxSize={6} />}
          onClick={handleSaveTask}
          colorScheme="blue"
        >
          Save Task
        </Button>
      )}
    </HStack>
  );
}
