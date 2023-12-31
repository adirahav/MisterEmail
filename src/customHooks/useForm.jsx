import { useState } from "react";
import { useEffectOnChange } from "./useEffectOnChange";

export function useForm(initialState, cb) {
    const [fields, setFields] = useState(initialState)

    useEffectOnChange(() => {
        cb(fields)
    }, [fields])

    function handleChange({ target }) {
        let { name: field, value, type } = target
        switch (type) {
            case 'number':
            case 'range':
                value = (+value || '')
                break;
            case 'checkbox':
                value = target.checked
            default:
                break;
        }
        setFields((prevFields) => ({ ...prevFields, [field]: value }))
    }

    return [fields, handleChange, setFields]
}