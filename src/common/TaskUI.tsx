import React, { useCallback, useEffect } from "react";
import {
  Button,
  Box,
  HStack,
  Spacer,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { debugMode } from "../constants";
import { useAppState } from "../state/store";
import RunTaskButton from "./RunTaskButton";
import VoiceButton from "./VoiceButton";
import TaskHistory from "./TaskHistory";
import TaskStatus from "./TaskStatus";
import RecommendedTasks from "./RecommendedTasks";
import AutosizeTextarea from "./AutosizeTextarea";
import RecordVoice from "./RecordVoice";

const injectContentScript = async () => {
  const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
  if (!tab || !tab.id) {
    return;
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["src/pages/contentInjected/index.js"],
    world: "MAIN",
  });
};

function ActionExecutor() {
  const state = useAppState((state) => ({
    attachDebugger: state.currentTask.actions.attachDebugger,
    detachDegugger: state.currentTask.actions.detachDebugger,
    performActionString: state.currentTask.actions.performActionString,
    prepareLabels: state.currentTask.actions.prepareLabels,
    showImagePrompt: state.currentTask.actions.showImagePrompt,
  }));
  return (
    <Box mt={4}>
      <HStack
        columnGap="0.5rem"
        rowGap="0.5rem"
        fontSize="md"
        borderTop="1px dashed gray"
        py="3"
        shouldWrapChildren
        wrap="wrap"
      >
        <Button onClick={state.attachDebugger}>Anexar</Button>
        <Button onClick={state.prepareLabels}>Preparar</Button>
        <Button onClick={state.showImagePrompt}>Mostrar Imagem</Button>
        <Button
          onClick={() => {
            injectContentScript();
          }}
        >
          Injetar
        </Button>
      </HStack>
    </Box>
  );
}

const TaskUI = ({
  closePopBlueBall,
  // closePopBlueBallVoice,
}: {
  closePopBlueBall: () => void;
  // closePopBlueBallVoice: () => void;
}) => {
  const state = useAppState((state) => ({
    taskHistory: state.currentTask.history,
    taskStatus: state.currentTask.status,
    runTask: state.currentTask.actions.runTask,
    instructions: state.ui.instructions,
    setInstructions: state.ui.actions.setInstructions,
    voiceMode: state.settings.voiceMode,
    isListening: state.currentTask.isListening,
  }));
  const taskInProgress = state.taskStatus === "running";
  const taskSuccess = state.taskStatus === "success";

  const toast = useToast();

  const toastError = useCallback(
    (message: string) => {
      toast({
        title: "Erro",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    [toast],
  );

  const runTask = useCallback(() => {
    state.instructions && state.runTask(toastError);
  }, [state, toastError]);

  const runTaskWithNewInstructions = (newInstructions: string = "") => {
    if (!newInstructions) {
      return;
    }
    state.setInstructions(newInstructions);
    state.runTask(toastError);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // if (e.key === "Enter" && e.shiftKey) {
    //   e.preventDefault();
    //   runTask();
    // }
    if (e.key === "Enter") {
      e.preventDefault();
      runTask();
      closePopBlueBall();

      // chrome.sidePanel
      //   .setOptions({ enabled: false })
      //   .then(() => chrome.sidePanel.setOptions({ enabled: true }))
      //   .catch((error) => {
      //     console.error("Erro ao fechar o side panel:", error);
      //   });
    }
  };

  // useEffect(() => {
  //   if (taskSuccess) {
  //     state.setInstructions("");
  //   }
  // }, [taskSuccess]);

  function changeValueInput(value: string) {
    state.setInstructions(value);
  }

  return (
    <div style={{ position: "relative" }}>
      <AutosizeTextarea
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        placeholder="Digite aqui o seu comando."
        value={state.instructions || ""}
        isDisabled={taskInProgress || state.isListening}
        onChange={(e) => state.setInstructions(e.target.value)}
        mb={2}
        onKeyDown={onKeyDown}
        style={{
          borderRadius: "1.25rem",
          padding: "10px 10px 0px",
          fontFamily: "Galano Grotesque Regular;",
          border: "none"
          // marginLeft: "-11px",
          // marginTop: "-5px",
        }}
      />

      <RecordVoice
        changeValueInput={changeValueInput}
        // closePopBlueBall={closePopBlueBall}
      />

      {/* <HStack mt={2} mb={2}>
        <RunTaskButton runTask={runTask} />
        {state.voiceMode && (
          <VoiceButton
            taskInProgress={taskInProgress}
            onStopSpeaking={runTask}
          />
        )}
        <Spacer />
      </HStack> */}
      {/* {state.voiceMode && (
        <Alert status="info" borderRadius="lg">
          <AlertIcon />
          <AlertDescription fontSize="sm" lineHeight="5">
            No Modo de Voz, você pode pressionar a barra de espaço para começar
            a falar e novamente para parar. O Nova executará a tarefa quando
            você parar de falar. Para desativar o Modo de Voz, clique no ícone
            de Configurações no canto superior direito.
          </AlertDescription>
        </Alert>
      )}
      {!state.voiceMode && !state.instructions && (
        <RecommendedTasks runTask={runTaskWithNewInstructions} />
      )}
      {debugMode && <ActionExecutor />} */}
      {/* <TaskStatus /> */}
      {/* <TaskHistory /> */}
    </div>
  );
};

export default TaskUI;
