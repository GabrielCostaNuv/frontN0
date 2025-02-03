import {
  Link,
  Box,
  ChakraProvider,
  Heading,
  HStack,
  IconButton,
  Icon,
  Image,
  Flex,
  Button,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { FaGithub } from "react-icons/fa6";
import { BsFolder } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useAppState } from "../state/store";
import SetAPIKey from "./SetAPIKey";
import TaskUI from "./TaskUI";
import Settings from "./Settings";
import TasksPage from "../pages/tasks";
import ballBlue from "../assets/media/ballBlue.mp4";
import "./App.css";
import PopBlueBall from "./PopBlueBall";
import ChatContextProvider from "./context/ChatContext";
import n0ImgLogo from "@assets/img/n0ImgLogo.png";

const App = () => {
  const hasAPIKey = useAppState(
    (state) => state.settings.anthropicKey || state.settings.openAIKey,
  );
  const [view, setView] = useState<"main" | "settings" | "tasks">("main");
  const [ballVoice, setBallVoice] = useState(false);

  // const [openForm, setOpenForm] = useState(true);

  // function closeForm() {
  //   setOpenForm(false);
  // }

  function handleView(view: "main" | "settings" | "tasks") {
    setView(view);
  }

  // useEffect(() => {
  //   if (openForm) {
  //     const ball = document.getElementById("nb1-side-button");
  //     ball?.classList.add("hidden");
  //   } else {
  //     const ball = document.getElementById("nb1-side-button");
  //     ball?.classList.remove("hidden");
  //   }
  // }, [openForm]);

  return (
    // <ChakraProvider>
    //   <Box p="8" pb="24" fontSize="lg" w="full">
    //     <HStack mb={4} justifyContent="space-between" alignItems="center">
    //       <Flex alignItems="center">
    //         <Heading as="h1" size="lg">
    //           NB1
    //         </Heading>
    //         <Image src={n0ImgLogo} width="32" className="translateImg" height="32" alt="n01 Logo" />
    //       </Flex>
    //       {hasAPIKey && (
    //         <HStack>
    //           <IconButton
    //             icon={<SettingsIcon />}
    //             onClick={() => setView('settings')}
    //             aria-label="open settings"
    //           />
    //           <Button
    //             leftIcon={<Icon as={BsFolder} />}
    //             colorScheme="blue"
    //             onClick={() => setView('tasks')}
    //           >
    //             Tarefas Salvas
    //           </Button>
    //         </HStack>
    //       )}
    //     </HStack>
    //     {hasAPIKey ? (
    //       view === 'settings' ? (
    //         <Settings setView={setView} />
    //       ) : view === 'tasks' ? (
    //         <TasksPage setView={setView} />
    //       ) : (
    //         <TaskUI />
    //       )
    //     ) : (
    //       <SetAPIKey asInitializerView />
    //     )}
    //   </Box>
    //   <Box
    //     px="8"
    //     pos="fixed"
    //     w="100%"
    //     bottom={0}
    //     zIndex={2}
    //     as="footer"
    //     backdropFilter="auto"
    //     backdropBlur="6px"
    //     backgroundColor="rgba(255, 255, 255, 0.6)"
    //   >
    //     <HStack
    //       columnGap="1.5rem"
    //       rowGap="0.5rem"
    //       fontSize="md"
    //       borderTop="1px dashed gray"
    //       py="3"
    //       justify="center"
    //       shouldWrapChildren
    //       wrap="wrap"
    //     >
    //       <Link
    //         href="https://www.saudeblue.com/"
    //         isExternal
    //       >
    //         Number One by Blue © 2025
    //       </Link>
    //     </HStack>
    //   </Box>
    // </ChakraProvider>
    <>
      {hasAPIKey ? (
        view === "settings" ? (
          <div
            style={{
              padding: "0px 20px",
            }}
          >
            {" "}
            <HStack mb={4} justifyContent="space-between" alignItems="center">
              <Flex alignItems="center">
                <Heading as="h1" size="lg">
                  NB1
                </Heading>
                <Image
                  src={n0ImgLogo}
                  width="32"
                  className="translateImg"
                  height="32"
                  alt="n01 Logo"
                />
              </Flex>
              {hasAPIKey && (
                <HStack>
                  {/* <IconButton
                    icon={<SettingsIcon />}
                    onClick={() => setView("settings")}
                    aria-label="open settings"
                  /> */}
                  <Button
                    leftIcon={<Icon as={BsFolder} />}
                    // colorScheme="blue"
                    padding="12px"
                    backgroundColor="gray"
                    color="white"
                    border="none"
                    borderRadius="4px"
                    cursor="pointer"
                    onClick={() => setView("tasks")}
                  >
                    Tarefas Salvas
                  </Button>
                </HStack>
              )}
            </HStack>
            <Settings setView={setView} />
          </div>
        ) : view === "tasks" ? (
          <div
            style={{
              padding: "0px 20px",
            }}
          >
            <HStack mb={4} justifyContent="space-between" alignItems="center">
              <Flex alignItems="center">
                <Heading as="h1" size="lg">
                  NB1
                </Heading>
                <Image
                  src={n0ImgLogo}
                  width="32"
                  className="translateImg"
                  height="32"
                  alt="n01 Logo"
                />
              </Flex>
              {hasAPIKey && (
                <HStack>
                  {/* <Button
                    // colorScheme="blue"
                    padding="12px"
                    backgroundColor="gray"
                    color="white"
                    border="none"
                    borderRadius="4px"
                    cursor="pointer"
                  >
                   
                  </Button> */}
                  <IconButton
                    icon={<SettingsIcon />}
                    padding="12px"
                    backgroundColor="gray"
                    color="white"
                    border="none"
                    borderRadius="4px"
                    cursor="pointer"
                    onClick={() => setView("settings")}
                    aria-label="open settings"
                  />

                  <Button
                    leftIcon={<Icon as={BsFolder} />}
                    // colorScheme="blue"
                    padding="12px"
                    backgroundColor="gray"
                    color="white"
                    border="none"
                    borderRadius="4px"
                    cursor="pointer"
                    onClick={() => setView("tasks")}
                  >
                    Tarefas Salvas
                  </Button>
                </HStack>
              )}
            </HStack>
            <TasksPage setView={setView} />
          </div>
        ) : (
          <ChatContextProvider>
            <section className="section-box">
              {/* <div className="fixed-bottom-right">
                <video
                  autoPlay
                  loop
                  muted
                  onClick={() => setOpenForm(true)}
                  className={`video-crop ${!openForm ? "visible" : "hidden"} video-style transition-all`}
                >
                  <source src={ballBlue} type="video/mp4" />
                  Seu navegador não suporta a tag de vídeo.
                </video>
              </div> */}

              <div className={`pop-up-form visible`}>
                <PopBlueBall handleView={handleView} />
              </div>
            </section>
          </ChatContextProvider>
          // <TaskUI />
        )
      ) : (
        <div
          style={{
            padding: "0px 20px",
          }}
        >
          <HStack mb={4} justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <Heading as="h1" size="lg">
                NB1
              </Heading>
              <Image
                src={n0ImgLogo}
                width="32"
                className="translateImg"
                height="32"
                alt="n01 Logo"
              />
            </Flex>
            {hasAPIKey && (
              <HStack>
                <IconButton
                  icon={<SettingsIcon />}
                  padding="12px"
                  backgroundColor="gray"
                  color="white"
                  border="none"
                  borderRadius="4px"
                  cursor="pointer"
                  onClick={() => setView("settings")}
                  aria-label="open settings"
                />
                <Button
                  leftIcon={<Icon as={BsFolder} />}
                  colorScheme="blue"
                  onClick={() => setView("tasks")}
                >
                  Tarefas Salvas
                </Button>
              </HStack>
            )}
          </HStack>
          <SetAPIKey asInitializerView />
        </div>
      )}
    </>
  );
};

export default App;
