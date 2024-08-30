import './App.css';
import Input from '../../component/input/Input';
import Button from '../../component/button/Button';
import Selector from '../../component/selector/Selector'
import { useCallback, useState } from 'react';

function App() {
    const [ party, setParty ] = useState("")
    const [ position, setPosition ] = useState("1")
    const [ password, setPassword ] = useState("")
    const [ isToStartAutomatically, setIsToStartAutomatically ] = useState("")

    const startParty = useCallback(() => {
        
    }, [party, position, password, isToStartAutomatically])

    return (
        <div className="App">
            <div className="flex-col min-h-screen content-center">
                <div className="flex justify-around pb-5">
                    <Input
                        label="Party"
                        inputValue={party}
                        onChangeInput={setParty}
                    />
                </div>
                <div className="flex justify-around pb-5">
                    <Input
                        label="Position"
                        inputValue={position}
                        onChangeInput={setPosition}
                    />
                </div>
                <div className="flex justify-around pb-5">
                    <Input
                        label="Password"
                        inputValue={password}
                        onChangeInput={setPassword}
                    />
                </div>
                <div className="flex justify-around pb-5">
                    <Selector
                        label="Start automatically"
                        options={["No", "Yes"]}
                        selectedOption={isToStartAutomatically}
                        onChange={setIsToStartAutomatically}
                    />
                </div>
                <div className="flex justify-around">
                    <Button onClick={startParty}>
                        Create/Enter Party
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default App;
