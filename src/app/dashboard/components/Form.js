"use client";

import { Box, TextField } from '@mui/material';
import React from 'react';
import { TitleHeader } from './ContentStyling';

export const fieldTypes={
    "INPUT":"input"
};
const Form=({schema})=>{
    return(
        <>
        <TitleHeader variant="h6" content="Juno's details"/>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {schema.map((schemaItem)=>(schemaItem.type===fieldTypes.INPUT ? <TextField id="outlined-basic" label={schemaItem.field} variant="outlined" value={schemaItem.value} key={schemaItem.field} fullWidth/> : null))}
        </Box>
        </>
    )
}
export default Form;