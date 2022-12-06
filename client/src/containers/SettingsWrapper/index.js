import { DeleteForeverOutlined as DeactivateIcon } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router-dom";
import PromptModal from "../../components/PromptModal/index";
import { useEventsStore } from "../../contexts/global/events";
import { useUserStore } from "../../contexts/global/user";
import { useUserSettings } from "../../contexts/local/userSettings";
import { socket } from "../Interceptor";

const SettingsWrapper = ({ location }) => {
  const resetUser = useUserStore((state) => state.resetUser);
  const resetEvents = useEventsStore((state) => state.resetEvents);

  const modal = useUserSettings((state) => state.modal);
  const userId = useUserSettings((state) => state.user.data.id);
  const isDeactivating = useUserSettings((state) => state.isDeactivating);
  const deactivateUser = useUserSettings((state) => state.deactivateUser);
  const toggleModal = useUserSettings((state) => state.toggleModal);

  const history = useHistory();

  const handleDeactivation = async ({ userId }) => {
    await deactivateUser({ userId });
    if (socket?.instance) socket.instance.emit("disconnectUser");
    resetUser();
    resetEvents();
    history.push("/login");
  };

  return (
    <PromptModal
      open={modal.open}
      handleConfirm={() => handleDeactivation({ userId })}
      handleClose={toggleModal}
      ariaLabel="Deactivate account"
      promptTitle="Are you sure you want to deactivate your account?"
      promptConfirm="Deactivate"
      promptCancel="Cancel"
      isSubmitting={isDeactivating}
      startIcon={<DeactivateIcon />}
    />
  );
};

export default SettingsWrapper;
