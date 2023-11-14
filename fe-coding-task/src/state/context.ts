import { createContext } from "react";

export interface IStettingsState {
    isHistoryNavOpen: boolean;
}
export const initialSettingsState: IStettingsState = {
    isHistoryNavOpen: false,
}

export interface ContextProps {
    appState: IAppContext;
    setAppState: any;
    settingsState: any;
    setSettingsState: any
}

export interface IHistoryList {
    id: string
    boligtype: string;
    kvartalFrom: string;
    kvartalTo: string;
    comment: string;
}

export interface IAppContext {
    boligtype: string;
    boligtypeList: string[];
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
  
export const appContext = createContext<ContextProps | null>(null);