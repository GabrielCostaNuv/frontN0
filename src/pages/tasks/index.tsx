import React from "react";
import TaskItem from "./TaskItem";
import { useTasks } from "./hooks";
import { Box, Button, Heading, VStack } from "@chakra-ui/react";

const TasksPage = ({ setView }: { setView: (view: "main") => void }) => {
  const { tasks } = useTasks();

  return (
    <Box p={5}>
      <Heading as="h1" size="lg" mb={4}>
        Tasks Salvas
      </Heading>

      {tasks.length === 0 ? (
        <Box>Nenhuma task salva.</Box>
      ) : (
        <VStack spacing={3} align="stretch">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} setView={setView} />
          ))}
        </VStack>
      )}

      <Button
        mt={4}
        style={{
          padding: "5px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={() => setView("main")}
      >
        Voltar
      </Button>
    </Box>
  );
};

export default TasksPage;
