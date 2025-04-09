import React from "react";
import { isMobile } from "react-device-detect";
import WorkspaceChatContainer from "@/components/WorkspaceChat";
import { useEffect, useState } from "react";
import Workspace from "@/models/workspace";
import NewWorkspaceModal, { useNewWorkspaceModal } from "../Modals/NewWorkspace";

export default function DefaultChatContainer() {
  const [firstWorkspace, setFirstWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasNoWorkspaces, setHasNoWorkspaces] = useState(false);
  const {
    showing: showingNewWsModal,
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
  } = useNewWorkspaceModal();

  useEffect(() => {
    async function getFirstWorkspace() {
      const workspaces = await Workspace.all();
      if (workspaces.length === 0) {
        setHasNoWorkspaces(true);
        setLoading(false);
        return;
      }
      
      const workspace = workspaces[0];
      const suggestedMessages = await Workspace.getSuggestedMessages(workspace.slug);
      const pfpUrl = await Workspace.fetchPfp(workspace.slug);
      setFirstWorkspace({
        ...workspace,
        suggestedMessages,
        pfpUrl,
      });
      setLoading(false);
    }
    getFirstWorkspace();
  }, []);

  if (hasNoWorkspaces) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex items-center justify-center">
        <div className="flex flex-col items-center gap-y-4">
          <p className="text-white/80 light:text-theme-text-primary text-lg">
            Welcome! Please create a workspace to get started.
          </p>
          <button
            onClick={showNewWsModal}
            className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white light:border-black/50 light:text-theme-text-primary text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800"
          >
            Create Workspace
          </button>
          {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <WorkspaceChatContainer loading={loading} workspace={firstWorkspace} />
    </div>
  );
}
