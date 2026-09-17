"use client";

import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { fieldTypes, formMapping } from '@/app/utils/formMapping';
import { CATEGORY_OPTIONS } from '@/app/utils/eventUtils';
import styles from './Form.module.css';
import Dropdown from './Dropdown';
import RadioGroup from './RadioGroup';
import TodayDatePicker from '../today/components/DatePicker';
import TodayTimePicker from '../today/components/TimePicker';

const Form = ({ schema, onSubmitDetails }) => {
    const [formSchema, setFormSchema] = useState(() => schema.map((schemaItem) => {
        if ([fieldTypes.DATEPICKER, fieldTypes.TIMEPICKER].includes(schemaItem.type) && !schemaItem.value) {
            return { ...schemaItem, value: dayjs() };
        }

        if (schemaItem.type === fieldTypes.DROPDOWN && !schemaItem.value) {
            const options = CATEGORY_OPTIONS[schemaItem.category] || [];
            return options.length ? { ...schemaItem, value: options[0] } : schemaItem;
        }

        return schemaItem;
    }));
    const [loading, setLoading] = useState(false);
    const handleFieldChange = (field, value) => {
        setFormSchema((currentSchema) => currentSchema.map((schemaItem) => (
            schemaItem.field === field ? { ...schemaItem, value } : schemaItem
        )));
    };
    const handleInputChange = (field) => (event) => {
        handleFieldChange(field, event.target.value);
    };
    const handleValueChange = (field) => (value) => {
        handleFieldChange(field, value);
    };
    const onSubmitClick = async () => {
        setLoading(true);
        try {
            await onSubmitDetails(formSchema);
        } finally {
            setLoading(false);
        }
    }
    const renderComponent = (schemaItem) => {
        switch (schemaItem.type) {
            case fieldTypes.INPUT:
                return (<TextField id="outlined-basic" disabled={schemaItem.disabled} label={formMapping[schemaItem.field]} variant="outlined" value={schemaItem.value} onChange={handleInputChange(schemaItem.field)} key={schemaItem.field} fullWidth />)
            case fieldTypes.DROPDOWN:
                return (
                    <Dropdown
                        key={schemaItem.field}
                        id={schemaItem.field}
                        label={formMapping[schemaItem.field]}
                        value={schemaItem.value}
                        onChange={handleValueChange(schemaItem.field)}
                        options={CATEGORY_OPTIONS[schemaItem.category] || []}
                        disabled={schemaItem.disabled}
                    />
                );
            case fieldTypes.DATEPICKER:
                return (
                    <TodayDatePicker
                        key={schemaItem.field}
                        label={formMapping[schemaItem.field]}
                        value={schemaItem.value}
                        onChange={handleValueChange(schemaItem.field)}
                        disabled={schemaItem.disabled}
                        isEditable={!schemaItem.disabled}
                    />
                );
            case fieldTypes.TIMEPICKER:
                return (
                    <TodayTimePicker
                        key={schemaItem.field}
                        label={formMapping[schemaItem.field]}
                        value={schemaItem.value}
                        onChange={handleValueChange(schemaItem.field)}
                        disabled={schemaItem.disabled}
                        isEditable={!schemaItem.disabled}
                    />
                );
            case fieldTypes.RADIO:
                return (
                    <RadioGroup
                        key={schemaItem.field}
                        id={schemaItem.field}
                        label={formMapping[schemaItem.field]}
                        value={schemaItem.value}
                        onChange={handleValueChange(schemaItem.field)}
                        options={CATEGORY_OPTIONS[schemaItem.category] || []}
                        disabled={schemaItem.disabled}
                    />
                );
            default:
                return null;
        }
    }

    return (
        <>
            <Box className={styles.fields}>
                {formSchema.map((schemaItem) => (renderComponent(schemaItem)))}
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
