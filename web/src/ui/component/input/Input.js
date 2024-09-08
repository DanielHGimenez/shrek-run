import React from 'react'

export default function Input({ label, prefix, placeholder, inputValue, onChangeInput }) {

    function onChange(event, fn) {
        fn(event.target.value)
    }

    return (
        <div>
            <label htmlFor="input" className="block text-left text-sm font-medium leading-6 text-gray-900">{label}</label>
            <div className="relative mt-2 rounded-md shadow-sm">
                { prefix &&
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">{prefix}</span>
                    </div>
                }

                <input
                    id="input"
                    name="input"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 px-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(event) => onChange(event, onChangeInput)}
                />
            </div>
        </div>
    )
}
