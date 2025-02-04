/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState, useCallback, useEffect } from "react";
import expandArrow from "../assets/img/expandArrow.svg";
import closeExpandArrow from "../assets/img/closeExpandArrow.svg";
import n0 from "../assets/img/n01.svg";
import { IoIosSettings } from "react-icons/io";
import { debugMode } from "../constants";

// import n0Black from "../assets/n01Black.svg";
// import Chat from "./Chat";

import ballBlue from "../assets/media/ballBlue.mp4";
import ball from "../assets/img/ballBlueLogin.png";
import Form from "./Form";
import Chat from "./Chat";
import TaskHistory from "./TaskHistory";
import RecommendedTasks from "./RecommendedTasks";
import TaskStatus from "./TaskStatus";
import { useAppState } from "../state/store";
import { Button, HStack, Input, useToast, VStack } from "@chakra-ui/react";
import RunTaskButton from "./RunTaskButton";
import { useTasks } from "../pages/tasks/hooks";

// import VideoBlueBall from "./VideoBlueBall";
// import { ThemeContext } from "../context/ThemeContext";

export default function PopBlueBall({
  // closeForm,
  handleView,
}: {
  // closeForm: () => void;
  handleView: (view: "main" | "settings" | "tasks") => void;
}) {
  const [isExpandForm, setIsExpandForm] = useState(false);
  const [countExpand, setCountExpand] = useState(0);

  const [showTaskNameInput, setShowTaskNameInput] = useState(() => {
    return localStorage.getItem("showTaskNameInput") === "true"; // 🔹 Recupera estado salvo
  });
  const { saveTask } = useTasks();
  const [taskName, setTaskName] = useState(() => {
    return localStorage.getItem("taskName") || ""; // 🔹 Recupera o nome salvo ao carregar
  });
  const state = useAppState((state) => ({
    taskHistory: state.currentTask.history,
    taskStatus: state.currentTask.status,
    runTask: state.currentTask.actions.runTask,
    instructions: state.ui.instructions ?? "",
    setInstructions: state.ui.actions.setInstructions,
    voiceMode: state.settings.voiceMode,
    isListening: state.currentTask.isListening,
  }));

  //   const { theme } = useContext(ThemeContext);

  function onChangeImageArrow() {
    setIsExpandForm(!isExpandForm);
    setCountExpand(countExpand + 1);
  }

  function closePopBlueBall() {
    setCountExpand(0);
    setIsExpandForm(false);
    // closeForm();
  }

  // function closePopBlueBallVoice() {
  //   closePopBlueBall();
  //   const ballPop = document.getElementById("ballPop");

  //   ballPop?.classList.add("pulse-blue-ball");
  // }
  const toast = useToast();

  const toastError = useCallback(
    (message: string) => {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    [toast],
  );

  const isCloseExpandForm = countExpand !== 0 && countExpand % 2 === 0;

  const runTask = useCallback(() => {
    state.instructions.trim() && state.runTask(toastError);
  }, [state, toastError]);

  useEffect(() => {
    const storageListener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area: string,
    ) => {
      if (area === "local" && changes.omniboxInput) {
        const newValue = changes.omniboxInput.newValue;
        if (newValue) {
          console.log("Storage changed - omniboxInput:", newValue);
          state.setInstructions(newValue);
          runTask();
          // Opcional: remova o valor após atualizar, para evitar atualizações repetidas
          chrome.storage.local.remove("omniboxInput");
        }
      }
    };

    chrome.storage.onChanged.addListener(storageListener);
    return () => {
      chrome.storage.onChanged.removeListener(storageListener);
    };
  }, [state.setInstructions]);

  useEffect(() => {
    const savedTask = localStorage.getItem("executingTask");
    if (savedTask) {
      const task = JSON.parse(savedTask);
      state.setInstructions(task.command);
      setTaskName(task.name || "New Task");

      setTimeout(() => {
        state.runTask(toastError);
      }, 500);

      localStorage.removeItem("executingTask");
    }
  }, [state, toastError]);

  const handleShowTaskNameInput = () => {
    setShowTaskNameInput(true);
    localStorage.setItem("showTaskNameInput", "true");
  };

  // 🔹 Atualiza o `localStorage` com o nome da tarefa
  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
    localStorage.setItem("taskName", e.target.value);
  };

  // 🔹 Função para salvar a tarefa com o nome definido pelo usuário
  const handleConfirmTask = () => {
    const trimmedInstructions = state.instructions.trim();
    if (!taskName.trim() || !trimmedInstructions) {
      alert("Task name and command cannot be empty!");
      return;
    }

    saveTask({
      id: crypto.randomUUID(),
      name: taskName.trim(),
      command: trimmedInstructions,
    });

    setTaskName("");
    setShowTaskNameInput(false);
    localStorage.removeItem("taskName"); // 🔹 Remove o nome salvo após confirmar
    localStorage.setItem("showTaskNameInput", "false");
  };

  return (
    <div className="pop-blue-ball-container">
      <div
        className={`pop-blue-ball`}
        style={{
          height: "calc(100vh - 35px)",
        }}
      >
        <div className="expand-arrow-container">
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <IoIosSettings
              size={20}
              onClick={() => handleView("settings")}
              // className="text-[#828282] bg-[#828282]"
              color="#828282"
            />
            {/* <img
              src={isExpandForm ? closeExpandArrow : expandArrow}
              alt="Icon Expand Arrow"
              className="expand-arrow"
              onClick={onChangeImageArrow}
            /> */}
          </div>
        </div>

        <div className="content-container">
          <div
            className={`content-header ${isExpandForm ? "expand-form-header" : ""}`}
          >
            <div className="video-wrapper">
              <img
                style={{ width: "100px", height: "100px" }}
                src={ball}
                alt="Bolinha azul"
              />
              {/* <video
                autoPlay
                loop
                muted
                onClick={closePopBlueBall}
                className="video-blue-ball"
              >
                <source src={ballBlue} type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
              </video> */}
            </div>

            <div
              className={`intro-text ${isExpandForm ? "hidden" : "visible"}`}
            >
              <p
                className="intro-text-content"
                style={{
                  transform: "translateY(6px)",
                }}
              >
                Hello! What can I do for you?
              </p>
            </div>

            <div
              className={`image-wrapper ${isExpandForm ? "visible" : "hidden"}`}
            >
              <img src={n0} alt="Imagem n01" className="image-n01" />
            </div>
          </div>

          {/* {!state.voiceMode && !state.instructions && (
            <RecommendedTasks runTask={runTask} />
          )} */}
          <TaskHistory />
          <TaskStatus />
          <VStack
            spacing={2}
            align="center"
            gap={10}
            display="flex"
            justifyContent="center"
          >
            <HStack>
              <RunTaskButton
                runTask={runTask}
                onShowTaskName={handleShowTaskNameInput}
              />
            </HStack>

            {showTaskNameInput && (
              <>
                <Input
                  placeholder="Task name..."
                  style={{
                    borderRadius: "4px",
                    padding: "10px 0px 10px 0px",
                    border: "none",
                    outline: "none",
                    width: "100%",
                    textIndent: "5px",
                    fontFamily: "Galano Grotesque Regular;",
                  }}
                  value={taskName}
                  onChange={handleTaskNameChange}
                  bg="white"
                />
                <Button
                  style={{
                    padding: "10px 5px 10px 5px",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    width: "100%",
                    cursor: "pointer",
                  }}
                  onClick={handleConfirmTask}
                >
                  Confirm
                </Button>
              </>
            )}
          </VStack>
        </div>

        <Form
          closePopBlueBall={closePopBlueBall}
          // closePopBlueBallVoice={closePopBlueBallVoice}
        />
      </div>
    </div>
  );
}
