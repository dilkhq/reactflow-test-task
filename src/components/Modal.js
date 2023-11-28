import { DialogContent, Button, Box, Dialog, DialogTitle, Stack, TextField} from "@mui/material";
import {Formik} from "formik";
import { useEffect, useMemo, useState } from "react";
import { useReactFlow } from "reactflow";

const initialValues = {
    label: "",
    text: "",
}


const Modal = (props) =>{
    const {openModal, setOpenModal, id} = props;
    const handleClose = () =>{
        setOpenModal(false)
    }
    const { setNodes, getNode} = useReactFlow();
    
    
   const handleFormnSubmit = (values) =>{
    console.log(id)
    setNodes((nds) =>
        nds.map((node)=>{
            if (node.id === id){
                node.data ={
                    ...node.data,
                    label: String(values.label),
                    text: String(values.text)
                }
            }
        return node;
    })
        )
    }
   

    return (
        <div>
            <Dialog open={openModal} onClose={handleClose}>
                <DialogTitle>Update</DialogTitle>
                <DialogContent>
                <Stack>
                    <Formik
                        onSubmit={handleFormnSubmit}
                        initialValues={initialValues}
                    >
                        {({ values, handleBlur, handleChange, handleSubmit}) => (
                            <form onSubmit={handleSubmit}>
                                <Box
                                    display="grid"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"

                                >
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="label"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.label}
                                        name="label"
                                        sx={{gridColumn:"span 4"}}
                                    />
                                     <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="text"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.text}
                                        name="text"
                                        sx={{gridColumn:"span 4"}}
                                    />
                                </Box>
                                <Box display="flex" justifyContent="end" mt="20px">
                                    <Button type="submit" variant="contained" sx={{backgroundColor:"#395886"}} onClick={handleClose}>
                                        Update
                                    </Button>
                                </Box>
                            </form>
                        )}

                    </Formik>
                </Stack>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Modal;