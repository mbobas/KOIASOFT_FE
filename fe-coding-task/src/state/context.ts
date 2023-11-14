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

export interface IAppContext {
    boligtype: string;
    kvartalFrom: string;
    kvartalTo: string;
    comment: string;
   }
  
export const initialMainState: IAppContext = {
    boligtype: '',
    kvartalFrom: '',
    kvartalTo: '',
    comment: '',
}
  
export const appContext = createContext<ContextProps | null>(null);