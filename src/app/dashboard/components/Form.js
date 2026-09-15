"use client";

import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { TitleHeader } from './ContentStyling';
import { fieldTypes, formMapping } from '@/app/utils/formMapping';
import styles from './Form.module.css';

const Form = ({ schema, onSubmitDetails, formTitle }) => {
    const [formSchema, setFormSchema] = useState(schema);
    const [loading, setLoading] = useState(false);
    const handleFieldChange = (field, value) => {
        setFormSchema((currentSchema) => currentSchema.map((schemaItem) => (
            schemaItem.field === field ? { ...schemaItem, value } : schemaItem
        )));
    };
    const onSubmitClick = async () => {
        setLoading(true);
        try {
            await onSubmitDetails(formSchema);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <TitleHeader variant="h6" content={formTitle} />
            <Box className={styles.fields}>
                {formSchema.map((schemaItem) => (schemaItem.type === fieldTypes.INPUT ? <TextField id="outlined-basic" label={formMapping[schemaItem.field]} variant="outlined" value={schemaItem.value} onChange={(event) => handleFieldChange(schemaItem.field, event.target.value)} key={schemaItem.field} fullWidth /> : null))}
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
