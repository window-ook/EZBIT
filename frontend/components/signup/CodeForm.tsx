import InputField from '@/components/shared/InputField';

/** 회원가입 인증 코드 폼
 * @props code 인증 코드
 * @props setCode 인증 코드 설정
 */
export default function CodeForm({ code, setCode }: { code: string, setCode: (code: string) => void }) {
    return (
        <section className="flex flex-col gap-6">
            <InputField
                label="인증 코드"
                type="text"
                id="code"
                placeholder='인증 코드를 입력해주세요'
                disabled={false}
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
        </section>
    );
}
