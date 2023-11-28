import {useCallback} from "react";
import { Handle, Position, useReactFlow} from "reactflow";

const hanldeStyle = {left: 10};


function TextUpdaterNode({data, isConnectable}) {
    const onChange = useCallback((evt) => {
        console.log(evt.target);
    }, []);

    return (
        <div className="text-updater-node">
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
            <div>
                <label htmlFor="text">Text:</label>
                <input id="text" name="text" onChange={onChange} className="input" />

            </div>
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="a"
                    style={hanldeStyle}
                    isConnectable={isConnectable}
                />
                <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
        </div>
    )
}

export default TextUpdaterNode;