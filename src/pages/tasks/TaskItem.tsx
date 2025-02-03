import React, { useState } from "react";
import { useTasks, Task } from "./hooks";
import { Box, Button, HStack, Input, Icon } from "@chakra-ui/react";
import { BsPlayFill, BsTrash } from "react-icons/bs";

const TaskItem = ({ task }: { task: Task }) => {
  const { executeTask, removeTask } = useTasks();
  const [taskName, setTaskName] = useState(task.name);

  return (
    <HStack spacing={3} p={3} bg="gray.100" borderRadius="md">
      <Input
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        size="sm"
        bg="white"
      />
      <Button size="sm" colorScheme="green" onClick={() => executeTask(task)}>
        <Icon as={BsPlayFill} />
      </Button>
      <Button size="sm" colorScheme="red" onClick={() => removeTask(task.id)}>
        <Icon as={BsTrash} />
      </Button>
    </HStack>
  );
};

export default TaskItem;
