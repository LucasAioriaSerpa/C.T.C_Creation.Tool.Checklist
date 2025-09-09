import { useState } from "react";

export const UseForm = (initialState = {}) => {
    const [values, setValues] = useState(initialState)
    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }
    const resetForm = () => {
        setValues(initialState)
    }
    return [values, handleChange, resetForm]
}
