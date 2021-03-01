import React from "react";
import PromptModal from "../../components/PromptModal/index.js";
import { useUserSettings } from "../../contexts/local/userSettings";

const SettingsWrapper = ({ location }) => {
  const modal = useUserSettings((state) => state.modal);
  const userId = useUserSettings((state) => state.user.data.id);
  const isDeactivating = useUserSettings((state) => state.isDeactivating);
  const deactiveUser = useUserSettings((state) => state.deactiveUser);
  const toggleModal = useUserSettings((state) => state.toggleModal);

  return (
    <PromptModal
      open={modal.open}
      handleConfirm={() => deactiveUser({ userId })}
      handleClose={toggleModal}
      ariaLabel="Deactivate account"
      promptTitle="Are you sure you want to deactivate your account?"
      promptConfirm="Deactivate"
      promptCancel="Cancel"
      isSubmitting={isDeactivating}
    />
  );
};

export default SettingsWrapper;
