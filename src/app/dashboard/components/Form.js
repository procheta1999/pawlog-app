"use client";

import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { TitleHeader } from './ContentStyling';
import { formMapping } from '@/app/utils/formMapping';

export const fieldTypes={
    "INPUT":"input"
};
const Form=({schema, onSubmitDetails})=>{
    const [formSchema, setFormSchema] = useState(schema);
    const [loading, setLoading]=useState(false);
    const handleFieldChange = (field, value) => {
        setFormSchema((currentSchema) => currentSchema.map((schemaItem) => (
            schemaItem.field === field ? { ...schemaItem, value } : schemaItem
        )));
    };
    const onSubmitClick=async ()=>{
        setLoading(true);
        try {
            await onSubmitDetails(formSchema);
        } finally {
            setLoading(false);
        }
    }

    return(
        <>
        <TitleHeader variant="h6" content="Juno's details"/>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {formSchema.map((schemaItem)=>(schemaItem.type===fieldTypes.INPUT ? <TextField id="outlined-basic" label={formMapping[schemaItem.field]} variant="outlined" value={schemaItem.value} onChange={(event) => handleFieldChange(schemaItem.field, event.target.value)} key={schemaItem.field} fullWidth/> : null))}
            <Button
                variant="contained"
                onClick={onSubmitClick}
                loading={loading}
                loadingPosition="start"
            >
                Submit
            </Button>
        </Box>
        </>
    )
}
export default Form;
