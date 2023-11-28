import React, {useState, useCallback, useRef} from "react"
import ReactFlow, {
    Background, 
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
    Panel,
    MarkerType,
    getNodesBounds
} from "reactflow";
import "reactflow/dist/style.css"
import ContextMenu  from "./components/ContextMenu";
import "./style.css"
import TextUpdaterNode from "./components/TextUpdaterNode";
import Modal from "./components/Modal";
import CustomNode from "./components/CustomNode";
import 'reactflow/dist/style.css';
import { Button } from "@mui/material";
import Sidebar from "./components/Sidebar";
import InputNode from "./components/InputNode";
import OutputNode from "./components/OutputNode";
import { jsonFileDownload} from "./components/FileProcess";


const connectionLineStyle = { stroke: 'black' };

const initialNodes = [
  { id: '1', data: { label: 'Node 1' , text: "asdasd"}, type: 'default', position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'Node 2' }, type: 'input', position: { x: 100, y: 200 } },
  { id: '3', data: { label: 'Node 3' }, type: 'output', position: { x: 100, y: 300 } }
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: 'black' }, markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: 'black',
  },}];

const flowKey = "example-flow";

const getNodeId = () => `randomnode_${+new Date()}`;
const nodeTypes = { default: CustomNode, input: InputNode, output: OutputNode };



const SaveRestore = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [rfInstance, setRfInstance] = useState(null);
    const [menu, setMenu] = useState(null);
    const ref = useRef(null);
    const reactFlowWrapper = useRef(null);
    const [dataLoad, setDataLoad] = useNodesState(initialNodes);
    const {setViewport, getNode} = useReactFlow();
    
    
    const jsonFileUpload = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      console.log("e.target.result", e.target.result);
      const data = JSON.parse(e.target.result);
      console.log("Json Data", data);
      setDataLoad(data)
      onRestore(data)
    };
    
    };
    const onConnect = useCallback((params) => setEdges((eds) => addEdge({...params,  animated: true, style: { stroke: 'black' }, markerEnd: {
                                                                                                                                    type: MarkerType.ArrowClosed,
                                                                                                                                    width: 20,
                                                                                                                                    height: 20,
                                                                                                                                    color: 'black',
                                                                                                                                }}, eds)), [setEdges]);
    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            localStorage.setItem(flowKey, JSON.stringify(flow));
            jsonFileDownload(flow)
        }
    }, [rfInstance]);
    
    const onRestore = useCallback((data) => {
        const restoreFlow = async (data) => {
            const flow = data;
            if (flow) {
                const { x = 0, y = 0, zoom = 1} = flow.viewport;
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                setViewport({x, y, zoom});
            }
        };

        restoreFlow(data);
    }, [setNodes, setEdges, setViewport]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.droppEffect = "move"
    }, [])

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            
            const type = event.dataTransfer.getData("application/reactflow")
            
            if (typeof type == "undefined" || !type){
                return;
            }
            const position = rfInstance.screenToFlowPosition({
                x:event.clientX,
                y:event.clientY,
            });
            const newNode = {
                id: getNodeId(),
                type,
                data: {label: `${type} node`},
                position,
            };

            setNodes((nds) => nds.concat(newNode))
        },
        [rfInstance]
    )


    // const onAdd = useCallback(() => {
    //     const newNode = {
    //         id: getNodeId(),
    //         data: {label: "Added node"},
    //         position: {
    //             x: Math.random() * window.innerWidth - 100,
    //             y: Math.random() * window.innerHeight,
    //         },
    //         type: 'custom',
            
    //     };
    //     setNodes((nds) => nds.concat(newNode));
    // }, [setNodes]);

    const onNodeContextMenu = useCallback(
        (event, node) => {
            event.preventDefault();

            const pane = ref.current.getBoundingClientRect();
            setMenu({
                id: node.id,
                top: event.clientY < pane.height - 200 && event.clientY,
                left: event.clientX < pane.width - 200 && event.clientX,
                right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
                bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,

            });  
        },[setMenu],
    )
    
    const onPaneClick = useCallback(() => setMenu(null), [setMenu])
    const [openModal, setOpenModal] = useState(false);
    const [ID, setID] = useState(null)
    const handleClickModal = () =>{
        setID(menu.id)
        setOpenModal(true)

    }
    
    return (
        <div className="dndflow">
            
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            onPaneClick={onPaneClick}
            connectionLineStyle={connectionLineStyle}
            onNodeContextMenu={onNodeContextMenu}
            ref={ref}
            nodeTypes={nodeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
            <Background color="f0f3fa"/> 
            {menu && <ContextMenu onClick={onPaneClick} {...menu} handleClickModal={handleClickModal} />}
            <Modal openModal={openModal} setOpenModal={setOpenModal} id = {ID} />
            <Panel position="top-right">
                <Button onClick={onSave} variant="contained" sx={{backgroundColor:"#395886"}}>save</Button>
                {/* <Button onClick={onRestore} variant="contained" sx={{backgroundColor:"#395886"}}>restore</Button> */}
                <input type="file" onChange={jsonFileUpload} />
            </Panel>
        </ReactFlow><Sidebar/>
       
        </div>
        
        
    );
};


export default () => (
    <ReactFlowProvider>
      <SaveRestore />
    </ReactFlowProvider>
  );