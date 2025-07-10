import React from 'react';
import Image from 'next/image';

interface IInputField extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    labelSize?: 'text-sm' | 'text-base';
    isError?: string;
    errorResponseMessage?: string | null;
    isPasswordVisible?: boolean;
    handlePasswordVisibility?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled: boolean;
}

/** 폼 공통 Input Field
 * @props label 라벨 텍스트
 * @props labelSize 라벨 텍스트 크기
 * @props id 인풋 아이디
 * @props type 인풋 타입
 * @props placeholder 인풋 플레이스홀더
 * @props isError 인풋 에러 여부
 * @props errorResponseMessage 인풋 에러 메시지
 * @props disabled 인풋 비활성화 여부
 * @props isPasswordVisible 비밀번호 보기 여부
 * @props handlePasswordVisibility 비밀번호 보기 핸들러
 * @props ...props 나머지 인풋 속성
 * @description 소수점 입력시 스핀버튼 숨김 적용됨
 */
const InputField = React.forwardRef<HTMLInputElement, IInputField>(
    ({ label, labelSize = 'text-sm', id, type, placeholder, isError, errorResponseMessage, disabled, isPasswordVisible, handlePasswordVisibility, ...props }, ref) => (
        <div className="w-full flex flex-col gap-2">
            <label htmlFor={id} className={`block ${labelSize} font-bold`}>{label}</label>
            <div className='relative'>
                <input
                    ref={ref}
                    type={label === '비밀번호' ? (isPasswordVisible ? 'text' : 'password') : type}
                    id={id}
                    placeholder={placeholder}
                    aria-invalid={disabled ? (isError ? 'true' : 'false') : undefined}
                    className={`block w-full p-2.5 rounded-lg bg-slate-50 text-sm border-2 focus:outline-none ${isError || errorResponseMessage ? 'border-red-600' : 'focus:border-main'} [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                    {...props}
                />
                {label === '비밀번호' && (
                    <button
                        type="button"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-60"
                        onClick={handlePasswordVisibility}
                        tabIndex={-1}
                    >
                        <Image
                            src={isPasswordVisible ? "https://res.cloudinary.com/dbvzbdffi/image/upload/v1749713866/visibility_on_jh4sec.svg" : "https://res.cloudinary.com/dbvzbdffi/image/upload/v1749713865/visibility_off_qtspno.svg"}
                            alt="비밀번호 보기 숨김"
                            width={24}
                            height={24}
                        />
                    </button>
                )}
            </div>
            {errorResponseMessage ? (
                <p className='text-red-600 text-sm'>{errorResponseMessage}</p>
            ) :
                (isError && <p className='text-red-600 text-sm'>{isError}</p>)
            }
        </div>
    )
);

InputField.displayName = 'InputField';

export default InputField;