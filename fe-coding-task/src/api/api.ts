import axios from "axios";
import { IApiResponse, IVariablesResponse } from "state/interfaces";

const url = `https://data.ssb.no/api/v0/no/table/07241`;

export async function getVariables(): Promise<IVariablesResponse> {
    try {
        const response = await axios.get<IApiResponse>(url);
        const variables = response.data.variables;

        const boligtypeVar = variables.find(v => v.code === 'Boligtype');
        const tidVar = variables.find(v => v.code === 'Tid');

        if (!boligtypeVar || !tidVar) {
            throw new Error('Required data not found in the response');
        }

        const boligtypeArray = boligtypeVar.values.map((value, index) => {
            return {
                value: value,
                valueText: boligtypeVar.valueTexts[index]
            };
        });

        const kvartalArray = tidVar.values.map((value, index) => {
            return {
                value: value,
                valueText: tidVar.valueTexts[index]
            };
        });

        const data: IVariablesResponse = {
            boligtype: boligtypeArray,
            kvartal: kvartalArray
        };

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}


export async function postChartData(Boligtype: string, quarters: string[]): Promise<any> {
    const data = {
        query: [
            {
                code: "Boligtype",
                selection: {
                    filter: "item",
                    values: [Boligtype]
                }
            },
            {
                code: "ContentsCode",
                selection: {
                    filter: "item",
                    values: ["KvPris"]
                }
            },
            {
                code: "Tid",
                selection: {
                    filter: "item",
                    values: quarters
                }
            }
        ],
        response: {
            format: "json-stat2"
        }
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error making POST request:', error);
        throw error;
    }
}

