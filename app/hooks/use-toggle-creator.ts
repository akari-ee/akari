import { useUser } from "@clerk/react-router";
import { useState, type ReactElement } from "react";
import { toast } from "sonner";
import type { CToastProps } from "~/components/shared/custom-toast";

interface useToggleCreatorProps {
  toastComponent: (props: CToastProps) => React.ReactElement;
  onActivateMsg: string;
  onDeactivateMsg: string;
  onErrorMsg: string;
}

export const useToggleCreator = ({
  toastComponent,
  onActivateMsg,
  onDeactivateMsg,
  onErrorMsg,
}: useToggleCreatorProps) => {
  const { user } = useUser();
  const isCreator = user?.unsafeMetadata.isCreator as boolean;

  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!user) return;

    setLoading(true);

    try {
      await user.update({ unsafeMetadata: { isCreator: !isCreator } });
      toast.custom((t) =>
        isCreator
          ? toastComponent({ title: onDeactivateMsg })
          : toastComponent({ title: onActivateMsg })
      );
    } catch (error) {
      toast.custom((t) => toastComponent({ title: onErrorMsg, isError: true }));
    } finally {
      setLoading(false);
    }
  };

  return { isCreator, loading, handleToggle };
};
