export interface DatatoDownload {
    value: string;
    quarter: string;
}

export interface Boligtype {
    value: string;
    valueText: string;
}

export interface Kvartal {
    value: string;
    valueText: string;
}

export interface IDataToQuery {
    boligtype: Array<Boligtype>;
    kvartalFrom: Array<Kvartal>;
    kvartalTo: Array<Kvartal>;
}

export interface IHistoryList {
    id: string
    boligtype: string;
    kvartalFrom: string;
    kvartalTo: string;
    comment: string;
}
export interface IApiResponse {
    variables: IVariables[];
    class: string;
    label: string;
    source: string;
    updated: string;
    id: string[];
    size: number[];
    dimension: {
        Boligtype: {
            extension: {
                show: string;
            };
            label: string;
            category: {
                index: { [key: string]: number };
                label: { [key: string]: string };
            };
            link: {
                describedby: {
                    extension: {
                        Boligtype: string;
                    };
                }[];
            };
        };
        ContentsCode: {
            extension: {
                show: string;
            };
            label: string;
            category: {
                index: { [key: string]: number };
                label: { [key: string]: string };
                unit: {
                    [key: string]: {
                        base: string;
                        decimals: number;
                    };
                };
            };
        };
        Tid: {
            extension: {
                show: string;
            };
            label: string;
            category: {
                index: { [key: string]: number };
                label: { [key: string]: string };
            };
        };
    };
    value: number[];
    role: {
        time: string[];
        metric: string[];
    };
    version: string;
    extension: {
        px: {
            infofile: string;
            tableid: string;
            decimals: number;
        };
    };
}

export interface IVariables {
    code: string;
    text: string;
    values: string[];
    valueTexts: string[];
    elimination?: boolean;
    time?: boolean;
}

export interface Kvartal {
    value: string;
    valueText: string;
}

export interface IVariablesResponse {
    boligtype: Array<Boligtype>;
    kvartal: Array<Kvartal>;
}