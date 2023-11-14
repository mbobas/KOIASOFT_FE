import { createContext } from "react";
import { Boligtype, IHistoryList } from "state/interfaces";

export interface IStettingsState {
    isHistoryNavOpen: boolean;
    isHistoryItemClicked: boolean;
}
export const initialSettingsState: IStettingsState = {
    isHistoryNavOpen: false,
    isHistoryItemClicked: false
}

export interface IAppContext {
    boligtype: string;
    boligtypeList: Boligtype[];
    kvartalFrom: string;
    kvartalTo: string;
    comment: string;
    historyList: IHistoryList[];
   }
  
export const initialMainState: IAppContext = {
    boligtype: '',
    kvartalFrom: '',
    kvartalTo: '',
    comment: '',
    historyList: [],
    boligtypeList: []
}

export interface ContextProps {
    appState: IAppContext;
    setAppState: any;
    settingsState: any;
    setSettingsState: any
}
  
export const appContext = createContext<ContextProps | null>(null);