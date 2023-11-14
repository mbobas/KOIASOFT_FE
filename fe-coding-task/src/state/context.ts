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
    
   }
  
export const initialMainState: IAppContext = {

}
  
export const appContext = createContext<ContextProps | null>(null);