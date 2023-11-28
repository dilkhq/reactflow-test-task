import React, {memo} from 'react';
import { Handle, Position} from "reactflow";
import styled from 'styled-components';


const Node = styled.div`
.react-flow__node-input{
    padding: 50px 40px;
    border-radius: 5px;
    background: #b1c9ef;
    color: f0f3fa;
    border: 2px solid #395886;
}
    .react-flow__handle {
        background: #395886;
        width: 8px;
        height: 10px;
        border-radius: 3px;
    }
    `

export default memo(({ data, selected }) => {
    return (
        <Node selected={selected}>
        <div>
            <strong>{data.label}</strong>
            <p>text: {data.text}</p>
        </div>
        <Handle type="source" position={Position.Bottom} />
        </Node>
    );
    });

