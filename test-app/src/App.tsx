import React, {JSX, useState} from "react";
import './App.css';

function App() {
    const testObject = {
        payload: {
            streams: [
                {
                    children: {
                        "2165d20a-6276-468f-a02f-1abd65cad618": {
                            additionalInformation: {
                                narrative: {
                                    apple: 5,
                                    banana: "B"
                                },
                                children: {
                                    fruits: [
                                        {
                                            name: "apple"
                                        },
                                        {
                                            name: "banana"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
        }
    };

    const [pathInput, setPathInput] = useState('')
    const [displayedValueStr, setDisplayedValueStr] = useState('')

    const replaceDotsWithBrackets = (str: string): string => {
        // Replace dots in path for array index keys with [
        // for readability
        return str.replaceAll(/(?<=\S*)(\.)(?=(\d\.))/gm, '[')
            .replaceAll(/(?<=(\[\d))(\.)(?=(\S))/gm, '].')
    }

    const shouldAddComma = (key: string, obj: any): boolean => {
        return Object.keys(obj).indexOf(key) > -1
            && Object.keys(obj).indexOf(key) < Object.keys(obj).length - 1
    }

    const traverseJSON = (path: string, obj: any): JSX.Element[] => {
        const elements: JSX.Element[] = [];
        for (let key in obj) {
            const value = obj[key];
            const isArray = Array.isArray(value);
            const isObject = typeof value === "object" && value !== null;

            if (isObject || isArray) {
                const newPath = path ? `${path}.${key}` : key;
                const prevElements: JSX.Element[] = traverseJSON(newPath, value);
                // Calculate length of path by dots
                const countDots = (newPath.match(/\./g) || []).length;
                const shouldAddCommaAfterElement = shouldAddComma(key, obj)

                elements.push(
                    <div style={{marginLeft: countDots * 4}}>
                        <p>{Number(key) > -1
                            ? '{'
                            : `${key}${isArray ? ': [' : ': {'}`
                        }</p>
                        {prevElements}
                        {isArray ? <p>{']'}</p> : <p>{'}'}{shouldAddCommaAfterElement ? ',' : ''}</p>}
                    </div>
                );
            } else {
                const countDots = (path.match(/\./g) || []).length;
                const shouldAddCommaAfterElement = shouldAddComma(key, obj)
                const quotationMark = typeof value === 'string' ? `'` : ''

                elements.push(
                    <div style={{marginLeft: countDots * 4}}>
                        <button key={`${path}.${key}`} onClick={
                            (e) => {
                                e.preventDefault()
                                setPathInput(replaceDotsWithBrackets(`${path}.${key}`))
                                setDisplayedValueStr(value)
                            }
                        }>
                            {key}
                        </button>
                        {': '}
                        {quotationMark}
                        {value}
                        {quotationMark}
                        {shouldAddCommaAfterElement ? ',' : ''}
                    </div>
                );
            }
        }
        return elements;
    }

    const deepFindInObj = (obj: any, path: string) => {
        let paths = path.split('.')
            , current = obj
            , i;

        for (i = 0; i < paths.length; ++i) {
            if (current[paths[i]] === undefined) {
                return 'undefined';
            } else {
                current = current[paths[i]];
            }
        }
        return current;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPathInput(e.target.value)
        const foundValue = deepFindInObj(testObject, e.target.value.replaceAll('[', '.').replaceAll('].', '.'))
        setDisplayedValueStr(typeof foundValue === "object" ? 'undefined' : foundValue)
    }

    return (
        <div className={'main-container'}>
            <div style={{marginTop: '20px'}}>
                <input
                    type="text"
                    onChange={handleInputChange}
                    value={pathInput}
                    style={{width: '100%'}}
                >
                </input>
                <p>Value: {displayedValueStr}</p>
            </div>
            <div className="JSONViewer">
                {traverseJSON("", testObject)}
            </div>
        </div>
    );
}

export default App;
