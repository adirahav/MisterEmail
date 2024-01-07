import { useState } from "react";
import { useEffectOnChange } from "./useEffectOnChange";

export function useForm(initialState, callback) {
    const [fields, setFields] = useState(initialState)

    useEffectOnChange(() => {
        callback(fields)
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

    return [fields, handleChange/*, setFields*/]
}