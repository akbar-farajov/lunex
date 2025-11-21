"use client";
import {
  FC,
  memo,
  startTransition,
  useCallback,
  useOptimistic,
  useState,
} from "react";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import { PromptInputButton } from "@/components/ai-elements/prompt-input";
import { CheckIcon } from "lucide-react";
import { models } from "@/lib/ai/models";
import { saveChatModelAsCookie } from "@/actions/ai";

const DEFAULT_MODEL_ID = models[0]?.id ?? "";
const SEARCH_PLACEHOLDER = "Search models...";
const EMPTY_MESSAGE = "No models found.";
const GROUP_HEADING = "Available Models";

interface PureChatModelSelectorProps {
  selectedModel?: string;
  onModelChange?: (modelId: string) => void;
}

export const PureChatModelSelector: FC<PureChatModelSelectorProps> = ({
  selectedModel,
  onModelChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentModelId = selectedModel ?? DEFAULT_MODEL_ID;
  const [optimisticModelId, setOptimisticModelId] =
    useOptimistic(currentModelId);

  const displayModelId = optimisticModelId;
  const currentModelData = models.find((m) => m.id === displayModelId);

  const handleModelSelect = useCallback(
    (modelId: string) => {
      setIsOpen(false);

      startTransition(() => {
        setOptimisticModelId(modelId);
        saveChatModelAsCookie(modelId).catch((error) => {
          console.error("Failed to save model preference:", error);
        });

        onModelChange?.(modelId);
      });
    },
    [onModelChange, setOptimisticModelId]
  );

  if (!currentModelData) {
    console.warn(`Model data not found for ID: ${displayModelId}`);
    return null;
  }

  return (
    <ModelSelector onOpenChange={setIsOpen} open={isOpen}>
      <ModelSelectorTrigger asChild>
        <PromptInputButton aria-label="Select AI model">
          <ModelSelectorLogo provider={currentModelData.provider} />
          <ModelSelectorName>{currentModelData.name}</ModelSelectorName>
        </PromptInputButton>
      </ModelSelectorTrigger>
      <ModelSelectorContent>
        <ModelSelectorInput placeholder={SEARCH_PLACEHOLDER} />
        <ModelSelectorList>
          <ModelSelectorEmpty>{EMPTY_MESSAGE}</ModelSelectorEmpty>
          <ModelSelectorGroup heading={GROUP_HEADING}>
            {models.map((model) => {
              const isSelected = displayModelId === model.id;

              return (
                <ModelSelectorItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => handleModelSelect(model.id)}
                >
                  <ModelSelectorLogo provider={model.provider} />
                  <ModelSelectorName>{model.name}</ModelSelectorName>
                  {isSelected && (
                    <CheckIcon
                      className="ml-auto size-4"
                      aria-label="Selected"
                    />
                  )}
                </ModelSelectorItem>
              );
            })}
          </ModelSelectorGroup>
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  );
};

export const ChatModelSelector = memo(
  PureChatModelSelector,
  (prevProps, nextProps) => {
    return (
      prevProps.selectedModel === nextProps.selectedModel &&
      prevProps.onModelChange === nextProps.onModelChange
    );
  }
);
