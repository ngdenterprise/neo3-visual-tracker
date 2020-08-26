import React, { useEffect, useState } from "react";

import ControllerRequest from "../shared/controllerRequest";
import Tracker from "./views/Tracker";
import TrackerViewState from "../shared/viewState/trackerViewState";
import View from "../shared/view";
import ViewRequest from "../shared/viewRequest";
import ViewStateBase from "../shared/viewState/viewStateBase";

declare var acquireVsCodeApi: any;
const vscode = acquireVsCodeApi();

export default function ViewRouter() {
  const postMessage = (request: ViewRequest) => {
    console.log("📤", request);
    vscode.postMessage(request);
  };
  const receiveMessage = (request: ControllerRequest) => {
    console.log("📬", request);
    if (request.viewState.view !== view) {
      // Replace viewstate:
      setView(request.viewState.view);
      setViewState(request.viewState);
    } else {
      // Merge viewstate:
      setViewState((existing: any) => ({ ...existing, ...request.viewState }));
    }
  };
  const [view, setView] = useState<View | null>(null);
  const [viewState, setViewState] = useState<ViewStateBase | null>(null);
  useEffect(() => {
    window.addEventListener("message", (msg) => receiveMessage(msg.data));
    postMessage({ retrieveViewState: true });
  }, []);
  if (!view || !viewState) {
    return <div>Loading&hellip;</div>;
  }
  switch (view) {
    case "tracker":
      return <Tracker viewState={viewState as TrackerViewState} />;
    default:
      return <div>Error: Unknown view.</div>;
  }
}
