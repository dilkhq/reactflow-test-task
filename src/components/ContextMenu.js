import React, {useCallback, useEffect, useState} from "react";
import {useReactFlow} from "reactflow";
import { Button } from "@mui/material";





export default function ContextMenu({
    id,
    top,
    left,
    right,
    bottom,
    ...props
}){

    const{handleClickModal} = props
    const { setNodes, setEdges} = useReactFlow();
    const deleteNode = useCallback(() => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id));
    }, [id, setNodes, setEdges]);

return (
        
        <div
            style={{top, left, right, bottom}}
            className="context-menu"
            {...props}
        >
            <p style={{ margin: "0.5em"}}>          
                <small>node: {id}</small>
            </p>
            
            <Button onClick={handleClickModal}>Update</Button>
            <Button onClick={deleteNode}>Delete</Button>
           
        </div>
        
    

    )
}