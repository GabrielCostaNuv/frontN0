import { useState, useEffect, useCallback, useRef } from "react";

// Definição do tipo da tarefa
export interface Task {
  id: string;
  name: string;
  command: string;
}

// Hook para gerenciar tarefas salvas
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const executedFromSavedTask = useRef(false);

  // Função para carregar as tarefas salvas do localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("savedTasks") || "[]");
    setTasks(savedTasks);
  }, []);

  // Atualizar localStorage sempre que as tarefas forem modificadas
  const updateLocalStorage = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem("savedTasks", JSON.stringify(newTasks));
  }, []);

  // Salvar uma nova tarefa
  const saveTask = (task: Task) => {
    updateLocalStorage([...tasks, task]);
  };

  // Executar uma tarefa salva
  const executeTask = (task: Task) => {
    executedFromSavedTask.current = true;
    const inputField = document.querySelector<HTMLInputElement>("#input-field");
    const startButton = document.querySelector<HTMLButtonElement>("#start-task-button");

    if (inputField && startButton) {
      inputField.value = task.command;
      startButton.click();
    }
  };

  // Remover uma tarefa salva
  const removeTask = (id: string) => {
    updateLocalStorage(tasks.filter((t) => t.id !== id));
  };

  return { tasks, saveTask, executeTask, removeTask };
};
