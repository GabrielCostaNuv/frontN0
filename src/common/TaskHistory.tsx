/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useContext } from "react";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  VStack,
  HStack,
  Box,
  Accordion,
  AccordionItem,
  Heading,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
  Spacer,
  ColorProps,
  BackgroundProps,
} from "@chakra-ui/react";
import { TaskHistoryEntry } from "../state/currentTask";
import { BsSortNumericDown, BsSortNumericUp } from "react-icons/bs";
import { useAppState } from "../state/store";
import CopyButton from "./CopyButton";
import Notes from "./CustomKnowledgeBase/Notes";

import { ChatContext } from "./context/ChatContext";

function MatchedNotes() {
  const knowledge = useAppState((state) => state.currentTask.knowledgeInUse);
  const notes = knowledge?.notes;
  if (!notes || notes.length === 0) {
    return null;
  }

  return (
    <AccordionItem>
      <Heading as="h3" size="sm">
        <AccordionButton>
          <Box mr="4" fontWeight="bold">
            0.
          </Box>
          <Box as="span" textAlign="left" flex="1">
            Encontradas {notes.length} instruções.
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </Heading>
      <AccordionPanel backgroundColor="gray.100" p="2">
        <Accordion allowMultiple w="full" defaultIndex={1}>
          <Box pl={2}>
            <Notes notes={notes} />
          </Box>
          <Alert status="info" borderRadius="sm" mt="1">
            <AlertIcon />
            <AlertDescription fontSize="0.8rem" lineHeight="4">
              Você pode personalizar as instruções no menu de configurações.
            </AlertDescription>
          </Alert>
        </Accordion>
      </AccordionPanel>
    </AccordionItem>
  );
}

type TaskHistoryItemProps = {
  index: number;
  entry: TaskHistoryEntry;
  dataHistory: ChatHistoryEntry[];
};

const CollapsibleComponent = (props: {
  title: string;
  subtitle?: string;
  text: string;
}) => (
  <AccordionItem backgroundColor="white">
    <Heading as="h4" size="xs">
      <AccordionButton>
        <HStack flex="1">
          <Box>{props.title}</Box>
          <CopyButton text={props.text} /> <Spacer />
          {props.subtitle && (
            <Box as="span" fontSize="xs" color="gray.500" mr={4}>
              {props.subtitle}
            </Box>
          )}
        </HStack>
        <AccordionIcon />
      </AccordionButton>
    </Heading>
    <AccordionPanel>
      {props.text.split("\n").map((line, index) => (
        <Box key={index} fontSize="xs">
          {line}
          <br />
        </Box>
      ))}
    </AccordionPanel>
  </AccordionItem>
);

const TaskHistoryItem = ({
  index,
  entry,
  dataHistory,
}: TaskHistoryItemProps) => {
  const itemTitle = entry.action.thought;

  const colors: {
    text: ColorProps["textColor"];
    bg: BackgroundProps["bgColor"];
  } = {
    text: undefined,
    bg: undefined,
  };
  if (entry.action.operation.name === "fail") {
    colors.text = "red.800";
    colors.bg = "red.100";
  } else if (entry.action.operation.name === "finish") {
    colors.text = "green.800";
    colors.bg = "green.100";
  }

  return (
    <>
      {dataHistory.map((item, index) => (
        <div key={index}>
          <div className={`message user-message`}>
            <p className="message-text">{item.resUser}</p>
          </div>
          <div className={`message bot-message`}>
            {/* <p className="message-text">{item.resBot}</p> */}
          </div>
        </div>
      ))}
    </>
    // <div className={`message bot-message`}>
    //   {/* <p className="message-text">{itemTitle}</p> */}
    // </div>
    // <AccordionItem>
    //   <Heading as="h3" size="sm" textColor={colors.text} bgColor={colors.bg}>
    //     <AccordionButton>
    //       <Box mr="4" fontWeight="bold">
    //         {index + 1}.
    //       </Box>
    //       <Box as="span" textAlign="left" flex="1">
    //         {itemTitle}
    //       </Box>
    //       <AccordionIcon />
    //     </AccordionButton>
    //   </Heading>
    //   <AccordionPanel backgroundColor="gray.100" p="2">
    //     <Accordion allowMultiple w="full" defaultIndex={1}>
    //       {entry.usage != null && (
    //         <>
    //           <CollapsibleComponent
    //             title="Prompt"
    //             subtitle={`${entry.usage.prompt_tokens} tokens`}
    //             text={entry.prompt}
    //           />
    //           <CollapsibleComponent
    //             title="Resposta"
    //             subtitle={`${entry.usage.completion_tokens} tokens`}
    //             text={entry.response}
    //           />
    //           <CollapsibleComponent
    //             title="Ação"
    //             text={JSON.stringify(entry.action, null, 2)}
    //           />
    //         </>
    //       )}
    //     </Accordion>
    //   </AccordionPanel>
    // </AccordionItem>
  );
};

interface ChatHistoryEntry {
  resUser: string | null;
  resBotResponses: string[];
  date: string;
  completed: boolean;
}

export default function TaskHistory() {
  const { taskHistory, taskStatus, instructions } = useAppState((state) => ({
    taskStatus: state.currentTask.status,
    taskHistory: state.currentTask.history,
    instructions: state.ui.instructions,
  }));
  const [sortNumericDown, setSortNumericDown] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryEntry[]>([]);

  console.log(taskStatus);

  useEffect(() => { 
    if (taskStatus === "success") {
      setChatHistory((prevHistory) => {
        const updatedPrevHistory = prevHistory.map((entry) => ({
          ...entry,
          completed: true,
        }));

        return updatedPrevHistory;
      });
    }
  }, [taskStatus]);

  // useEffect(() => {
  //   const search = {
  //     resBot: instructions,
  //     resUser: instructions,
  //     date: new Date().toLocaleString(),
  //   };

  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   setChatHistory((prevHistory: any) => {
  //     if (prevHistory.length === 0 || prevHistory[prevHistory.length - 1].resBot !== search.resBot) {
  //       return [...prevHistory, search];
  //     }
  //     return prevHistory;
  //   });
  // }, [historyItems]);

  // function setHistory(title: string) {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const search: any = {
  //     resBot: title,
  //     resUser: instructions,
  //     date: new Date().toLocaleString(),
  //   };

  //   return chatHistory.push(search);
  //   // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   // const existingIndex = chatHistory.findIndex(
  //   //   (item: any) => item.resBot === title,
  //   // );

  //   // if (existingIndex !== -1) {
  //   //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   //   const existingItem: any = chatHistory[existingIndex];
  //   //   const updatedItem = {
  //   //     ...existingItem,
  //   //     resUser: instructions,
  //   //     date: new Date().toLocaleString(),
  //   //   };
  //   //   const updatedChatHistory = [...chatHistory];
  //   //   updatedChatHistory[existingIndex] = updatedItem;
  //   //   return;
  //   // }

  //   // // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   // // const existingIndex2 = chatHistory.findIndex(
  //   // //   (item: any) => item.resUser === instructions,
  //   // // );

  //   // // if (existingIndex2 !== -1) {
  //   // //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   // //   const existingItem: any = chatHistory[existingIndex2];
  //   // //   const updatedItem = {
  //   // //     ...existingItem,
  //   // //     resBot: title,
  //   // //     date: new Date().toLocaleString(),
  //   // //   };
  //   // //   const updatedChatHistory = [...chatHistory];
  //   // //   updatedChatHistory[existingIndex2] = updatedItem;
  //   // //   setChatHistory(updatedChatHistory);
  //   // //   return;
  //   // // }
  //   // // if (chatHistory.length < 1) {
  //   // //   setChatHistory(search);
  //   // // }

  //   // // setChatHistory((prev) => [...prev, search]);
  // }

  useEffect(() => {
    if (taskHistory.length > 0) {
      const lastEntry = taskHistory[taskHistory.length - 1];
      const itemTitle = lastEntry.action.thought;

      setChatHistory((prevHistory) => {
        // Check if there's an existing entry with the same instructions
        const existingEntryIndex = prevHistory.findLastIndex(
          (entry) =>
            entry.resUser === instructions && entry.completed === false,
        );

        if (existingEntryIndex !== -1) {
          // If existing entry exists, add the new bot response to its responses
          const updatedHistory = [...prevHistory];
          updatedHistory[existingEntryIndex] = {
            ...updatedHistory[existingEntryIndex],
            resBotResponses: [
              ...updatedHistory[existingEntryIndex].resBotResponses,
              itemTitle,
            ],
          };
          return updatedHistory;
        } else {
          // If no existing entry, create a new one
          const newEntry: ChatHistoryEntry = {
            resUser: instructions,
            resBotResponses: [itemTitle],
            date: new Date().toLocaleString(),
            completed: false,
          };
          return [...prevHistory, newEntry];
        }
      });
    }
  }, [taskHistory]);

  const toggleSort = () => {
    setSortNumericDown(!sortNumericDown);
  };

  if (taskHistory.length === 0 && taskStatus !== "running") return null;
  // const historyItems = taskHistory.map((entry, index) => (
  //   <TaskHistoryItem
  //     key={index}
  //     index={index}
  //     entry={entry}
  //     dataHistory={chatHistory}
  //   />
  // ));
  // historyItems.unshift(<MatchedNotes key="matched-notes" />);
  // if (!sortNumericDown) {
  //   historyItems.reverse();
  // }

  console.log(chatHistory);

  return (
    <VStack mt={8}>
      {/* <HStack w="full">
        <Heading as="h3" size="md">
          Histórico de Ações
        </Heading>
        <Spacer />
        <Icon
          as={sortNumericDown ? BsSortNumericDown : BsSortNumericUp}
          cursor="pointer"
          color="gray.500"
          _hover={{ color: "gray.700" }}
          onClick={toggleSort}
        />
        <CopyButton text={JSON.stringify(taskHistory, null, 2)} />
      </HStack> */}

      {/* <div className={`message user-message`}>
        <p className="message-text">{instructions}</p>
      </div> */}

      {/* <Accordion allowMultiple w="full" pb="4">
        {historyItems}
      </Accordion> */}

      {chatHistory.map((item, index) => (
        <div key={index}>
          <div className={`message user-message`}>
            <p className="message-text">{item.resUser}</p>
          </div>
          {item.resBotResponses.map((response, index) => (
            <div key={index} className={`message bot-message`}>
              <p className="message-text">{response}</p>
            </div>
          ))}
          {!item.completed && (
            <div className="loading bot-message message-dot">
              <p>
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </p>
            </div>
          )}
        </div>
      ))}
    </VStack>
  );
}
