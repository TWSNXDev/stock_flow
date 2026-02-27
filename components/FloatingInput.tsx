import { UseFormRegister,Path, FieldValues } from "react-hook-form";

interface FloatingInputProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    register: UseFormRegister<T>;
    type?: string;
    error?: string;
}

const FloatingInput = <T extends FieldValues>({ label, name, register, type = "text", error }: FloatingInputProps<T>) => {

    const inputStyle = `border border-neutral-200 p-2 rounded-md outline-none focus:border-primary w-full peer`

    const labelStyle = `absolute left-1 text-neutral-500 px-2 origin-top-left transform duration-300 bg-neutral-100 pointer-events-none
                    peer-placeholder-shown:translate-y-2 peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-75
                    peer-focus:-translate-y-2.5 peer-focus:text-primary peer-focus:scale-75`

    return (
        <div className="relative mt-4">
            <input
                id={name}
                type={type}
                placeholder=" "
                {...register(name)}
                className={inputStyle}
            />
            <label htmlFor={name} className={labelStyle}>
                {label}
            </label>
            {error && <p className="text-red-500 text-sm px-1 mt-1">{error}</p>}
        </div>
    )
}

export default FloatingInput